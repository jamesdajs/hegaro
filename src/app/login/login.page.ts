import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
//import { CrearusuarioPage} from '../crearusuario/crearusuario'

import { UsuarioProvider } from '../services/usuario/usuario';
import { AuthFacebookProvider } from '../services/authfacebok/authfacebok';

import { Storage } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';
import { FcmService } from '../services/fcm/fcm.service';
import {
  ToastController,
  Platform
} from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit {
  address:string;
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
    public toastCtrl: ToastController
  ) {
  }
  token
  ngOnInit() {
    //this.loadMap()
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
            return this.guardardatos(data)
        })
        .then(idnewusu => {
          this.user.guardaridlocal()
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
 
  loginWithGoodle(){
    this.auth.googleLogin()
    .then(data=>{
     console.log(data);
     return this.guardardatos(data)
      
    })
    .then(newuser=>{
      this.user.guardaridlocal()
      this.storage.set('rol', "alumno");
    })
    .then(()=>{
      this.navCtrl.navigateRoot(['/adm/cursos', { hola: 'holamundo' }])
        return this.fcmservice.suscribeTopic("goodme")
    })
    .then(()=>{
      console.log('se subcribio al topin goodme');
      
    })
    .catch(err => {
      console.log(err)
    })
  }
  salirGoogle(){
    this.auth.signOut()
  }
 
 
 
  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  guardardatos(data){
    return this.user.verUsuarioIDfb(data.id)
 
          .then(userFb => {
            //alert(JSON.stringify(userFb))
  
            if (userFb.length > 0) {
  
            let _idusu = userFb[0].idusuarios
              //this.storage.set('token',this.fcm.getToken())
              if (data.token)
                return this.user.actualizarusuario(data, _idusu)
              else
                return this.user.actualizarusuariosintoken(data, _idusu)
            } else {
                //modificar para ver badges
              if (data.token)
                return this.user.guardarusuario(data)
              else
                return this.user.guardarusuariosintoken(data)
              
            }
          })
  }
}


