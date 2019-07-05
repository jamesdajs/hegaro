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
    private navCtrl: NavController,
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
        return this.fcmservice.suscribeTopic("goodme")
      })
      .then(()=>{
        console.log('se subcribio al topin goodme');
        
      })
      .catch(err => {
        console.log(err)
        //alert(JSON.stringify(err) + ' aqui')
        cargar.dismiss()
      })

  }
  loginWithFacebook2() {
    this.auth.facebookauth()

  }
  conectarFacebook() {
    return new Promise((resolve, reject) => {
      let _idusu, _data
      this.auth.loginWithFacebook()
        .then(data => {
          //alert(JSON.stringify(data))
          _data = data
            return this.user.verUsuarioIDfb(data.id)
        })
        .then(userFb => {
          //alert(JSON.stringify(userFb))

          if (userFb.length > 0) {

          _idusu = userFb[0].idusuarios
            //this.storage.set('token',this.fcm.getToken())
            if (_data.token)
              return this.user.actualizarusuario(_data, _idusu)
            else
              return this.user.actualizarusuariosintoken(_data, _idusu)
          } else {
            if (_data.token)
              return this.user.guardarusuario(_data)
            else
              return this.user.guardarusuariosintoken(_data)
          }
        })
        .then(idnewusu => {
          if (_idusu)
            this.storage.set('idusuario', _idusu);
          else
            this.storage.set('idusuario', idnewusu);
          this.storage.set('rol', "alumno");
          //alert("e creo el usuario")
          resolve('datos resueltos correctos')
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }
}


