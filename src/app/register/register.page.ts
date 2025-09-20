import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  constructor(private router: Router) {}

  ngOnInit() {}

  async onRegister() {
    // Validasi field kosong
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Peringatan',
        message: 'Semua field wajib diisi!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Validasi password
    if (this.password !== this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Password Tidak Sama',
        message: 'Password dan Konfirmasi Password harus sama.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      // Panggil AuthService → Firebase register
      await this.authService.register(this.email, this.password);

      // Tampilkan notifikasi sukses
      const toast = await this.toastCtrl.create({
        message: 'Registrasi berhasil! Selamat datang 🎉',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      // Arahkan langsung ke Tabs (halaman utama)
      this.navCtrl.navigateRoot('/tabs');
    } catch (error: any) {
      const alert = await this.alertCtrl.create({
        header: 'Registrasi Gagal',
        message: error.message || 'Terjadi kesalahan saat registrasi.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
