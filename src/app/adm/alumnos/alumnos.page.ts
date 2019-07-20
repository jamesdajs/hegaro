import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {
  alumnos=[]
  nuevos=[]
  cursos=[]
  @ViewChild('mySlider') slider: IonSlides;
  selectedSegment='first';
  select="";
  slides = [
    {
      id: "first",
      title: "First Slide"
    },
    {
      id: "second",
      title: "Second Slide"
    }
  ];
  constructor(private routes: Router,
    private curso: CursoService,
    private storage: Storage,
    private servicesCurso:CursoService
  ) { }

   //----------------funciones tab slide------------------
   onSegmentChanged(segmentButton) {
    this.select=segmentButton.detail.value;
     const selectedIndex = this.slides.findIndex((slide) => {
       return slide.id === segmentButton.detail.value;
     });
     this.slider.slideTo(selectedIndex);
   }
 
   onSlideChanged(event) {
     
     this.slider.getActiveIndex()
     .then(num=>{
       this.selectedSegment=this.slides[num].id
     })
     
   }
   //--------------end funciones tab slide--------------*/

  ngOnInit() {
    this.storage.get('idusuario')
    .then(id => {
      this.listaralumnos(id)
      this.listarcursos(id)
    })
    .catch(err=>{console.log(err);
    })
    
  }
  veralumno(item) {
    this.routes.navigate(['/adm/misalumnos/alumnodetalle'],item)
  }

  listaralumnos(id) {
      this.curso.listarMisAlumnos(id)
      .then(res => {
        console.log(res);
        this.alumnos=res
      })
      .catch(err=>{console.log(err);
      })
  }

  listarcursos(id){
    this.servicesCurso.cursosinscritos(id)
    .then(data=>{
      this.cursos=data
      }).catch(erro=>{
        console.log(erro);
        
        })
  }

  veralumnos(item){
    this.routes.navigate(['/adm/misalumnos/cursoalumnos'],item)
  }
}
