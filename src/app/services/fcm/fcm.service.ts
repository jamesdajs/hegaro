import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private fcm:FCM) { }

   getToken(){
    return  this.fcm.getToken()
  }

  refreshToken(){
    return this.fcm.onTokenRefresh()
  }
}
