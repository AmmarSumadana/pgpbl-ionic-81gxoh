import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
  standalone: false,
})
export class SplashscreenPage implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      window.location.href = 'register';
    }, 3000); // Redirect to /home after 3 seconds
  }
}
