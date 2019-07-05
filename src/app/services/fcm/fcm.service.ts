import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  url="https://fcm.googleapis.com/fcm/send"
  headers = new HttpHeaders({
    "Content-Type": "application/json; UTF-8",
    "Accept": "application/json",
    "Authorization": "key=AAAAIycp-GE:APA91bGtP1dPftavhSZWo3pCx_mi3R0bhYEKOyro8mJX1xolW8T98d2hGIl9aPdk1Xe9Or1TUh1Ho-ahWYQx6G42I8oWLn3QEiVUGKkXqNqU4UmYj6FRAlKzgERYqp79AUeztRvk4dMK"
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
    console.log(titulo+" "+body+" "+token_cli+" "+id+" "+page);
    let jsonparam={
              "message":{
                "topics":"/topics/all",
                "priority":"high",
                "notification":{
                  "title":titulo,
                  "body":body,
                  "click_action":"FCM_PLUGIN_ACTIVITY",
                  "icon":"fcm_push_icon"
                }
              },
              "data":{
                "landing_page":page,
              }
          }
            console.log(jsonparam);
            
    return this.http.post(this.url, jsonparam, { headers: this.headers})
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
      to:topic,
      priority:"high"
  }

  console.log(notificacion);
  
    return this.http.post(this.url, {notificacion }, { headers: this.headers})
      .toPromise()
  }
}
