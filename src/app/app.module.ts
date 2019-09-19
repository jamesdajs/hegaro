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
import { HttpClientModule,HttpHeaders } from '@angular/common/http';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthGuardService } from './services/auth-guard.service';

import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { IonicStorageModule } from '@ionic/storage';
//import { Firebase } from '@ionic-native/firebase/ngx';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
// graphql
import { HttpLinkModule,HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
let healders= new HttpHeaders({
  "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ1ZDhkNmJhMzYzNWRjNDkyYTUwMTRkNjZjODJmNGQ1NDkyNmNlNjdlNTkyMjhkYjE5ZDE5MTY0YzJlODk5YmYwZmFjOTkzOTgwMmFkM2I0In0.eyJhdWQiOiI2IiwianRpIjoiZDVkOGQ2YmEzNjM1ZGM0OTJhNTAxNGQ2NmM4MmY0ZDU0OTI2Y2U2N2U1OTIyOGRiMTlkMTkxNjRjMmU4OTliZjBmYWM5OTM5ODAyYWQzYjQiLCJpYXQiOjE1Njg5MTA1NTgsIm5iZiI6MTU2ODkxMDU1OCwiZXhwIjoxNjAwNTMyOTU4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.TUFmh2oyVWRQ0nCtDn2IqTUVmrxLTXr7xTIMDUOdfjlaTjKtlZAYwyW63BTRrgMoD_We7huLYGFGkBbXmmFNw2kDgM5USAY9H2biAIVXn8MfPMaEQc3f2b70U_wUwF6CUKaLBxdeC_HPlOGbacbMmDpL59ZPk7qNAqmEr_XPLI-dLWIFk50siU0KFc4_XbFJ2j2z6L6QRkctl2A2fhYOO5vJwfAEXgxYQy2_IJSDNhnbExKp6AMIEvPZRktDF2vrrkV8Lt79O5p375yh3NdTSE12zNd9iJdMnmf-fmehF_J7jNE9rQ79YKjjr5oJQyZ0XwZZLafkdDo7wutsgEDIlLVA53UvU_Ikyk0jFs6PXbvSV2GYMGl2oJHrTPdb3wuYRPlRJMSfDmOun7GaQTl6SJ3vQDc0gb-3xOFzdgpYn-2UqqxDW2lpVM7qH9CRpiBIYTowsium_FCrYEco9SWlU8ri4Ufna3R-USjlhx7HbhEcvWJgfFPlAb0iDZ9MOKvml5_pfs4WBPlZ8uVKtQKz4PgHzXf6K8yJ_NUc-GYciafAanHz4Tg6f9ucHvjf8aBbJaFn7lxBda7GMO2Nc7R92YkpQw2WekDtHQaRc_HzPx3lyFiRClucO_Gcy35gJNkaz14_MB0_RUqxbeNTsZF2lxav-J6yTnhFruOYDnYiFos"
})
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
    
    HttpLinkModule,
    ApolloModule
  ],
  declarations: [AppComponent],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: "http://localhost:8000/graphql",
            headers:healders
          })
        }
      },
      deps: [HttpLink]
    },
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
    WheelSelector,
    //GooglePlus,
    Camera,
    VideoEditor
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
