import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { Router } from '@angular/router';
import { AnimationOptions} from '@ionic/angular/dist/providers/nav-controller';
import { LoadingController,NavController, ToastController} from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-crearlugar',
  templateUrl: './crearlugar.page.html',
  styleUrls: ['./crearlugar.page.scss'],
})
export class CrearlugarPage implements OnInit {
	datosins = {
		gym:'',
		lat: '',
		lng: '',
		zoom: '',
		direccion: ''
	  }
	  idusu
  myFormins: FormGroup
  constructor(
	private geolocation: Geolocation,
	private serviciolugar:LugaresService,
	private routes:Router,
	public navCtrl: NavController,
	private toastController:ToastController,
    public loadingController: LoadingController,
    public formb: FormBuilder) { 
		this.idusu=this.routes.getCurrentNavigation().extras
    this.myFormins = this.formb.group({
			gym: ['', [Validators.required]],
			direccion: ['', [Validators.required]],
			lat: ['', [Validators.required]],
			lng: ['', [Validators.required]],
			zoom: ['', [Validators.required]],
		});
		this.myFormins.setValue(this.datosins)
  }

	ngOnInit() {
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
				zoom: this.datosins.lat!=""  ? parseInt(this.datosins.zoom) : 8,
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
		let loading = this.presentLoading('Guardando datos')
		this.serviciolugar.crearcurso(this.myFormins.value,this.idusu).then(resp=>{
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
