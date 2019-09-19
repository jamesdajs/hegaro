import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DomSanitizerImpl, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'app-pagosnet',
  templateUrl: './pagosnet.page.html',
  styleUrls: ['./pagosnet.page.scss'],
})
export class PagosnetPage implements OnInit {
  url:SafeResourceUrl
  constructor(
    private http:HttpClient,
    private dom : DomSanitizer
  ) { }

  ngOnInit() {
    this.http.get<any>("http://localhost/goodmeServe/public/pagospedido/100")
    .toPromise()
    .then(res=>{
      console.log(res);
      let idusuario='666'
      let url=`https://test.sintesis.com.bo/payment/#/pay?
  entidad=581&ref=${res}&red=www.hegaro.com.bo`
      this.url=this.sanitize(url)
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
  backofwindow(){
    console.log("desdeIframe")
  }
  sanitize(vid){
    return this.dom.bypassSecurityTrustResourceUrl(vid);
  }
}
