import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private router:Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          //alert('Received in background');
          this.router.navigate([data.landing_page]);
        } else {
          //alert('Received in foreground');
          this.router.navigate([data.landing_page]);
        }
      }
      ,err=>{
        console.log(err);
        
      })

      this.fcm.onTokenRefresh()
      .subscribe(token=>{
        alert(token)
      },err=>{
        console.log(err);
        
      })
    });
  }


}
