import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';

@Component({
  selector: 'app-verejercicio',
  templateUrl: './verejercicio.page.html',
  styleUrls: ['./verejercicio.page.scss'],
})
export class VerejercicioPage implements OnInit {
  ejercicio
  imagenes = []
  sets = []
  constructor(private router: Router,
    private rutina: RutinaProvider
  ) {
    this.ejercicio = this.router.getCurrentNavigation().extras
    console.log(this.ejercicio);

  }

  ngOnInit() {
    this.getsetejercicio()

    this.getImagenes()
  }
  getsetejercicio() {
    this.rutina.getSetsDefectoEjercicio(this.ejercicio.idrut_ejer)
      .then(res => {
        this.imagenes = res
      })
  }
  getImagenes() {
    this.rutina.listarImagenesEjercicios(this.ejercicio.idejercicios)
      .then(res => {
        this.sets = res
        console.log(res);

      })
  }

}
