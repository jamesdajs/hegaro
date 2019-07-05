import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { AlertController, NavController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { AuthFacebookProvider } from 'src/app/services/authfacebok/authfacebok';


@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.page.html',
  styleUrls: ['./miperfil.page.scss'],
})
export class MiperfilPage implements OnInit {



  datos = []
  genero = "hombre"
  verdatos = true
  id
  constructor(
    private storage: Storage,
    private user: UsuarioProvider,
    public alertController: AlertController,
    private navCtrl: NavController,
    private fmcservice:FcmService,
    private logfb:AuthFacebookProvider

  ) {

  }

  ngOnInit() {
    console.log("Perfil Page");
    this.storage.get("idusuario")
      .then(id => {
        console.log(id)
        this.id = id
        this.cargardatos(id)
      })

  }
  cargardatos(id) {
    this.user.verUsuarioIDdbinstructor(id)
      .then(datos => {
        console.log(datos[0])
        this.genero = datos[0].genero == 'm' ? 'Mujer' : 'Hombre'

        this.datos = datos
      })
      .catch(err => console.log(err))
  }
  

  changeInstructor() {

    this.storage.set('rol', "instructor")
      .then(() => {
        return this.storage.get('rol')
      })
      .then(rol => {
        console.log("rol before change:" + rol)

        this.navCtrl.navigateRoot(['/adm/perfil'])
        return this.user.creardatosInstructor({
          descripcion: '',
          direccion: '',
          lat: '',
          lng: '',
          zoom: ''
        }, this.id)
      })
      .then(() => {
        console.log('se creo datos de instructor')

      })
      .catch(err => {
        console.log(err, 'datos ya creados')
      }
      )
  }
  modificarperfil() {
    this.navCtrl.navigateForward(['/cli/miperfil/modmiperfil',this.datos[0]])
  }
  ionViewWillEnter(){
    this.storage.get("idusuario")
    .then(id => {
      this.id = id
      this.cargardatos(id)
    })
  }
  mensages(){
    this.fmcservice.notificacionforTopic('hola','nada','/topics/all','1','nada')
    .then(res=>{
      console.log(res);
      
    })
    .catch(err=>{console.log(err);
    })
  }
  mensagesroken(){
    this.fmcservice.notificacionforToken('hola','nada','/topics/all','1','nada')
    .then(res=>{
      console.log(res);
      
    })
    .catch(err=>{console.log(err);
    })
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Desea cerrar sesion de GoodMe</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.storage.clear()
              .then(() => {
                this.logfb.logout()
                this.navCtrl.navigateRoot(["/"])
              })
          }
        }
      ]
    });

    await alert.present();
  }
}
