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
      return this.usuario.listarTipohorario(id)
    })
    .then(res=>{
      console.log(res);
      this.datos=res
    })
    .catch(err=>console.log(err))
  }
  async presentActionSheet(item,i) {
    let texto=item.estado==1?'Desactivar':"Activar"
    let icon=item.estado==1?'trash':"add"
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: texto,
        role: 'destructive',
        icon: icon,
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
    let text=item.estado==1?'Seguro que desactivar el horario':'Seguro que desea activar el horario'
    const alert = await this.alertController.create({
      
      header: 'Cambiar de estado!',
      message: '<strong>'+text+'</strong>!!!',
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
            let estado=item.estado==1?0:1
            let toasrtxt=item.estado==1?'Se dio de baja el horario correctamente.':'Se activo el horario correctamente.'
            this.usuario.modificarestadotipohorario(item.idtipo_horario,estado)
            .then(()=>{
              this.presentToast(toasrtxt)
              //this.datos.splice(i,1)
              this.cargardatos()
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
