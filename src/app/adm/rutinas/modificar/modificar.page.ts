import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ModalController, ToastController, NavController } from '@ionic/angular';
import { ModaladdejerPage } from '../modaladdejer/modaladdejer.page';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'app-modificar',
	templateUrl: './modificar.page.html',
	styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
	idrut
	myForm: FormGroup
	ejercicios = []
	ejerasignados = []
	idalumno
	personal={
		fechaini:'',
		fechafin:''
	  }
	constructor(private arouter: ActivatedRoute,
		private formb: FormBuilder,
		private rutina: RutinaProvider,
		public modalController: ModalController,
		public toastController: ToastController,
		private navCtrl: NavController,
		private storage: Storage
	) {
		console.log(this.arouter.snapshot.params)
		this.idrut = this.arouter.snapshot.paramMap.get('idrutinas')
		this.myForm = this.formb.group({
			nombre: [this.arouter.snapshot.paramMap.get('nombre'), [Validators.required, Validators.maxLength(50)]],
			descripcion: [this.arouter.snapshot.paramMap.get('descripcion'), [Validators.required, Validators.maxLength(200)]]
		});
		this.idalumno = this.arouter.snapshot.paramMap.get('idalumno')
		this.personal.fechaini = this.arouter.snapshot.paramMap.get('fecha_ini')
		this.personal.fechafin = this.arouter.snapshot.paramMap.get('fecha_fin')
	}
	ngOnInit() {
		console.log(this.idalumno)
		this.cargarejercicios()
	}
	cargarejercicios() {
		this.rutina.listarEjerciciosporRutinas(this.idrut)
			.then(data => {
				this.ejerasignados = data
				console.log(data);

			})
	}
	async addEjercicio() {
		const modal = await this.modalController.create({
			component: ModaladdejerPage,
			componentProps: { ejerselec: this.ejercicios, ejerguardados: this.ejerasignados }
		});

		await modal.present();
		const { data } = await modal.onDidDismiss()
		console.log(data);
		this.ejercicios = data

	}
	eliminar(i) {
		this.ejercicios.splice(i, 1);
	}
	guardar() {
		if (this.myForm.invalid || this.ejercicios.length == 0)
			this.presentToast('Tienen que llenar todos los campos y seleccionar al menos un ejercicio')
		else {
			this.rutina.modificarRutinaDefecto(this.idrut, this.myForm.value)
				.then(res => {
					let func = []
					console.log(res)
					for (let i in this.ejercicios)
						func.push(this.rutina.crearRutina_Ejer(this.idrut, this.ejercicios[i].idejercicios))
					return Promise.all(func)
				})
				.then(() => this.rutina.listaridejerrut(this.idrut))
				.then(array => {
					console.log(array);
					let func = []
					array.forEach(item => {
						this.ejercicios.forEach(ejer => {
							if (item.id_ejercicio == ejer.idejercicios) {
								ejer.sets.forEach(sets => {
									func.push(this.rutina.crearSetRutina_Ejer(item.idrut_ejer, sets))
								})
							}
						})
					})
					return Promise.all(func)
					//id_ejercicio,idrut_ejer
				})
				.then(()=>{
					return this.modRut_usu(this.idrut)
				})
				.then(() => {
					this.presentToast('Se guardo corectamente la rutina')
					this.navCtrl.back()
				})
				.catch(err => {
					console.log(err);

					this.presentToast('No se puedo guardar la rutina correctamente')
					this.navCtrl.back()
				})
		}
	}
	eliminarasig(item, i) {
		console.log(item);
		this.rutina.eliminarSetRut_Ejer(item.idrut_ejer)
			.then(() => this.rutina.eliminarRut_Ejer(item.idrut_ejer))
			.then(() => {
				this.presentToast('Se eliminó correctamente el ejercicio de la rutina.')
				this.ejerasignados.splice(i, 1);
			})
			.catch(err => {
				console.log(err)
				this.presentToast('No se puedo eliminar el ejercicio de la rutina.')
			})

	}
	async presentToast(txt) {
		const toast = await this.toastController.create({
			message: txt,
			duration: 2000
		});
		toast.present();
	}
	modRut_usu(_idrut){
		if(this.idalumno)
		  return this.rutina.ModificarRut_Usu(this.idalumno,_idrut,this.personal)
		else return true
	  }

}
