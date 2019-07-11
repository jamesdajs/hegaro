import { Component, OnInit, Sanitizer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { DomSanitizer } from '@angular/platform-browser';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-detalleejercicio',
  templateUrl: './detalleejercicio.page.html',
  styleUrls: ['./detalleejercicio.page.scss'],
})
export class DetalleejercicioPage implements OnInit {

  ejercicio
  imagenes = []
  listSets=[]
  youtubeaux
  dummyJson = {
    
    peso:[
        { description: 'Peso', value: '' }
      ],
      rep:[
        { description: 'Repeticiones', value: '' }
      ],
      tiempo:[
        { description: 'Tiempo', value: '' }
      ]
    

  }
  idusu
  constructor(private arouter:ActivatedRoute,
    private rutina: RutinaProvider,
    private sanitizer:DomSanitizer,
    private selector:WheelSelector,
    public toastController: ToastController,
    private storage : Storage
  ) {
    this.ejercicio = this.arouter.snapshot.params
    console.log(this.ejercicio);
    
    this.youtubeaux = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + /[^/]+$/.exec(this.ejercicio.linkyoutube)[0])
    for(let i=2.5;i<=120;i=i+2.5)
      this.dummyJson.peso.push({ description: i+' Kg', value: ''+i })
    for(let i=1;i<=50;i++)
      this.dummyJson.rep.push({ description: i+'', value: ''+i })
    for(let i=5;i<=60;i=i+5)
      this.dummyJson.tiempo.push({ description: i+' min', value: ''+i })
  }
  ngOnInit() {
    this.CargarDatos()
    this.storage.get('idusuario')
    .then(id=>{
      this.idusu=id
    })

  }
  CargarDatos() {
    this.rutina.listarImagenesEjercicios(this.ejercicio.idejercicios)
      .then(res => {
        console.log(res);
        this.imagenes=res 
        return this.rutina.getSetsDefectoEjercicio(this.ejercicio.idrut_ejer)
      })
      .then(res=>{
        console.log(res);
        res.forEach(element => {
          element['isChecked']=false
        });
        this.listSets=res
      })
      .catch(err=>{
        console.log(err);
        
      })
  }
  guardar(){
    let valor=[]
    valor = this.listSets.filter(elem=>elem.isChecked==true)

    console.log(this.listSets,valor);
    if(valor.length!=0){
      
      this.rutina.guardarHistorial(this.ejercicio.idrut_ejer,moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),this.idusu)
      .then(idhistorial=>{
        let aux=[]
        this.listSets.forEach(item=>{
          if(item.isChecked==true){
            aux.push(this.rutina.guardarSets(idhistorial,item.peso,item.repeticiones,item.tiempo))
          }
        })
        return Promise.all(aux)
      })
      .then(res=>{
        console.log(res);
        this.presentToast('Se guardo la el set del dia de hoy correctamente')
        
      })
      .catch(err=>{
        console.log(err);
        
      })
    }
    else{
      this.presentToast('Tienen que seleccionar al menos un set')
    }
    
  }
  modificarset(i,item){
    //alert("hola")
    let i_peso,i_rep,i_tiempo
    for (let indice in this.dummyJson.peso){
      if(item.peso == this.dummyJson.peso[indice].value){
        i_peso = indice;
      }
    }
    for (let indice in this.dummyJson.rep){
      if(item.repeticiones == this.dummyJson.rep[indice].value){
        i_rep = indice;
      }
    }
    for (let indice in this.dummyJson.tiempo){
      if(item.tiempo == this.dummyJson.tiempo[indice].value){
        i_tiempo = indice;
      }
    }
    
    this.selector.show({
      title: "Modificar set "+(i+1),
      
      displayKey: 'description',
      items: [
        this.dummyJson.peso,
        this.dummyJson.rep,
        this.dummyJson.tiempo
      ],
      positiveButtonText: "Aceptar",
      negativeButtonText: "Cancelar",

      wrapWheelText:true,
      defaultItems: [
        {index:0, value: this.dummyJson.peso[parseInt(i_peso)].description},
        {index:1, value: this.dummyJson.rep[parseInt(i_rep)].description},
        {index:2, value: this.dummyJson.tiempo[parseInt(i_tiempo)].description}
      ]
    }).then(
      result => {
        if(this.dummyJson.peso[result[0].index].value!='' || 
          this.dummyJson.rep[result[1].index].value!='' ||
          this.dummyJson.tiempo[result[2].index].value!=''){
            this.listSets[i].peso=this.dummyJson.peso[result[0].index].value
            this.listSets[i].repeticiones=this.dummyJson.rep[result[1].index].value
            this.listSets[i].tiempo=this.dummyJson.tiempo[result[2].index].value
          }else{
            this.presentToast('El set tiene que tener al menos un valor')
          }
        //alert( `${result[0].description} (value=${this.dummyJson.peso[result[0].index].value} `);
        
      },
      err => console.log('Error: ' + JSON.stringify(err))
      )
  }
  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }
}
