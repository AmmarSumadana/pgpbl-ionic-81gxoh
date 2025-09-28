// Ganti seluruh file editpoint.page.ts dengan ini

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from '../data.service';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl, iconUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  tooltipAnchor: [16, -28], shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-editpoint',
  templateUrl: './editpoint.page.html',
  styleUrls: ['./editpoint.page.scss'],
  standalone: false,
})
export class EditpointPage implements OnInit {
  map!: L.Map | null;
  key = '';
  name = '';
  coordinates = '';
  isDataLoaded = false;

  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private dataService = inject(DataService);

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.key = this.route.snapshot.paramMap.get('key') || '';
    if (!this.key) { this.navCtrl.back(); return; }

    const point: any = await this.dataService.getPoint(this.key);
    if (point) {
      this.name = point.name;
      this.coordinates = point.coordinates;
      this.isDataLoaded = true;
    } else {
      this.navCtrl.back();
    }
  }

  ionViewDidEnter() {
    if (this.isDataLoaded && !this.map) {
      this.initMap();
    }
  }

  ionViewDidLeave() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  initMap() {
    if (!this.coordinates) return;
    const initialCoords = this.coordinates.split(',').map(c => parseFloat(c)) as L.LatLngExpression;
    this.map = L.map('mapedit').setView(initialCoords, 13);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const marker = L.marker(initialCoords, { draggable: true }).addTo(this.map);
    marker.bindPopup('Drag the marker to change the coordinates').openPopup();

    marker.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      this.coordinates = `${latlng.lat.toFixed(9)},${latlng.lng.toFixed(9)}`;
    });
  }

  async save() {
    // ... (Logika save sama, tidak perlu diubah)
    if (this.name && this.coordinates) {
      try {
        await this.dataService.updatePoint(this.key, { name: this.name, coordinates: this.coordinates });
        this.navCtrl.back();
      } catch (error: any) {
        const alert = await this.alertCtrl.create({ header: 'Save Failed', message: error.message, buttons: ['OK'] });
        await alert.present();
      }
    }
  }
}
