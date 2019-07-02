import { Component, OnInit, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modalrutdef',
  templateUrl: './modalrutdef.page.html',
  styleUrls: ['./modalrutdef.page.scss'],
})
export class ModalrutdefPage implements OnInit {
  rutinas=[]
  personal={
    fechaini:'',
    fechafin:''
  }
  idselect=''
  @Input() idusuarios
  constructor(
    private storage :Storage,
    private rutina:RutinaProvider,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    console.log(this.idusuarios);
    
    this.cargardatos()
  }
  cargardatos() {
    this.storage.get('idusuario')
      .then(idusu => this.rutina.listarRutinas(idusu, true,'d'))
      .then(array => {
        console.log(array);
        for(let i in array){
          array[i]['estadohidden']=false
        }
        this.rutinas = array
      })
  }
  salir() {
    this.modalController.dismiss()
  }
  guardar() {
    this.rutina.crearRut_Usu(this.idusuarios,this.idselect,this.personal)
    .then(res=>{
      this.presentToast('Se asigno correctamente la rutina al alumno')
      this.modalController.dismiss()
    })
    .catch(err=>{
      console.log(err);
      this.presentToast('error al asignar la rutina al alumno')
      
    })
  }
  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }

}
