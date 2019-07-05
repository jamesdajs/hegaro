import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';

@Component({
  selector: 'app-modmiperfil',
  templateUrl: './modmiperfil.page.html',
  styleUrls: ['./modmiperfil.page.scss'],
})
export class ModmiperfilPage implements OnInit {

  fechanac = '1990-03-03'
  datos = {
    peso: '40',
    altura: '120',
    telefono: '',
    genero: 'h',
    fechanac: '2019-01-01',
    correo: ""

  }
  id
  myForm: FormGroup
  constructor(public formb: FormBuilder,
    private route: ActivatedRoute,
    public toastController: ToastController,
    private navCtrl: NavController,
    private user: UsuarioProvider,
    public loadingController: LoadingController
  ) {
    for (let key in this.datos)
      this.datos[key] = !this.route.snapshot.paramMap.get(key) || this.route.snapshot.paramMap.get(key) === 'null' ? this.datos[key] : this.route.snapshot.paramMap.get(key)




    this.id = this.route.snapshot.paramMap.get("idusuarios")

    this.myForm = this.formb.group({
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(12)]],
      fechanac: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    });
    this.myForm.setValue(this.datos)
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    console.log("despues de cargar vista")


  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  guardar() {
    console.log(this.myForm.value);
    
    if (this.myForm.valid) {
      let loading = this.presentLoading('Guardando datos')
      this.user.actualizarusuariodatosnormales(this.myForm.value, this.id)
        .then(res => {
          console.log(res);
          loading.then(load => load.dismiss())
          this.navCtrl.back()
        })
        .catch(err => {
          console.log(err);
          loading.then(load => load.dismiss())
        })
    }
    else this.presentToast("Tiene que llenar todos los datos")

  }
  async presentLoading(text) {
    const loading = await this.loadingController.create({
      message: text,
      duration: 2000
    });
    await loading.present();
    return loading
  }
}
