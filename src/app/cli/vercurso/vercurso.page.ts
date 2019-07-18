import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google: any;
@Component({
  selector: 'app-vercurso',
  templateUrl: './vercurso.page.html',
  styleUrls: ['./vercurso.page.scss'],
})
export class VercursoPage implements OnInit {
  owner=false
  direccion
  datos
  comision
  verificacion=[]
  datosins = {
		descripcion: "",
		lat: '',
		lng: '',
		zoom: '',
		direccion: ''
  	}
  constructor(private routes:Router,
    private servicioCurso:CursoService,
    private geolocation: Geolocation,
    private storage:Storage) { 
      this.datos=this.routes.getCurrentNavigation().extras
      this.storage.get("idusuario")
      .then(id => {
        console.log("id usuario"+id+ " "+this.datos.idcursos);
        console.log(this.datos);
        if(id=this.datos.idusuario){
          this.owner=true
          this.servicioCurso.verificarsuscripcion(this.datos.idcursos,id).then(resp=>{
            this.verificacion=resp;
            console.log("nuemro de cursos"+this.verificacion.length);
          
          })
        }
      })
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

  }
 

  detallepago(costo){
    this.comision= (costo*0.1)
    this.routes.navigate(['/cli/inicio/vercurso/detallepago',{comision:this.comision,costo:costo,moneda:this.datos.tipomoneda,curso:this.datos.titulo}])
  }

  verinstructor(id){
    this.routes.navigate(['/cli/inicio/vercurso/verinstructor'],id)
  }

  verHorarios(idcurso,idusuario,titulo){
    console.log("idusu ver curso"+idusuario);
    
    this.routes.navigate(['/cli/inicio/vercurso/selecthorario',{idc:idcurso,idu:idusuario,token:this.datos.token,t:titulo}])
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
		this.loadMap()
	}
  async loadMap() {
		let latlng = {}
		console.log(this.datosins)
		if (this.datosins.lat=="" ) {
			let resp = await this.geolocation.getCurrentPosition()
			latlng = { lat: resp.coords.latitude, lng: resp.coords.longitude }
		} else {
			latlng = { lat: parseFloat(this.datosins.lat), lng: parseFloat(this.datosins.lng) }
		}
		let map
		map = new google.maps.Map(document.querySelector('#mapMOD'), {
			center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
			zoom: this.datosins.lat!=""  ? parseInt(this.datosins.zoom) : 12,
			disableDefaultUI: true
		});
		console.log(latlng)
		var marker = new google.maps.Marker(
			{
				position:latlng,
				map: map,
			}
		)
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
	}
}
