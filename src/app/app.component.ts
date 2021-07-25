import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/service/auth.service';

import { Plugins, Capacitor } from '@capacitor/core'
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
    ) {
      this.initializeApp()
    }

    initializeApp() {
      this.platform.ready().then(() => {
        if(Capacitor.isPluginAvailable('SplashScreen')) {
          Plugins.SplashScreen.hide()
        }
      })
    }


  onLogout() {
    this.authService.logOut()
    this.router.navigateByUrl('/auth')
  }
}
