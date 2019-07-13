import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cursosinactivos',
  templateUrl: './cursosinactivos.page.html',
  styleUrls: ['./cursosinactivos.page.scss'],
})
export class CursosinactivosPage implements OnInit {
  id
  cursos=[]
  constructor(
    private routes:Router,
    private serviciocurso: CursoService,
    private alertController:AlertController
  ) { 
    this.id=this.routes.getCurrentNavigation().extras
    this.listarcursos(0,this.id)
   }

  ngOnInit() {
  }

  listarcursos(estado,usu){
    this.serviciocurso.miscursospublicados(estado,usu)
    .subscribe(data=>{
      data.forEach(item=>{
        item.idcursos
        item['fotos']=[]
        this.serviciocurso.listarfotos(item.idcursos)
        .then(res=>{
          item['fotos']=res
        })
      })
      this.cursos=data
    })
  }

  activar(idcurso,i){
    this.serviciocurso.eliminar(1,idcurso)
    .then(res=>{
      this.cursos.splice(i,1);
      this.presentAlert()
    })
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Curso activado',
      message: 'el curso esta visible nuevamente para todos los usuarios',
      buttons: ['OK']
    });
  
    await alert.present();
  }

}
