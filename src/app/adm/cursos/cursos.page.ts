import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import {   ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  constructor(
    private route:ActivatedRoute
  ) {

    console.log(this.route.snapshot.paramMap)
   }
   selectANumber(){}
  ngOnInit() {
  }
  

}
