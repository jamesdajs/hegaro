import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
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
    private toastController:ToastController,
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
    let texto=datos.estado==1?'Desactivar':"Activar"
    let icon=datos.estado==1?'trash':"add"
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
          text: texto,
          icon:icon,
          handler: () => {
            console.log('Archive clicked');
            this.presentAlert(datos.iddatos_ins,datos.estado)
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
    this.serviciolugar.listarlugaresadm(id)
    .then(resp=>{
      this.datos=resp
    })
  }

  async presentAlert(id,estado) {
    let text=estado==1?'El lugar pasará a estado desactivo y no podras asignar a nuevos cursos':'El lugar pasará a estado activo y estará disponible para adicionar a tus cursos'
    
    const alert = await this.alertController.create({
      header: 'Estas seguro de cambiar de estado?',
      message: text,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            let es=estado==1?0:1
            let toasrtxt=estado==1?'Se dió de baja el lugar de trabajo correctamente.':'Se activo el lugar de trabajo correctamente.'
            this.serviciolugar.eliminar(id,es).then(resp=>{
              this.presentToast(toasrtxt)
              this.listar(this.idusu)
            })
          }
        }
      ]
    });
  
    await alert.present();
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }
}
