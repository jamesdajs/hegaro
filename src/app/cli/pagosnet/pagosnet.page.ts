import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagosnet',
  templateUrl: './pagosnet.page.html',
  styleUrls: ['./pagosnet.page.scss'],
})
export class PagosnetPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  backofwindow(){
    console.log("desdeIframe")
  }
}
