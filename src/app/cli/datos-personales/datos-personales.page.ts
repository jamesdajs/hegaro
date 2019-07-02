import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    console.log("datospersonalespage",this.route.snapshot.params.hola)
  }

}
