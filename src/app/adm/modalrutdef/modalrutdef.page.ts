import { Component, OnInit, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FcmService } from 'src/app/services/fcm/fcm.service';

@Component({
  selector: 'app-modalrutdef',
  templateUrl: './modalrutdef.page.html',
  styleUrls: ['./modalrutdef.page.scss'],
})
export class ModalrutdefPage implements OnInit {
  rutinas = []

  myForm: FormGroup
  idselect = ''
  @Input() idusuarios
  @Input() titulo
  @Input() token
  @Input() id_curso
  constructor(
    private storage: Storage,
    private rutina: RutinaProvider,
    public modalController: ModalController,
    public toastController: ToastController,
    private formb: FormBuilder,
    private fcm : FcmService
  ) {
    this.myForm = this.formb.group({
      fechaini: ['', [Validators.required]],
      fechafin: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    console.log(this.idusuarios);

    this.cargardatos()
  }
  cargardatos() {
    this.storage.get('idusuario')
      .then(idusu => this.rutina.listarRutinas(idusu, true, 'd'))
      .then(array => {
        console.log(array);
        for (let i in array) {
          array[i]['estadohidden'] = false
        }
        this.rutinas = array
      })
  }
  salir() {
    this.modalController.dismiss()
  }
  guardar() {
    console.log(this.idusuarios, this.idselect, this.myForm.value);
    if (this.myForm.valid)
      this.rutina.crearRut_Usu(this.idusuarios, this.idselect,this.id_curso, this.myForm.value)
        .then(res=>{
          return this.fcm.notificacionforToken(
            'Rutina asignada',
          'Tienen una nueva rutina en el curso '+this.titulo,
          this.token,
          '',
          '/cli/mis-cursos'
          )
        })
        .then(res => {
          this.presentToast('Se asigno correctamente la rutina al alumno')
          this.modalController.dismiss()
        })
        .catch(err => {
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
