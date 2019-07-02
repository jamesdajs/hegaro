import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detallepago',
  templateUrl: './detallepago.page.html',
  styleUrls: ['./detallepago.page.scss'],
})
export class DetallepagoPage implements OnInit {
  costo
  comicion
  total
  moneda
  titulo
  constructor(private routes: Router,
    private route:ActivatedRoute
    ) {
      this.costo = this.route.snapshot.paramMap.get('costo')
      this.comicion = this.route.snapshot.paramMap.get('comision')
      this.moneda=this.route.snapshot.paramMap.get('moneda')
      this.titulo=this.route.snapshot.paramMap.get('curso')
      this.total=parseFloat(this.comicion)+parseFloat(this.costo)
  }

  ngOnInit() {
    
  }

}
