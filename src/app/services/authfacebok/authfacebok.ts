import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform, AlertController } from '@ionic/angular';

//import firebase from 'firebase/app';


import { auth } from 'firebase';
import { Observable } from "rxjs/Observable";
import { FcmService } from '../fcm/fcm.service';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';

import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
@Injectable()
export class AuthFacebookProvider {
    constructor(private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform,
        public alertController: AlertController,
        private fcmservice: FcmService,
       // private gplus:GooglePlus,
        private storage:Storage
    ) {

    }
    datosusario = {}
    loginWithFacebook(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                this.fb.login(['email', 'public_profile'])
                .then(res => {
                    //alert(JSON.stringify(res))
                    const facebookCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
                    return this.afAuth.auth.signInWithCredential(facebookCredential)
                })
                .then(user => {
                    this.datosusario = user.additionalUserInfo.profile
                    this.datosusario["foto"] = user.user.photoURL
                    return this.fcmservice.getToken()
                })
                .then(token => {
                    this.datosusario["token"] = token
                    resolve(this.datosusario);
                })
                .catch((err)=>{
                    reject(err)
                })
            } else {
                this.afAuth.auth
                    .signInWithPopup(new auth.FacebookAuthProvider())
                    .then((res: any) => {
                        this.datosusario = res.additionalUserInfo.profile
                        this.datosusario["foto"] = res.user.photoURL
                        /**
                            let datosprueva={
                                id:1231233,name:'juan perez',foto:'nada'
                            }
                         * 
                         */
                        //cambiar datosprueva o this.datosusario
                        resolve(this.datosusario);
                    }).catch(error => {
                        reject(error);
                    });
            }
        });
    }
    logout() {
        this.afAuth.auth.signOut();

        if (this.platform.is('cordova')) 
            //this.gplus.logout()
            this.fb.logout()
                .then(() => {
                    console.log("cerrando sesion de ios")
                })
    }
    veriduser() {
        return Promise.resolve(this.afAuth.auth.currentUser.uid)
    }
    veridusercompleto() {
        return Promise.resolve(this.afAuth.auth.currentUser)
    }
    facebookauth() {
        this.fb.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                console.log('Logged into Facebook!', res)

                this.presentAlert(JSON.stringify(res))
            })
            .catch(e => {
                this.presentAlert(JSON.stringify(e))
                console.log('Error logging into Facebook', e)
            });


        // this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }
    async presentAlert(data) {
        const alert = await this.alertController.create({
            header: 'Alert',
            subHeader: 'Subtitle',
            message: data,
            buttons: ['OK']
        });

        await alert.present();
    }
    /**
     * 
     async nativeGoogleLogin() {
         try {
       
           const gplusUser = await this.gplus.login({
             webClientId: '150980917345-dr0chrt7hclso6i7gib3n1buecrjlf3v.apps.googleusercontent.com',
             offline: true,
             scopes: 'profile email https://www.googleapis.com/auth/drive.file',
             
           })
       
           return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
       
         } catch(err) {
           alert(JSON.stringify(err))
         }
       }
       async webGoogleLogin() {
         try {
           const provider = new firebase.auth.GoogleAuthProvider();
           return await this.afAuth.auth.signInWithPopup(provider);
       
         } catch(err) {
           console.log(err)
         }
       
       }
       googleLogin() {
         if (this.platform.is('cordova')) {
           return this.nativeGoogleLogin()
             .then(user => {
 
                 alert(JSON.stringify(user.user));
                 user.user.getIdToken()
                 .then(token=>{
                     this.storage.set('gtoken',token)
                 })
                 this.datosusario = user.user
                 this.datosusario["foto"] = user.user.photoURL
                 this.datosusario["id"] = user.user.providerData[0].uid
                 this.datosusario["name"] = user.user.displayName
                 return this.fcmservice.getToken()
             })
             .then(token => {
                 this.datosusario["token"] = token
                 return this.datosusario
           })
         } else {
            return this.webGoogleLogin()
            .then(user => {
             this.datosusario = user.additionalUserInfo.profile
             this.datosusario["foto"] = user.user.photoURL
 
             return this.datosusario
       })
         }
       }
       
       signOut() {
         this.afAuth.auth.signOut();
         if (this.platform.is('cordova')) 
             this.gplus.logout()
       }
     */
}
