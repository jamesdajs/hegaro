import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';
import { IonSlides, ToastController } from '@ionic/angular';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { Observable, Subscription } from 'rxjs';

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
  idusu
  verAlumCursub:Subscription

  constructor(private routes: Router,
    private curso: CursoService,
    private storage: Storage,
    private servicesCurso:CursoService,
    private user:UsuarioProvider,
    public toastController: ToastController
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
   ionViewWillEnter(){
    
    this.storage.get('idusuario')
    .then(id => {
      this.idusu=id
      this.listaralumnos(id)
      this.listarcursos(id)
      
    })
    .catch(err=>{console.log(err);
    })
   }
   ngOnDestroy(): void {
     //Called once, before the instance is destroyed.
     //Add 'implements OnDestroy' to the class.
     this.verAlumCursub.unsubscribe()
   }
  ngOnInit() {
    
    
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
      
      this.verAlumCursub=this.curso.verAlumnosinscritosCursos(id)
        .subscribe(item=>{
          this.cursos.forEach(curso=>{
            item.forEach(element => {
              if(curso.idcursos==element.key)
                curso['badged']=element.inscritos
            });
          })
          console.log(this.cursos);
        })

      }).catch(erro=>{
        console.log(erro);
        
        })
  }

  veralumnos(item){
    console.log(item);
    
    this.curso.modalumnosinscritos(this.idusu,item.idcursos,{inscritos:0,estado:true})
    if(item.inscritos==0)
      this.presentToast('No tiene ningun alumno en el curso.')
    else{
      this.routes.navigate(['/adm/misalumnos/cursoalumnos'],item)
      this.verAlumCursub.unsubscribe()
    }
  }
  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }
}
