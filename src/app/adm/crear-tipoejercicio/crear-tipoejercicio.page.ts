import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-crear-tipoejercicio',
  templateUrl: './crear-tipoejercicio.page.html',
  styleUrls: ['./crear-tipoejercicio.page.scss'],
})
export class CrearTipoejercicioPage implements OnInit {
  nombre = ""
  idrut
  myForm: FormGroup
  constructor(
    private formb: FormBuilder,
    private rutina: RutinaProvider,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private storage:Storage,
  ) {
    this.myForm = this.formb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
    });
    this.idrut = this.route.snapshot.paramMap.get('idtipo_ejercicios')
    if(this.route.snapshot.paramMap.get('nombre'))this.nombre=this.route.snapshot.paramMap.get('nombre')
    this.myForm.setValue({nombre:this.nombre})
  }

  ngOnInit() {
  }
  guardar() {
    if (this.myForm.valid) {
      if (this.idrut)
        this.rutina.modTipoEjercicio(this.myForm.get('nombre').value, this.idrut)
          .then(() => {
            return this.presentLoading("Modificando tipo...")
          })
          .then(load => {
            load.dismiss()
            this.router.navigate(['/adm/tipo-ejercicios/'])
          })
          .catch(err => console.log(err))
      else
          this.storage.get('idusuario')
          .then(idusu=>this.rutina.crearTipoEjercicio(idusu,this.myForm.get('nombre').value))
          .then(() => this.presentLoading("Guardando tipo..."))
          .then(load => {
            load.dismiss()
            this.router.navigate(['/adm/tipo-ejercicios/'])
          })
          .catch(err => console.log(err))
    }
  }
  async presentLoading(text) {
    const loading = await this.loadingController.create({
      message: text,
    });
    await loading.present();
    return loading
  }

}
