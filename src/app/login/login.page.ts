import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
//import { CrearusuarioPage} from '../crearusuario/crearusuario'

import { UsuarioProvider } from '../services/usuario/usuario';
import { AuthFacebookProvider } from '../services/authfacebok/authfacebok';

import { Storage } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';
import { FcmService } from '../services/fcm/fcm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit {

  estado = false
  constructor(
    private auth: AuthFacebookProvider,
    private user: UsuarioProvider,
    private splashscreen: SplashScreen,
    private storage: Storage,
    private loadCtrl: LoadingController,
    private router: Router,
    private fcmservice: FcmService,
    private navCtrl:NavController,
  ) {
  }
  token
  ngOnInit() {
    /*this.user.consultas()
    .then(token=>{
      console.log(token)
      //this.token=token
    })
    .catch(err=>console.log(err))*/
    this.storage.get("idusuario")
      .then(id => {
        if (id) this.navCtrl.navigateRoot(['/adm/cursos', { hola: 'holamundo' }])
      })


  }

  async loginWithFacebook() {

    const cargar = await this.loadCtrl.create({
      message: "Cargando datos..."

    })
    await cargar.present()
    this.conectarFacebook()
      .then(res => {
        console.log(res)
        //cli
        this.navCtrl.navigateRoot(['/adm/cursos', { hola: 'holamundo' }])
        cargar.dismiss()
        /**
         * 
         this.fcm.getToken().then(token=>{
           console.log("token",token);
           alert(token)
           
         }).catch(error=>{
           alert(JSON.stringify(error))
         })
         */
      })
      .catch(err => {
        console.log(err)
        cargar.dismiss()
      })
      
  }
  loginWithFacebook2() {
    this.auth.facebookauth()

  }
  conectarFacebook() {
    return new Promise((resolve, reject) => {
      this.auth.loginWithFacebook().then(data => {
        console.log(data)
        this.user.verUsuarioIDfb(data.id)
        
          .then(userFb => {
            let idusu=userFb[0].idusuarios
            if (userFb.length > 0) {
              this.storage.set('idusuario', idusu);
              this.storage.set('rol', "alumno");
              //this.storage.set('token',this.fcm.getToken())
              if(data.token)
                return this.user.actualizarusuario(data,idusu)
              else 
              return this.user.actualizarusuariosintoken(data,idusu)
            } else {
              if(data.token)
              return this.user.guardarusuario(data)
                .then(idnewusu => {
                  this.storage.set('rol', "alumno");
                  this.storage.set('idusuario', idnewusu);
                  //console.log(datas)
                  return true
                })
                else 
                this.user.guardarusuariosintoken(data)
                .then(idnewusu => {
                  this.storage.set('rol', "alumno");
                  this.storage.set('idusuario', idnewusu);
                  //console.log(datas)
                  return true
                })
            }
          })
          .then(()=>{
            resolve('datos resueltos correctos correctos')
          })
          .catch(err=>console.log(err))
      })
        .catch(err => {
          reject(err)
        })
    })
  }
}


