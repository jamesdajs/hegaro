import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  url=""
  headers = new HttpHeaders({
    "Content-Type": "application/json"
  })
  constructor(private fcm:FCM,private http: HttpClient) { }

   getToken(){
    return  this.fcm.getToken()
  }

  refreshToken(){
    return this.fcm.onTokenRefresh()
  }

  suscribeTopic(topic){
    this.fcm.subscribeToTopic(topic);
  }

  onsuscribeTopic(topic){
    this.fcm.unsubscribeFromTopic(topic);
  }

  //envia mensajes a firebase
  notificacionforToken(titulo,body,token_cli,id,page) {
    let notificacion={
    notification:{
      title:titulo,
      body:body,
      sound:"default",
      click_action:"FCM_PLUGIN_ACTIVITY",
      icon:"fcm_push_icon"
    },
    data:{
      landing_page:page,
      idusu:id
    },
      to:token_cli,
      priority:"high",
      restricted_package_name:""
  }
    return this.http.post(this.url, {notificacion }, { headers: this.headers})
      .toPromise()
  }

  //envia mensajes a firebase
  notificacionforTopic(titulo,body,topic,id,page) {
    let notificacion={
    notification:{
      title:titulo,
      body:body,
      sound:"default",
      click_action:"FCM_PLUGIN_ACTIVITY",
      icon:"fcm_push_icon"
    },
    data:{
      landing_page:page,
      idusu:id
    },
      topic:topic,
      priority:"high",
      restricted_package_name:""
  }
    return this.http.post(this.url, {notificacion }, { headers: this.headers})
      .toPromise()
  }
}
