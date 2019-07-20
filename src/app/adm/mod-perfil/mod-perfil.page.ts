import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { ToastController, LoadingController, NavController } from '@ionic/angular';

declare var google: any;
@Component({
	selector: 'app-mod-perfil',
	templateUrl: './mod-perfil.page.html',
	styleUrls: ['./mod-perfil.page.scss'],
})
export class ModPerfilPage implements OnInit, AfterViewInit {
	fechanac = '1990-03-03'
	datos = {
		peso: '40',
		altura: '120',
		telefono: '',
		genero: 'h',
		fechanac: '2019-01-01',
		correo: ""

	}
	datosins = {
		descripcion: "",
		//nombregym: '',
		lat: '',
		lng: '',
		zoom: '',
		direccion: ''
	}
	id
	rol = 'instructor'
	myForm: FormGroup
	myFormins: FormGroup
	constructor(public formb: FormBuilder,
		private geolocation: Geolocation,
		private route: ActivatedRoute,
		public toastController: ToastController,
		private navCtrl: NavController,
		private user: UsuarioProvider,
		public loadingController: LoadingController
	) {

		console.log(this.route.snapshot.params);
		for (let key in this.datos)
			this.datos[key] = this.route.snapshot.paramMap.get(key) == 'null' ? this.datos[key] : this.route.snapshot.paramMap.get(key)

		for (let key in this.datosins)
			this.datosins[key] = this.route.snapshot.paramMap.get(key) != 'null' ? this.route.snapshot.paramMap.get(key) : ''



		this.id = this.route.snapshot.paramMap.get("idusuarios")

		this.myForm = this.formb.group({
			telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(12)]],
			fechanac: ['', [Validators.required]],
			peso: ['', [Validators.required]],
			altura: ['', [Validators.required]],
			genero: ['', [Validators.required]],
			correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
		});
		this.myForm.setValue(this.datos)
		this.myFormins = this.formb.group({
			descripcion: ['', [Validators.required]],
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
		console.log("despues de cargar vista", this.myFormins.value)

		//this.loadMap()
		//this.loadMap2()

	}
	async presentToast(text) {
		const toast = await this.toastController.create({
			message: text,
			duration: 2000
		});
		toast.present();
	}
	guardar() {
		if (this.myForm.valid) {
			let loading = this.presentLoading('Guardando datos')
			this.user.actualizarusuariodatosnormales(this.myForm.value, this.id)

				.then(res => {
					console.log(res);
					loading.then(load => load.dismiss())
					this.presentToast("Se modificaron los datos correctamente")
					this.navCtrl.back()

				})
				.catch(err => {
					console.log(err);
					this.presentToast("Error al guardar los datos")
					loading.then(load => load.dismiss())
				})
		}
		else this.presentToast("Tiene que llenar todos los datos")

	}
	async loadMap() {
		// This code is necessary for browser
		let latlng = {}
		console.log(this.datosins)
		if (this.datosins.lat == "") {
			let resp = await this.geolocation.getCurrentPosition()
			latlng = { lat: resp.coords.latitude, lng: resp.coords.longitude }
		} else {
			latlng = { lat: parseFloat(this.datosins.lat), lng: parseFloat(this.datosins.lng) }
		}
		let map
		map = new google.maps.Map(document.querySelector('#mapMOD'), {
			center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
			zoom: this.datosins.lat != "" ? parseInt(this.datosins.zoom) : 12,
			disableDefaultUI: true
		});
		console.log(latlng)
		var marker = new google.maps.Marker(
			{
				position: latlng,
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

						//alert('place id: ' + results[0].place_id);
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
	async presentLoading(text) {
		const loading = await this.loadingController.create({
			message: text,
		});
		await loading.present()
		return loading
	}
	/**
	 
	 map: GoogleMap;
 
 
	 async loadMap2() {
		 let latlng:any = {}
		 console.log(this.datosins)
		 if (!this.datosins.lat ) {
			 let resp = await this.geolocation.getCurrentPosition()
			 latlng = { lat: resp.coords.latitude, lng: resp.coords.longitude }
		 } else {
			 latlng = { lat: parseFloat(this.datosins.lat), lng: parseFloat(this.datosins.lng) }
		 }
		 // This code is necessary for browser
		 Environment.setEnv({
		   'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDv9zk84ed6_ckRorvxhVnTfecLs_aSbFw',
		   'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDv9zk84ed6_ckRorvxhVnTfecLs_aSbFw'
		 });
	 
		 let mapOptions: GoogleMapOptions = {
		   camera: {
			  target: {
				lat: latlng.lat,
				lng: latlng.lng,
				
			  },
			  zoom: 18,
			  tilt: 30
			}
		 };
	 
		 this.map = GoogleMaps.create('map_canvas', mapOptions);
	 
		 let marker: Marker = this.map.addMarkerSync({
		   title: 'Tu lugar de trabajo',
		   icon: 'blue',
		   animation: 'DROP',
		   position: {
			 lat: latlng.lat,
			 lng: latlng.lng,
		   }
		 });
		 let geocoder = new google.maps.Geocoder;
		 let _myFormins = this.myFormins
		 marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((event) => {
		   //alert('clicked');
			 console.log(event)
			 
		 });
		 this.map.on(GoogleMapsEvent.MAP_CLICK)
		 .subscribe(event=>{
			 //alert(JSON.stringify(event));
			 console.log(event);
			 
		   marker.setPosition(event[0])
			 console.log(event)
			 _myFormins.get("lat").setValue(marker.getPosition().lat)
			 _myFormins.get("lng").setValue(marker.getPosition().lng),
				 _myFormins.get("zoom").setValue(this.map.getCameraZoom())
			 geocoder.geocode({
				 'location': event[0]
			 }, function (results, status) {
				 if (status === google.maps.GeocoderStatus.OK) {
					 if (results[0]) {
 
						 //alert('place id: ' + results[0].place_id);
						 _myFormins.get("direccion").setValue(results[0]['formatted_address'])
 
 
					 } else {
						 console.log('No results found');
					 }
				 } else {
					 console.log('Geocoder failed due to: ' + status);
				 }
			 });
		 })
	   }
	 */
}
