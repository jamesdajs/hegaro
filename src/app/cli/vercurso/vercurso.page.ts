import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-vercurso',
  templateUrl: './vercurso.page.html',
  styleUrls: ['./vercurso.page.scss'],
})
export class VercursoPage implements OnInit {

  datos
  comision
  verificacion=[]
  constructor(private routes:Router,
    private servicioCurso:CursoService,
    private storage:Storage) { 
      this.datos=this.routes.getCurrentNavigation().extras
      this.storage.get("idusuario")
      .then(id => {
        console.log("id usuario"+id+ " "+this.datos.idcursos);
        console.log(this.datos);
        this.servicioCurso.verificarsuscripcion(this.datos.idcursos,id).then(resp=>{
          this.verificacion=resp;
          console.log("nuemro de cursos"+this.verificacion.length);
        
        })
      })
  }
  showToolbar = false;
  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
    const scrollTop = $event.detail.scrollTop;
    this.showToolbar = scrollTop >= 225;
    }
    }

  ngOnInit() {
  }
  ionViewWillEnter() {

  }
 

  detallepago(costo){
    this.comision= (costo*0.1)
    this.routes.navigate(['/cli/inicio/vercurso/detallepago',{comision:this.comision,costo:costo,moneda:this.datos.tipomoneda,curso:this.datos.titulo}])
  }

  verinstructor(id){
    this.routes.navigate(['/cli/inicio/vercurso/verinstructor'],id)
  }

  verHorarios(idcurso,idusuario){
    console.log("idusu ver curso"+idusuario);
    
    this.routes.navigate(['/cli/inicio/vercurso/selecthorario',{idc:idcurso,idu:idusuario,token:this.datos.token}])
  }

  //funciona que redirecciona al curso supscrito
  gocourse(cur,usu){
    
  }

  inscribirme(){
    this.storage.get('idusuario')
    .then(id=>{
      return this.servicioCurso.crearUsu_cur(id,this.datos.idcursos,'i')
    })
    .then(()=>{
      console.log('se asigno correctamente el alumno al curso');
      
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
}
