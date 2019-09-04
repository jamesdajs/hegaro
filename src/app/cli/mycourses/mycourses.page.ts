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
    private storage:Storage,
    private curso:CursoService
    ) {
    }
    rutnew
    ngOnInit() {
      this.storage.get("idusuario")
      .then(id => {
        this.id=id
        this.servicioCurso.listarmiscursos(id).then(resp=>{
        this.curso.versubcripcionall(id)
        .subscribe(rutnew=>{
          console.log(rutnew);
          
          resp.forEach(item=>{
            rutnew.forEach(rut => {
              if(item.idcursos==rut.key)
              item['badged']=rut.rutinasnew
            });

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
      })
  }
  ionViewWillEnter() {
    console.log(this.id);
    
    if(this.id && this.rutnew)
    {this.servicioCurso.listarmiscursos(this.id).then(resp=>{
        resp.forEach(item=>{
          this.rutnew.forEach(rut => {
            if(item.idcursos==rut.key)
            item['badged']=rut.rutinasnew
          });

          item.idcursos
          item['foto']=[]
          this.servicioCurso.listarfotoCurso(item.idcursos)
          .then(res=>{
            item['foto']=res[0].thumb
          })
        })
        this.datos=resp
        console.log(resp);
      })}
       
  }

  vermicurso(item){
    //this.curso.modsubcripcion(this.id,item.idcursos,{rutinasnew:0,estado:true})
    this.routes.navigate(['/cli/mis-cursos/vermicurso'],item)
  }

  inicio(){
    this.routes.navigate(['/cli/inicio'])
  }

}
