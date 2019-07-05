import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  url = "https://fcm.googleapis.com/fcm/send"
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": "key=AAAAIycp-GE:APA91bHFgDb_8rmpj5V2F7iMcgXlAJBQoMne5B6FfpFMKCcbMgTsD9pcx3jDnrYIq5P4K0WCoo7UsyUXOOdrtRSbh11cADDuNqCEsbMFm_cMNdr6ADVAsR5xsMwd96ssg-_5zpW0_Hvb"
  })
  constructor(private fcm: FCM, private http: HttpClient) { }

  getToken() {
    return this.fcm.getToken()
  }

  refreshToken() {
    return this.fcm.onTokenRefresh()
  }

  suscribeTopic(topic) {
    return this.fcm.subscribeToTopic(topic);
  }

  onsuscribeTopic(topic) {
    return this.fcm.unsubscribeFromTopic(topic);
  }

  //envia mensajes a firebase
  notificacionforToken(titulo:string, body:string, token_cli, id:string, page:string) {
    let notificacion = { 
      "notification":{
        "title":titulo,
        "body":body,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "landing_page": page,
        "idusu": id
      },
      "to" : token_cli,
      "priority": "high",
      "restricted_package_name": ""
    }
    console.log(notificacion);
    return this.http.post(this.url,notificacion , { headers: this.headers })
      .toPromise()
  }

  //envia mensajes a firebase
  notificacionforTopic(titulo, body, topic, id, page) {
    let notificacion = {
      "notification": {
        "title": titulo,
        "body": body,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon"
      },
      "data": {
        "landing_page": page,
        "idusu": id
      },
      "to": topic,
      "priority": "high",
      "restricted_package_name": ""
    }
    return this.http.post(this.url, notificacion, { headers: this.headers })
      .toPromise()
  }
}
