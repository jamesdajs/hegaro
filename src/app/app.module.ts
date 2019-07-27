import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {AngularFireAuth} from '@angular/fire/auth';

import { UsuarioProvider } from './services/usuario/usuario';
import { AuthFacebookProvider } from './services/authfacebok/authfacebok';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FCM } from '@ionic-native/fcm/ngx';

//agregados

import { Facebook } from '@ionic-native/facebook/ngx';
import { firebaseConfig } from "./app.config";
//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFirestoreModule } from "angularfire2/firestore";

import { AngularFireStorageModule } from 'angularfire2/storage';
//dsa
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClientModule } from '@angular/common/http';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthGuardService } from './services/auth-guard.service';

import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { IonicStorageModule } from '@ionic/storage';
//import { Firebase } from '@ionic-native/firebase/ngx';

@NgModule({
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    AngularFireAuth,
    UsuarioProvider,
    AuthFacebookProvider,
    Facebook,
    ImagePicker,
    Crop,
    File,
    SocialSharing,
    AuthGuardService,
    Clipboard,
    WheelSelector
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
