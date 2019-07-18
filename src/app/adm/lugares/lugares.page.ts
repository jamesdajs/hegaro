import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LugaresService } from 'src/app/services/lugares/lugares.service';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
})
export class LugaresPage  {

  datos=[]
  idusu
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private serviciolugar: LugaresService,
    private storage:Storage,
    private alertController:AlertController,
    private routes:Router,
  ) {
    this.storage.get("idusuario")
    .then(id => {
      this.idusu=id
      this.listar(id)
    })
   }

   ionViewWillEnter(){
    this.listar(this.idusu)
    }

  //----------FUNCION DESLIZAR OPCIONES---------------
  opciones(datos,i){
    this.actionSheetCtrl.create({
      buttons:[
        {
          text: 'Modificar',
          icon: 'create',
          handler: () => {
            this.routes.navigate(["/adm/perfil/lugares/modlugar"],datos)
          }
        },
        {
          text: 'Eliminar',
          icon:'trash',
          handler: () => {
            console.log('Archive clicked');
            this.presentAlert(datos.iddatos_ins,i)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).then(actionsheet => {
      actionsheet.present();
    });
  }

  crearlugar(){
    this.routes.navigate(["/adm/perfil/lugares/crearlugar"],this.idusu)
  }

  listar(id){
    this.serviciolugar.listarlugares(id)
    .then(resp=>{
      this.datos=resp
    })
  }

  async presentAlert(id,i) {
    const alert = await this.alertController.create({
      header: 'Estas seguro de eliminar este legar?',
      message: 'Este lugar de trabajo se eliminará completamente',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.datos.splice(i,1)
            this.serviciolugar.eliminar(id,0).then(resp=>{
      
            })
          }
        }
      ]
    });
  
    await alert.present();
  }
}
