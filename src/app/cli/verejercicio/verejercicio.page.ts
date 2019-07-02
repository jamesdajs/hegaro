import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verejercicio',
  templateUrl: './verejercicio.page.html',
  styleUrls: ['./verejercicio.page.scss'],
})
export class VerejercicioPage implements OnInit {
  ejercicio
  constructor(private router:Router) {
    this.ejercicio=this.router.getCurrentNavigation().extras
    console.log(this.ejercicio);
    
   }

  ngOnInit() {
  }

}
