import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tipohorario',
  templateUrl: './tipohorario.page.html',
  styleUrls: ['./tipohorario.page.scss'],
})
export class TipohorarioPage implements OnInit {
  datos=[]
  constructor(
    private navCtrl:NavController,
    private usuario:UsuarioProvider,
    private storage:Storage,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    console.log('tipo horarios page');
    
  }
  ionViewWillEnter(){

    this.cargardatos()
  }
  crearhorario(){
    console.log('hola');
    this.navCtrl.navigateForward('adm/perfil/tipohorario/mishorarios')
  }
  cargardatos(){
    this.storage.get('idusuario')
    .then(id=>{
      return this.usuario.listarTipohorario(1,id)
    })
    .then(res=>{
      console.log(res);
      this.datos=res
    })
    .catch(err=>console.log(err))
  }
  async presentActionSheet(item,i) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          this.presentAlertConfirm(item,i)
        }
      }, {
        text: 'modificar',
        icon: 'paper',
        handler: () => {
          console.log('Share clicked' ,item,i);
          this.navCtrl.navigateForward(['adm/perfil/tipohorario/mishorarios',item])
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
  
    await actionSheet.present();
  }
  async presentAlertConfirm(item,i) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Message <strong>Seguro que desea dar de baja el horario</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.usuario.modificarestadotipohorario(item.idtipo_horario,0)
            .then(()=>{
              this.presentToast('Se dio de baja el horario correctamente.')
              this.datos.splice(i,1)
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
