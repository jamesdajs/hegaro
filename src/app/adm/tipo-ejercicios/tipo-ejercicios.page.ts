import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina'
import { Storage } from '@ionic/storage';
import { ToastController, AlertController, IonList } from '@ionic/angular';

@Component({
  selector: 'app-tipo-ejercicios',
  templateUrl: './tipo-ejercicios.page.html',
  styleUrls: ['./tipo-ejercicios.page.scss'],
})
export class TipoEjerciciosPage implements OnInit {
  @ViewChild('lista') lista: IonList
  tipoejer = [
    { nombre: "hombro" },
    { nombre: "brazos" },
    { nombre: "piernas" }
  ]
  tipos=[]
  constructor(
    private router: Router,
    private rutina: RutinaProvider,
    private storage: Storage,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    //his.cargardatos()
  }
  crear() {
    this.router.navigate(["/adm/tipo-ejercicios/crear"])
  }
  cargardatos() {
    this.storage.get('idusuario')
      .then(idusu => this.rutina.listarTipoEjercicio(idusu))
      .then(data => this.tipos = data)
  }

  modificar(item) {
    this.router.navigate(["/adm/tipo-ejercicios/crear", item])
  }

  async eliminar(item, i) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Seguro que desea aliminar el tipo</strong>!!!',
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
            this.rutina.eliminarTipoEjercicio(item.idtipo_ejercicios)
              .then(() => {
                this.presentToast('Se elimino correctamente el tipo de ejercicio')
                this.lista.closeSlidingItems()
                this.tipos.splice(i, 1);
              })
              .catch(err => {
                console.log(err);
                this.presentToast('No puede eliminar el tipo por que tiene ejercicios en el')

              })
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  ionViewWillEnter() {
    this.lista.closeSlidingItems()
    this.cargardatos()

  }
  verejercicios(item) {

    this.router.navigate(["/adm/tipo-ejercicios/ejercicios",item])
  }
}
