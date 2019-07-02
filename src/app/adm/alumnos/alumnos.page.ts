import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {
  alumnos=[]
  constructor(private routes: Router,
    private curso: CursoService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.listaralumnos()
  }
  veralumno(item) {
    this.routes.navigate(['/adm/misalumnos/alumnodetalle'],item)
  }

  listaralumnos() {
    this.storage.get('idusuario')
      .then(id => {
        return this.curso.listarMisAlumnos(id)
      })
      .then(res => {
        console.log(res);
        this.alumnos=res
      })
      .catch(err=>{console.log(err);
      })
  }
}
