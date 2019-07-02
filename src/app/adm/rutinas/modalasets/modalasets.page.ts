import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';

@Component({
  selector: 'app-modalasets',
  templateUrl: './modalasets.page.html',
  styleUrls: ['./modalasets.page.scss'],
})
export class ModalasetsPage implements OnInit {
  datos=[{
    peso:'5',
    repeticiones:'5',
    tiempo:'20'
  },
  {
    peso:'5',
    repeticiones:'5',
    tiempo:'20'
  },{
    peso:'5',
    repeticiones:'5',
    tiempo:'20'
  }]
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
  @Input() ejerset
  constructor(
    public modalController: ModalController,
    private selector:WheelSelector,
    private toasCtrl:ToastController) {
    
    for(let i=2.5;i<=120;i=i+2.5)
      this.dummyJson.peso.push({ description: i+' Kg', value: ''+i })
    for(let i=1;i<=50;i++)
      this.dummyJson.rep.push({ description: i+'', value: ''+i })
    for(let i=5;i<=60;i=i+5)
      this.dummyJson.tiempo.push({ description: i+' min', value: ''+i })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmSetejercicioPage');
  }
  dismiss(){
    if(this.datos.length==0){
      this.presentToast('Tiene que tener al menos un set')
    }else{
      
    this.modalController.dismiss(this.datos)
    }
  }
  openPicker() {
    this.selector.show({
      title: "Parametros del ejercicio",
      
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
        {index:0, value: this.dummyJson.peso[0].description},
        {index: 0, value: this.dummyJson.rep[0].description}
      ]
    }).then(
      result => {
        //alert( `${result[0].description} (value=${this.dummyJson.peso[result[0].index].value} `);
        if(this.dummyJson.peso[result[0].index].value!='' || 
          this.dummyJson.rep[result[1].index].value!='' ||
          this.dummyJson.tiempo[result[2].index].value!='')
          this.datos.push({
            peso:this.dummyJson.peso[result[0].index].value,
            repeticiones:this.dummyJson.rep[result[1].index].value,
            tiempo:this.dummyJson.tiempo[result[2].index].value
          })
        else
          this.presentToast('El set tiene que tener al menos un valor')
      },
      err => console.log('Error: ' + JSON.stringify(err))
      );
  }
  quitar(){
    this.datos.pop()
  }
  eliminarset(i){
    this.datos.splice(i, 1);
  }
  modificarset(i,peso,rep,tiempo){
    //alert("hola")
    let i_peso,i_rep,i_tiempo
    for (let indice in this.dummyJson.peso){
      if(peso == this.dummyJson.peso[indice].value){
        i_peso = indice;
      }
    }
    for (let indice in this.dummyJson.rep){
      if(rep == this.dummyJson.rep[indice].value){
        i_rep = indice;
      }
    }
    for (let indice in this.dummyJson.tiempo){
      if(tiempo == this.dummyJson.tiempo[indice].value){
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
            this.datos[i].peso=this.dummyJson.peso[result[0].index].value
            this.datos[i].repeticiones=this.dummyJson.rep[result[1].index].value
            this.datos[i].tiempo=this.dummyJson.tiempo[result[2].index].value
          }else{
            this.presentToast('El set tiene que tener al menos un valor')
          }
        //alert( `${result[0].description} (value=${this.dummyJson.peso[result[0].index].value} `);
        
      },
      err => console.log('Error: ' + JSON.stringify(err))
      )
  }
  prueva(){
    this.datos.push({
      peso:"5",
      repeticiones:"5",
      tiempo:"20"
    })
  }
  ngOnInit() {
  }
  salir(){
    this.modalController.dismiss(this.datos)
  }
  async presentToast(text) {
    const toast = await this.toasCtrl.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
}
