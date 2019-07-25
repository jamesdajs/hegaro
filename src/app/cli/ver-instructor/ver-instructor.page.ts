import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { CursoService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-ver-instructor',
  templateUrl: './ver-instructor.page.html',
  styleUrls: ['./ver-instructor.page.scss'],
})
export class VerInstructorPage implements OnInit {

  id
  datos=[]
  cursos=[]
  genero='Hombre'
  constructor(private router:Router,
    private servicioUsuario:UsuarioProvider,
    private servicesCurso:CursoService) { 

    this.id=this.router.getCurrentNavigation().extras
  }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.datosInstructor()
    this.listarcursos()
  }

  //FUNCION LISTAR CURSOS
  listarcursos() {
    this.servicesCurso.miscursospublicados(1,this.id).subscribe(data=>{
      data.forEach(item=>{
        item.idcursos
        item['fotos']=[]
        this.servicesCurso.listarfotos(item.idcursos)
        .then(res=>{
          item['fotos']=res
        })
      })
      this.cursos=data
    })
  }

  //FUNCION PARA VER DETALLES DEL CURSO
  vercurso(curso) {
    console.log("id :"+curso.titulo + " "+ curso.descripcion);
    this.router.navigate(['/cli/inicio/verinstructorI/vercursop'],curso)
  }

  //
  datosInstructor(){
    console.log("id facebook ver"+this.id);
    this.servicioUsuario.verUsuarioIDdbinstructor(this.id) 
    .then(datos => {
      console.log("resp",datos)
      this.genero = datos[0].genero != 'h' ? 'Mujer' : 'Hombre'
      this.datos = datos[0]
    })
    .catch(err => console.log("error",err))
  }
}
