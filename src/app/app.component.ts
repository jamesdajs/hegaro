import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
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
    private router:Router,
    private notificaciones:LocalNotifications
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
          this.router.navigate([data.landing_page]);
        } else {
          this.notificaciones.schedule({
            id: 1,
            title: data.title,
            text: data.body,
            sound: 'default',
            data: { secret: data.idusu }
          });
          this.router.navigate([data.landing_page]);
        }
      }
      ,err=>{
        console.log(err);
      })

      this.fcm.onTokenRefresh()
      .subscribe(token=>{
       // alert(token)
      },err=>{
        console.log(err);
        
      })
    });
  }


}
