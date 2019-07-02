import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FotosService } from 'src/app/services/fotos.service';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-crearcurso',
  templateUrl: './crearcurso.page.html',
  styleUrls: ['./crearcurso.page.scss'],
})
export class CrearcursoPage implements OnInit {
  myFormins: FormGroup
  imagenes = []
  duracion = ''
  fecha
  horas='0'
  semanas ='0'
  datos = {
    descripcion: "",
    titulo: "",
    costo: 0,
    moneda: ""
  }
  jsonData: any;
  blobthumbnail
  constructor(
    private fotos: FotosService,
    private selector: WheelSelector,
    public formb: FormBuilder,
    public loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private curso: CursoService
    ,
    private storage: Storage
  ) {
    this.jsonData = {
      horas: [
        { name:'Horas', id: "" },
        { name:'1 hora', id: "1" },
        { name:'2 horas', id: "2" },
        { name:'3 horas', id: "3" },
        { name:'4 horas', id: "4" },
        { name:'5 horas', id: "5" },
        { name:'6 horas', id: "6" },
        { name:'7 horas', id: "7" }
      ],
      semanas: [
        { name:'Semanas',id: "" },
        { name:'1 semana',id: "1" },
        { name:'2 semanas', id: "2" },
        { name:'3 semanas', id: "3" },
        { name:'4 semanas', id: "4" },
        { name:'5 semanas', id: "5" },
        { name:'6 semanas', id: "6" },
        { name:'7 semanas', id: "7" },
        { name:'8 semanas', id: "8" },
        { name:'9 semanas', id: "9" },
        { name:'10 semanas', id: "10" }
      ]
    };
    this.myFormins = this.formb.group({
      descripcion: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  //cuncion para seleccionar imagen
  selecImage() {
    this.fotos.escogerImagenes(5)
      .then(urlarray => {
        this.imagenes = urlarray
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

  selectDuracion() {
    this.selector.show({
      title: "Selecciona duración del curso",
      items: [
        this.jsonData.horas, this.jsonData.semanas
      ],
      displayKey: 'name',
      positiveButtonText: "Ok",
      negativeButtonText: "Cancelar",
      defaultItems: [
        { index: 0, value: this.jsonData.horas[0].name },
        { index: 1, value: this.jsonData.semanas[0].name }
      ]
    }).then(
      result => {
        this.duracion = this.jsonData.horas[result[0].index].name + ' por ' + this.jsonData.semanas[result[1].index].name ;
        this.horas = this.jsonData.horas[result[0].index].id
        this.semanas = this.jsonData.horas[result[1].index].id;
      },
      err => console.log('Error: ' + JSON.stringify(err))
    );
  }

  //llenar datos en tabla relacion
  guardardatosTablaRelacion() {

  }


  date = new Date();
  guardarDatos() {
    console.log(this.myFormins.value);
    if (this.myFormins.valid) {
      let loading = this.presentLoading('Guardando datos')
      this.date = new Date('yyyy-MM-dd HH:mm:ss Z')
      let _idcurso,_idusucur,_resimg=[],_resthumb=[]
      this.curso.crearcurso(this.myFormins.value, this.date, this.horas, this.semanas)

        .then(res => {
          _idcurso = res
          return this.storage.get('idusuario')
        })
        .then(idusu => {
          return this.curso.crearUsu_cur(idusu, _idcurso, 'c')
        })
        .then(idusucur => {
          
          _idusucur=idusucur
          let aux=[]
          for(let i in this.imagenes)
            aux.push(this.fotos.subirimagen(this.imagenes[i].blob,'cursos',i))
          return Promise.all(aux)
        })
        .then(array => {
          _resimg=array
          let aux=[]
          for(let i in this.blobthumbnail)
            aux.push(this.fotos.subirimagen(this.blobthumbnail[i].blob,'cursos',"t_"+i))
          return Promise.all(aux)
        })
        .then((array)=>{
          _resthumb=array
          let aux=[]
          for(let i in array)
            aux.push(this.curso.crearImagenCurso(_idcurso,{
              nombre:_resimg[i].name,
              url:_resimg[i].dir+_resimg[i].name,
              thumb:array[i].dir+array[i].name
            }))
          return Promise.all(aux)
        })
        .then(res=>{
          loading.then(load => load.dismiss())
          this.router.navigate(['/adm/cursos'])
        })
        .catch(err => {
          console.log(err);
          loading.then(load => load.dismiss())
        })
    }
    else this.presentToast("Completa los campos")
  }

  //recupera el ultimo id
  recuperarId() {

  }

  //mesage loading
  async presentLoading(text) {
    const loading = await this.loadingController.create({
      message: text,
    });
    await loading.present()
    return loading
  }
  //funcion toast cargando
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

}
