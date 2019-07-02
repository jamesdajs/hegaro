import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonList, ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RutinaProvider } from 'src/app/services/rutina/rutina';

@Component({
  selector: 'app-ejercicios',
  templateUrl: './ejercicios.page.html',
  styleUrls: ['./ejercicios.page.scss'],
})
export class EjerciciosPage implements OnInit {
  @ViewChild('lista') lista: IonList
  ejercicios=[]
  datos = {
    idtipo_ejercicios: '',
    nombre: '',
    idusuario: ''
  }
  constructor(
    private Aroute: ActivatedRoute,
    private router: Router,
    private rutina:RutinaProvider,
    public toastController: ToastController,
    public alertController: AlertController
  ) {
    for (let i in this.datos)
      this.datos[i] = this.Aroute.snapshot.paramMap.get(i)

  }
  ngOnInit() {
  }
  crear() {
    this.router.navigate(['/adm/tipo-ejercicios/ejercicios/crear', this.datos])
  }
  ionViewWillEnter() {
    this.lista.closeSlidingItems()
    this.cargardatos()

  }
  cargardatos() {
    this.rutina.listarEjercicio(this.datos.idtipo_ejercicios,true)
    .subscribe(data=>this.ejercicios=data)
    
  }
  cambiarEstado(item){
    this.rutina.estadoEjercicio(item.idejercicios,false)
    .then(()=>{
      this.presentToast('Se dio de baja correctamente el ejercicio')
    })
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  async eliminar(item, i) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Seguro que desea dar de baja el ejercicio</strong>!!!',
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
            this.rutina.estadoEjercicio(item.idejercicios,false)
              .then(() => {
                this.presentToast('Se elimino correctamente el tipo de ejercicio')
                this.lista.closeSlidingItems()
                this.ejercicios.splice(i, 1);
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
  modificar(item){
    this.router.navigate(['/adm/tipo-ejercicios/ejercicios/modificar',item])
  }
  verDetalleEjercicio(item){
    this.router.navigate(['/adm/tipo-ejercicios/ejercicios/detalle',item])
  }
}
