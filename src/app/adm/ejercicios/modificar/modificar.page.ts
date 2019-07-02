import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FotosService } from 'src/app/services/fotos.service';
import { ToastController, LoadingController, NavController, ActionSheetController } from '@ionic/angular';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ActivatedRoute } from '@angular/router';
declare var cordova:any
@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  myForm: FormGroup
  imgCropUrl = []
  imagenes=[]
  idejer
  datos = {
    descripcion: "",
    instrucciones: "",
    linkyoutube: "",
    nombre: "",
  }
  minuatura
  constructor(
    private fotos: FotosService,
    private formb: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public rutina: RutinaProvider,
    public Aroute: ActivatedRoute,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController
  ) {
    this.myForm = this.formb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      instrucciones: ['', [Validators.required, Validators.maxLength(300)]],
      linkyoutube: ['']
    });
    this.idejer = this.Aroute.snapshot.paramMap.get('idejercicios')
    this.minuatura = this.Aroute.snapshot.paramMap.get('minuatura')
    for (let i in this.datos)
      this.datos[i] = this.Aroute.snapshot.paramMap.get(i)
    this.myForm.setValue(this.datos)
    console.log(this.Aroute.snapshot.params);

  }

  ngOnInit() {
    this.cargarImagenes()
  }
  cargarImagenes() {
    this.rutina.listarImagenesEjercicios(this.idejer)
      .then(data => this.imagenes = data)
  }
  blobthumbnail
  seleccionarImagenes() {
    this.fotos.escogerImagenes(5-this.imagenes.length)
      .then(urlarray => {
        this.imgCropUrl = urlarray
        let aux=[]
        for(let i in urlarray)
          aux.push(this.fotos.createThumbnail(urlarray[i].base64))
        return Promise.all(aux)
      })
      .then(data=>{
        this.blobthumbnail=data
        //alert(JSON.stringify(data.size))
      })
      .catch(err => console.log(err))
  }
  guardar() {
    if (this.myForm.invalid) {
      this.presentToast('Tiene que llenar todos los datos')

    } else {
      let loadding = this.presentLoading('Guardando datos...')
      this.rutina.modificarEjercicio(this.idejer, this.myForm.value)
        .then(() => {
          let aux = []
          for (let i in this.imgCropUrl)
            aux.push(this.fotos.subirimagen(this.imgCropUrl[i].blob, 'ejercicios', i))
          return Promise.all(aux)
        })
        .then((array) => {
          let aux = []
          for (let i in array)
            aux.push(this.rutina.crearImagenEjercicio(this.idejer, { nombre: array[i].name, url: array[i].dir + array[i].name ,thumb:'falta'}))
          return Promise.all(aux)
        })
        //para crear thupbail
        /*.then(() => {
          if (this.blobktombal)
            return this.fotos.subirimagen(this.blobktombal, 'ejercicios', '5')
        })
        .then(res => {
          if (res)
            return this.rutina.modThompbailEjercicio(_idejer, res.dir + res.name)
        })*/
        .then(() => loadding)
        .then(load => {
          load.dismiss()
          this.presentToast('Se modifico el ejercicio correctamente')
          this.navCtrl.pop()
        })
        .catch(async err => {
          await loadding.then(load => load.dismiss())
          this.presentToast('Ocurio un error al guardar el ejercicio')
          console.log(err)
        })

    }
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  async presentLoading(text) {
    const loading = await this.loadingController.create({
      message: text
    });
    await loading.present();
    return loading
  }
  eliminarfoto(item,i) {
    console.log(item);
    this.fotos.eliminarImagen(item.nombre,'ejercicios')
    .then(()=>this.rutina.eliminarImagenEjercicio(item.idfotos_ejercicios))
    .then(()=>{
      this.imagenes.splice(i, 1);
      this.presentToast('Se eliminó corectamente la imagen')
    })

  }
  async presentActionSheet(item,i) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Imagen',
      buttons: [
        {
          text: 'Modificar',
          icon: 'paper',
          handler: () => {
            console.log('Share clicked');
            this.modificar(item)
          }
        }, {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.eliminarfoto(item,i) 
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });

    await actionSheet.present();
  }
  modificar(item) {
    this.fotos.escogerImagenes(1)
      .then(imagenes => this.fotos.modificarimagen(imagenes[0].blob, 'ejercicios', item.nombre))
      .then(() => {
        this.presentToast('Se modifico correctamente la imagen')
      })
      .catch(err=>console.log(err))
  }
  pegar(){
    cordova.plugins.clipboard.paste((text)=> { 
      this.myForm.get('linkyoutube').setValue(text)
     })
 }
}