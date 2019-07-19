import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-cursoalumnos',
  templateUrl: './cursoalumnos.page.html',
  styleUrls: ['./cursoalumnos.page.scss'],
})
export class CursoalumnosPage implements OnInit {
  datos
  alumnos=[]
  constructor(private router:Router,
    private cursoservicio:CursoService) {
    this.datos = this.router.getCurrentNavigation().extras
    console.log("id",this.datos.idcursos);
    
    this.listaralumnos(this.datos.idcursos)
   }
  
  ngOnInit() {
  }

  listaralumnos(idcurso){
    this.cursoservicio.listainscritos(idcurso)
    .then(al=>{
      this.alumnos=al
    }).catch(erro=>{
      console.log(erro);
    })
  }

  veralumno(item){
    this.router.navigate(['/adm/misalumnos/alumnodetalle'],item)
  }

}
