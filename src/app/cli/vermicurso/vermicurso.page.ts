import { Component, OnInit,ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { Storage } from '@ionic/storage';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vermicurso',
  templateUrl: './vermicurso.page.html',
  styleUrls: ['./vermicurso.page.scss'],
})
export class VermicursoPage implements OnInit {

  @ViewChild('mySlider') slider: IonSlides;
  selectedSegment='first';
  select="";
  ejercicios = {}
  rutinas = []
  curso
  regcurso=[]
  slides = [
    {
      id: "first",
      title: "First Slide"
    },
    {
      id: "second",
      title: "Second Slide"
    },
    /*+
    {
      id: "third",
      title: "Thrid Slide"
    }
    */
  ];
  id
  rutnew=0
  chats=[]
  mensage=""
  constructor(private router:Router,
    private rutina: RutinaProvider,
    private storage:Storage,
    private cursoservice:CursoService
    ) {
      this.curso=this.router.getCurrentNavigation().extras
     }

   //----------------funciones tab slide------------------
   onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.detail.value);
    this.select=segmentButton.detail.value;
     const selectedIndex = this.slides.findIndex((slide) => {
       return slide.id === segmentButton.detail.value;
     });
     if(selectedIndex==1)
      this.cursoservice.modsubcripcion(this.id,this.curso.idcursos,{rutinasnew:0,estado:true})
     this.slider.slideTo(selectedIndex);
   }

  onSlideChanged(event) {

    this.slider.getActiveIndex()
      .then(num => {
        this.selectedSegment = this.slides[num].id
      })

  }

  chatSubscrive:Subscription
  bagedSubcrive:Subscription
  ngOnInit() {
    this.cargarRutinas()
    this.storage.get("idusuario")
      .then(id => {
        this.id=id
        this.bagedSubcrive=this.cursoservice.versubcripcionallCurso(id,this.curso.idcursos)
        .subscribe(rutnew=>{
          this.rutnew=rutnew
          console.log(rutnew)
        })
        this.chatSubscrive=this.cursoservice.verchat(id,this.curso.idcursos)
        .subscribe(chats=>{
          this.chats=chats
        })
      })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chatSubscrive.unsubscribe()
    this.bagedSubcrive.unsubscribe()
  }
  sendMSM(){
    this.cursoservice.guardarchat(this.id,this.curso.idcursos,{
      text:this.mensage,
      id:this.id,
      fecha:new Date(),
      rol:'alumno'

    })
    this.mensage=''
  }
  cargarRutinas() {
    console.log(this.curso.idusu_cur);
    
    this.rutina.listarRutinas_porCurso(this.curso.idusu_cur, true)
      .then(array => {
        for (let i in array) {
          array[i]['estadohidden'] = false
          array[i]['ejercicios'] = []
        }

        console.log(array);
        this.rutinas = array
        return this.rutina.verregistroCurso(this.curso.idusu_cur)
      })
      .then(res=>{
        console.log(res);
        
        this.regcurso=res
      })
  }
  verejercicio(item){
    this.router.navigate(['/cli/mis-cursos/vermicurso/verejercicio',item])
  }
  menuItemHandler(item): void {
    //console.log(item);
    
    if (item['ejercicios'].length == 0)
      this.rutina.listarEjerciciosporRutinas(item.idrutinas)
        .then(data => {
          item['ejercicios'] = data
          item.estadohidden = true
        })
        .catch(err=>console.log(err)
        )
    else item.estadohidden = !item.estadohidden

  }

}
