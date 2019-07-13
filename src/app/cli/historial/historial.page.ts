import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';
moment.locale('es')
@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
ejercicio
historial
  constructor(
    private arouter:ActivatedRoute,
    private rutina:RutinaProvider,
    private storaje:Storage
  ) { 
    //console.log(this.arouter.snapshot.params);
    
    this.ejercicio=this.arouter.snapshot.params
  }

  ngOnInit() {
    this.cargardatos()
  }
  cargardatos(){
    this.storaje.get('idusuario')
    .then(idusu=>{

      return this.rutina.verHIstorialalumno(this.ejercicio.idrut_ejer,idusu)
    })
    .then(historial=>{
      historial.forEach(item => {
        item['date']=moment(new Date(item.fecha)).format('LLLL')
        
        this.rutina.verSetsHistorialalumno(item.idhistorial_rutejer)
        .then(sets=>{

          item['sets']=sets
        })
      })
      console.log(historial);
      
      this.historial=historial
    })
  }
}
