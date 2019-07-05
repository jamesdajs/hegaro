import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.page.html',
  styleUrls: ['./mycourses.page.scss'],
})
export class MycoursesPage implements OnInit {
  id
  datos=[]
  constructor(private routes:Router,
    private servicioCurso:CursoService,
    private storage:Storage) { 
      this.storage.get("idusuario")
      .then(id => {
        this.id=id
        this.servicioCurso.listarmiscursos(id).then(resp=>{
         
          resp.forEach(item=>{
            item.idcursos
            item['foto']=[]
            this.servicioCurso.listarfotoCurso(item.idcursos)
            .then(res=>{
              item['foto']=res[0].thumb
            })
          })
          this.datos=resp
          console.log(resp);
        
        })
      })
    }

  ngOnInit() {
  }

  vermicurso(){
    this.routes.navigate(['/cli/mis-cursos/vermicurso'],this.id)
  }

  inicio(){
    this.routes.navigate(['/cli/inicio'])
  }

}
