import { Component, OnInit } from '@angular/core';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  cont:number
  constructor(
    private curso:CursoService,
    private storage:Storage
  ) { }
  
  ngOnInit() {
    this.storage.get('idusuario')
    .then(id=>{
      this.curso.versubcripcionall(id)
      .subscribe(rutinas=>{
        console.log(rutinas);
        
        this.cont=0
        rutinas.forEach(element => {
          this.cont+=element.rutinasnew
        });
      })
    })
  }

}
