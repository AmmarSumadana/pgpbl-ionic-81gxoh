import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';

  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);

  constructor(private router: Router, private toastCtrl: ToastController) {}

  async onLogin() {
    if (this.email && this.password) {
      try {
        await this.authService.login(this.email, this.password);
        this.navCtrl.navigateRoot('/tabs');
      } catch (error: any) {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: error.message || 'Terjadi kesalahan saat login',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
