import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import * as moment from 'moment';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
moment.locale('es')
declare var google: any;
@Component({
  selector: 'app-vercurso',
  templateUrl: './vercurso.page.html',
  styleUrls: ['./vercurso.page.scss'],
})
export class VercursoPage implements OnInit {
  dias = ["DOMINGO", 'LUNES', "MARTES", 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
  owner=false
  direccion
  datos
  comision
  verificacion=[]
 lugar={
   lat:'',
   lng:'',
   zoom:'',
   direccion:'',
   nombregym:''
 }
 horario=[]
  constructor(private routes:Router,
    private servicioCurso:CursoService,
    private storage:Storage,
    private lugares:LugaresService,
    private usuario:UsuarioProvider,
    private iab: InAppBrowser
     ) { 
      this.datos=this.routes.getCurrentNavigation().extras
      
  }
  showToolbar = false;
  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
    const scrollTop = $event.detail.scrollTop;
    this.showToolbar = scrollTop >= 225;
    }
    }

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.storage.get("idusuario")
    .then(id => {
      //console.log(this.datos,id);
        return this.servicioCurso.verificarsuscripcion(this.datos.idcursos,id)

    })
    .then(resp=>{
      this.verificacion=resp;
      //console.log("nuemro de cursos"+this.verificacion.length);
    })
    .catch(err=>{
      console.log(err);
      
    })
    this.lugares.listarlUnlugar(this.datos.iddatos_ins)
    .then(lugares=>{
      console.log(lugares[0]);
      this.lugar=lugares[0]
      return this.usuario.mishorarios(this.datos.idtipo_horario)

    })
    .then(horario=>{
      console.log(horario);
     // this.horario=horario
      this.armarhorario(horario)
      this.loadMap()
    })
    .catch(err=>console.log(err))
  }
 

  detallepago(costo){
    this.comision= (costo*0.1)
    this.routes.navigate(['/cli/inicio/vercurso/detallepago',{comision:this.comision,costo:costo,moneda:this.datos.tipomoneda,curso:this.datos.titulo}])
  }

  verinstructor(id){
    this.routes.navigate(['/cli/inicio/vercurso/verinstructor'],id)
  }

  verHorarios(idcurso,idusuario,titulo){
    console.log(this.datos);
    
    this.routes.navigate(['/cli/inicio/vercurso/selecthorario',this.datos])
  }

  //funciona que redirecciona al curso supscrito
  gocourse(cur,usu){
    
  }

  inscribirme(){
    this.storage.get('idusuario')
    .then(id=>{
      return this.servicioCurso.crearUsu_cur(id,this.datos.idcursos,'i')
    })
    .then(()=>{
      console.log('se asigno correctamente el alumno al curso');
      
    })
    .catch(err=>{
      console.log(err);
    })
  }

  ngAfterViewInit() {
		
	}
  async loadMap() {
		let latlng = {lat:parseFloat(this.lugar.lat),lng:parseFloat(this.lugar.lng)}
		
		let map
		map = new google.maps.Map(document.querySelector('#mapMOD'), {
			center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
			zoom: this.lugar.zoom,
			disableDefaultUI: true
		});
    console.log(latlng)
    var contentString =`
    <div id="contentmap">
    <h5>${this.lugar.nombregym}</h5>
    <div >
    <p>${this.lugar.direccion}</p>
    </div>
    </div>
    ` 

let infowindow = new google.maps.InfoWindow({
  content: contentString
});

		var marker = new google.maps.Marker(
			{
				position:latlng,
        title:"hola",
        map: map,
			}
    )
    infowindow.open(map, marker);
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    /**
     * 
     let geocoder = new google.maps.Geocoder;
     
     map.addListener('click', function (event) {
       marker.setPosition(event.latLng)
       geocoder.geocode({
         'location': event.latLng
       }, function (results, status) {
         if (status === google.maps.GeocoderStatus.OK) {
           if (results[0]) {
 
             console.log('place id: ', results);
             this.direccion=results[0]['formatted_address']
           //	_myFormins.get("direccion").setValue(results[0]['formatted_address'])
 
 
           } else {
             console.log('No results found');
           }
         } else {
           console.log('Geocoder failed due to: ' + status);
         }
       });
     
     });
     */
  }
armarhorario(data){
  this.horario=[]
  console.log(data);
        if (data.length != 0) {
          for (let i in this.dias) {
            this.horario.push({
              nombre: i,
              horas: []
            })
            for (let j in data) {
              if (data[j].dia == i) {
                this.horario[i].horas.push(
                  {
                    id: data[j].idhorarios,
                    cantidad: data[j].cantidad-data[j].contador,
                    inicio: data[j].hora_ini.substring(0,5),
                    fin: data[j].hora_fin.substring(0,5),
                    estado: 1
                  })
              }
            }
          }
        } 
        console.log(this.horario);
}
abrirpagina(){
  const option:InAppBrowserOptions={
    location:'yes',
    
  }
  let browser = this.iab.create('https://web.sintesis.com.bo/payment/#/pay?entidad=4&ref=20100926000001&red=http://www.abc.com', '_blank', option);
  browser.on('loadstart').subscribe(()=>{
    alert('load start');
  }
  ,err=>console.log(JSON.stringify(err))
  );
//browser.show()
}
}
