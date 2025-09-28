// Ganti seluruh file createpoint.page.ts dengan ini

import { Component, inject } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl, iconUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  tooltipAnchor: [16, -28], shadowSize: [41, 41],
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-createpoint',
  templateUrl: './createpoint.page.html',
  styleUrls: ['./createpoint.page.scss'],
  standalone: false,
})
export class CreatepointPage {
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private dataService = inject(DataService);

  map!: L.Map | null;
  name = '';
  coordinates = '';

  constructor() {}

  ionViewDidEnter() {
    if (!this.map) {
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
    const initialLatLng: L.LatLngExpression = [-7.7956, 110.3695];
    this.map = L.map('mapcreate').setView(initialLatLng, 13);

    // FIX: Panggil invalidateSize untuk memperbaiki bug render abu-abu
    // setTimeout memastikan ini berjalan setelah peta sepenuhnya masuk ke DOM
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const marker = L.marker(initialLatLng, { draggable: true }).addTo(this.map);
    marker.bindPopup('Drag the marker to change the coordinates').openPopup();

    const currentLatLng = marker.getLatLng();
    this.coordinates = `${currentLatLng.lat.toFixed(9)},${currentLatLng.lng.toFixed(9)}`;

    marker.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      this.coordinates = `${latlng.lat.toFixed(9)},${latlng.lng.toFixed(9)}`;
    });
  }

  async save() {
    // ... (Logika save sama, tidak perlu diubah)
    if (this.name && this.coordinates) {
      try {
        await this.dataService.savePoint({ name: this.name, coordinates: this.coordinates });
        this.navCtrl.navigateBack('/tabs/maps');
      } catch (error: any) {
        const alert = await this.alertCtrl.create({ header: 'Save Failed', message: error.message, buttons: ['OK'] });
        await alert.present();
      }
    }
  }
}
