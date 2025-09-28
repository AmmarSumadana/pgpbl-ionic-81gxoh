// Ganti seluruh file maps.page.ts dengan ini

import { Component, inject } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { DataService } from '../data.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage {
  private dataService = inject(DataService);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);
  private actionSheetCtrl = inject(ActionSheetController);

  map!: L.Map | null; // Izinkan map menjadi null
  private markers: L.Marker[] = [];

  constructor() {}

  ionViewDidEnter() {
    // Gunakan ionViewDidEnter karena ini menjamin halaman sudah visible
    if (!this.map) {
      this.initMap();
    }
  }

  ionViewWillEnter() {
    // Muat ulang data jika peta sudah ada
    if (this.map) {
      this.loadPoints();
    }
  }

  // PENTING: Hancurkan peta saat meninggalkan halaman
  ionViewDidLeave() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  initMap() {
    this.map = L.map('map').setView([-7.7956, 110.3695], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    this.loadPoints();
  }

  clearMarkers() {
    if (this.map) {
      this.markers.forEach(marker => this.map!.removeLayer(marker));
    }
    this.markers = [];
  }

  async loadPoints() {
    if (!this.map) return;
    this.clearMarkers();
    const points: any = await this.dataService.getPoints();
    if (!points) return;
    for (const key in points) {
      // ... (sisa logika loadPoints sama, tidak perlu diubah)
      if (points.hasOwnProperty(key)) {
        const point = points[key];
        if (point && point.coordinates && typeof point.coordinates === 'string') {
          const coordsArray = point.coordinates.split(',');
          if (coordsArray.length === 2) {
            const lat = parseFloat(coordsArray[0]);
            const lng = parseFloat(coordsArray[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              const marker = L.marker([lat, lng] as L.LatLngExpression).addTo(this.map);
              marker.bindPopup(`<b>${point.name}</b>`);
              marker.on('click', () => this.showActionSheet(key, point.name));
              this.markers.push(marker);
            }
          }
        }
      }
    }
  }

  async showActionSheet(key: string, pointName: string) {
    // ... (Logika ActionSheet sama, tidak perlu diubah)
    const actionSheet = await this.actionSheetCtrl.create({
      header: pointName,
      buttons: [
        { text: 'Edit', icon: 'create-outline', handler: () => this.editPoint(key) },
        { text: 'Delete', role: 'destructive', icon: 'trash-outline', handler: () => this.confirmDelete(key) },
        { text: 'Cancel', icon: 'close', role: 'cancel' },
      ],
    });
    await actionSheet.present();
  }

  editPoint(key: string) {
    this.navCtrl.navigateForward(`/editpoint/${key}`);
  }

  async confirmDelete(key: string) {
    // ... (Logika confirmDelete sama, tidak perlu diubah)
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete this point?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: async () => { await this.dataService.deletePoint(key); this.loadPoints(); } },
      ],
    });
    await alert.present();
  }
}
