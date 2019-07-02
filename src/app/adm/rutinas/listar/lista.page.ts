import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonList } from '@ionic/angular';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  rutinas = []
  ejercicios={}
  @ViewChild('lista') lista: IonList
  constructor(public navCtrl: NavController,
    private rutina: RutinaProvider,
    private storage: Storage
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.cargardatos()
    this.lista.closeSlidingItems()

  }
  crear() {
    this.navCtrl.navigateForward(['/adm/rutinas/crear'])
  }
  cargardatos() {
    this.storage.get('idusuario')
      .then(idusu => this.rutina.listarRutinas(idusu, true,'d'))
      .then(array => {
        console.log(array);
        for(let i in array){
          this.ejercicios[array[i].idrutinas]=[]
          array[i]['estadohidden']=false
        }
        this.rutinas = array
      })
  }
  cargarejercicios(item){
    if(this.ejercicios[item.idrutinas].length==0)
      this.rutina.listarEjerciciosporRutinas(item.idrutinas)
      .then(data=>{
        this.ejercicios[item.idrutinas]=data
        item.estadohidden=true
      })
      else item.estadohidden=!item.estadohidden
  }
  verdetalle(item){
    this.navCtrl.navigateForward(['/adm/rutinas/detalle',item])
  }
  modificar(item){
    this.navCtrl.navigateForward(['/adm/rutinas/modificar',item])
  }
}
