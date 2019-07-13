import { Component, OnInit,ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';

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
  idusu_cur
  slides = [
    {
      id: "first",
      title: "First Slide"
    },
    {
      id: "second",
      title: "Second Slide"
    },
    {
      id: "third",
      title: "Thrid Slide"
    }
  ];
  constructor(private router:Router,
    private rutina: RutinaProvider,) {
      this.idusu_cur=this.router.getCurrentNavigation().extras
     }

   //----------------funciones tab slide------------------
   onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.detail.value);
    this.select=segmentButton.detail.value;
     const selectedIndex = this.slides.findIndex((slide) => {
       return slide.id === segmentButton.detail.value;
     });
     this.slider.slideTo(selectedIndex);
   }

  onSlideChanged(event) {

    this.slider.getActiveIndex()
      .then(num => {
        this.selectedSegment = this.slides[num].id
      })

  }


  ngOnInit() {
    this.cargarRutinas()
  }
  cargarRutinas() {
    console.log(this.idusu_cur);
    
    this.rutina.listarRutinas_porCurso(this.idusu_cur, true)
      .then(array => {
        for (let i in array) {
          array[i]['estadohidden'] = false
          array[i]['ejercicios'] = []
        }

        console.log(array);
        this.rutinas = array
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
