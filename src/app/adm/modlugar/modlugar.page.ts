import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { AnimationOptions} from '@ionic/angular/dist/providers/nav-controller';
import { ToastController, LoadingController,NavController } from '@ionic/angular';
declare var google: any;
@Component({
  selector: 'app-modlugar',
  templateUrl: './modlugar.page.html',
  styleUrls: ['./modlugar.page.scss'],
})
export class ModlugarPage implements OnInit {
  datos
  myFormins: FormGroup
  constructor(
    private routes:Router,
    public formb: FormBuilder,
    private serviciolugar:LugaresService,
    public navCtrl: NavController,
	  private toastController:ToastController,
    public loadingController: LoadingController,
  ) { 
    this.datos=this.routes.getCurrentNavigation().extras
    console.log("ddd",this.datos);
    
    this.myFormins = this.formb.group({
			gym: [this.datos.nombregym, [Validators.required]],
			direccion: [this.datos.direccion, [Validators.required]],
			lat: [this.datos.lat, [Validators.required]],
			lng: [this.datos.lng, [Validators.required]],
			zoom: [this.datos.zoom, [Validators.required]],
		});
  }

  ngOnInit() {
    this.loadMap()

  }
  ngAfterViewInit() {
  }

	async loadMap() {
    let latlng = { lat: parseFloat(this.datos.lat), lng: parseFloat(this.datos.lng) }
    let map
    map = new google.maps.Map(document.querySelector('#mapMOD'), {
      center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
      zoom:parseInt(this.datos.zoom),
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
    let _myFormins = this.myFormins
    map.addListener('click', function (event) {
      marker.setPosition(event.latLng)
      _myFormins.get("lat").setValue(marker.getPosition().lat())
      _myFormins.get("lng").setValue(marker.getPosition().lng()),
      _myFormins.get("zoom").setValue(map.getZoom())
      geocoder.geocode({
        'location': event.latLng
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {

            console.log('place id: ', results);
            
            _myFormins.get("direccion").setValue(results[0]['formatted_address'])


          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
      console.log(_myFormins.value)
    });
  }

  guardar(){
		if (this.myFormins.valid) {
		let loading = this.presentLoading('Modificando datos')
		this.serviciolugar.modlugar(this.myFormins.value,this.datos.iddatos_ins).then(resp=>{
			let animations:AnimationOptions={
				animated: true,
				animationDirection: "back"
			  }
			  loading.then(load => load.dismiss())
			  this.navCtrl.back(animations)
		}).catch(err=>{
			console.log(err);
			
		})
		}
		else this.presentToast("Completa los campos")
	}

	  //funcion toast cargando
	  async presentToast(text) {
		const toast = await this.toastController.create({
		  message: text,
		  duration: 2000
		});
		toast.present();
	  }

	 //funcion para el loading
	 async presentLoading(text) {
		const loading = await this.loadingController.create({
		  message: text,
		  duration: 2000
		});
		await loading.present();
		return loading
	  }
}
