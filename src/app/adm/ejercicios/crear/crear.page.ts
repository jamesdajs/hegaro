import { Component, OnInit } from '@angular/core';
import { FotosService } from 'src/app/services/fotos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
declare var cordova: any;
@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
})
export class CrearPage implements OnInit {
  myForm: FormGroup
  imgCropUrl = []
  idtipo
  constructor(
    private fotos: FotosService,
    private formb: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public rutina: RutinaProvider,
    public Aroute: ActivatedRoute,
    public navCtrl:NavController,
    private clipboard:Clipboard
  ) {
    this.myForm = this.formb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      instrucciones: ['', [Validators.required, Validators.maxLength(300)]],
      linkyoutube: ['']
    });
    this.idtipo = this.Aroute.snapshot.paramMap.get('idtipo_ejercicios')
  }

  ngOnInit() {
  }
  video(){
    this.fotos.escogerVideo()
    
  }
  blobthumbnail
  seleccionarImagenes() {
    this.fotos.escogerImagenes(5)
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
      let _idejer='',_resimg=[],_resthomb=[]
      this.rutina.crearEjercicio(this.idtipo, this.myForm.value)
        .then(idejer=>{
          _idejer=idejer
          let aux=[]
          for(let i in this.imgCropUrl)
            aux.push(this.fotos.subirimagen(this.imgCropUrl[i].blob2,'ejercicios',i))
          return Promise.all(aux)
        })
        .then((array)=>{
          _resimg=array
          let aux=[]
          for(let i in this.blobthumbnail)
            aux.push(this.fotos.subirimagen(this.blobthumbnail[i].blob,'ejercicios',"t_"+i))
          return Promise.all(aux)
        })
        .then((array)=>{
          _resthomb=array
          let aux=[]
          for(let i in array)
            aux.push(this.rutina.crearImagenEjercicio(_idejer,
              {
                nombre:_resimg[i].name,
                url:_resimg[i].dir+_resimg[i].name,
                thumb:array[i].dir+array[i].name
              }))
          return Promise.all(aux)
        })
        
        .then(res=>{
            return this.rutina.modThompbailEjercicio(_idejer,_resthomb[0].dir+_resthomb[0].name)})
        .then(()=> loadding)
        .then(load=>{
          load.dismiss()
          this.presentToast('Se creo un nuevo ejercicio')
          this.navCtrl.pop()
        })
        .catch(async err => {
          await loadding.then(load=>load.dismiss())
          this.presentToast('Ocurio un error al guardar el ejercicio')
          alert(JSON.stringify(err))
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
  pegar(){
     cordova.plugins.clipboard.paste((text)=> { 
       this.myForm.get('linkyoutube').setValue(text)
      })
  }
  cargandoImagenejem(file){
    this.fotos.subirimagen(file[0],'ejercicios','0')
    .then(res=>{
      console.log(res);
      
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
  cargandovideo(file){
    this.fotos.subirGdrive(file[0],1)
    .then(res=>{
      console.log(res);
      
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
  
}
