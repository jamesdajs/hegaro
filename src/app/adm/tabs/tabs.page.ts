import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('tabadm')tab:IonTabs
  constructor(
    private curso:CursoService,
    private storage:Storage
  ) { }
  item:Array<{}>=[]
  cont:number
  id
  ngOnInit() {
    this.storage.get('idusuario')
    .then(id=>{
      this.id=id
      this.curso.verAlumnosinscritosCursos(id)
        .subscribe(item=>{
          this.cont=0
          console.log(item);
          
          this.item=item
          item.forEach(element => {
            this.cont+=element.inscritos
          });
        })
    })
  }
  ngAfterViewInit(): void {
    console.log(
      this.tab.getSelected()
      );
      this.tab.ionTabsDidChange
      .subscribe(tabname=>{
        if(tabname.tab=='misalumnos'){
        }
      })
  }

}
