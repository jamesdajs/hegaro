import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { Storage } from '@ionic/storage';
import { ModalasetsPage } from '../modalasets/modalasets.page';

@Component({
  selector: 'app-modaladdejer',
  templateUrl: './modaladdejer.page.html',
  styleUrls: ['./modaladdejer.page.scss'],
})
export class ModaladdejerPage implements OnInit {
  @Input() datos
  @Input() ejerselec = []
  @Input() ejerguardados = []
  tipoejer = []
  modalejer = {}
  constructor(
    public modalController: ModalController,
    private rutina: RutinaProvider,
    private storage: Storage
  ) { }

  ngOnInit() {
    console.log(this.ejerselec,this.ejerguardados);
    this.cargartiposejercicios()
  }
  salir() {
    this.modalController.dismiss(this.ejerselec)
  }
  cargartiposejercicios() {
    this.storage.get('idusuario')
      .then(idusu => this.rutina.listarTipoEjercicio(idusu))
      .then(data => {
        for (let i in data) {
          this.modalejer[data[i].idtipo_ejercicios] = []
          data[i].estadohiide = false
        }
        this.tipoejer = data
      })
  }
  verejercicios(item) {
    console.log(item);
    let aux = false
    for (let key in this.modalejer) {
      if (item.idtipo_ejercicios == key && this.modalejer[key].length != 0)
        aux = true
    }
    if (!aux)
      this.rutina.listarEjercicio(item.idtipo_ejercicios, true)
        .subscribe(data => {
          //console.log(data)
          data.forEach(elem => {
            elem['estadoadd'] = false
            this.ejerselec.forEach(ejer => {
              if (ejer.idejercicios == elem.idejercicios)
                elem['estadoadd'] = true
            })
            this.ejerguardados.forEach(ejerg=>{
              if (ejerg.idejercicios == elem.idejercicios)
                elem['disabled'] = true
            })

          })
          this.modalejer[item.idtipo_ejercicios] = data
          item['estadohiide'] = !item['estadohiide']
        })
    else
      item['estadohiide'] = !item['estadohiide']

  }
  async seleccionar(ejer, o) {
    //console.log(ejer,o,event.detail.checked);

    if (ejer.estadoadd == true) {
      /**+
       * 
       const modal = await this.modalController.create({
         component: ModalasetsPage,
         componentProps: { ejerset: ejer }
       });
 
       await modal.present();
       const { data } = await modal.onDidDismiss()
       */
      //ejer['sets'] = data
      ejer['sets']=[]
      this.ejerselec.push(ejer)
    }
    else {
      let encontrado = null
      for (let i = 0; i < this.ejerselec.length; i++) {

        if (this.ejerselec[i].idejercicios == ejer.idejercicios) {
          encontrado = i
          break
        }
      }
      console.log(ejer.idejercicios, this.ejerselec, encontrado)
      if (encontrado != null)
        this.ejerselec.splice(encontrado, 1);
    }
  }
  borrarselecionado(i, item) {
    console.log(item);
    this.tipoejer.forEach(tipo => {
      this.modalejer[tipo.idtipo_ejercicios].forEach(ejer => {
        if (ejer.idejercicios == item.idejercicios) {
          ejer.estadoadd = false
        }
      });
    })
    this.ejerselec.splice(i, 1);
  }
  async presentModal(ejer) {


  }
}
