import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController, NavController, LoadingController } from '@ionic/angular';
import { ModaladdejerPage } from '../modaladdejer/modaladdejer.page';
import { Storage } from '@ionic/storage';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ActivatedRoute } from '@angular/router';
import { FcmService } from 'src/app/services/fcm/fcm.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
})
export class CrearPage implements OnInit {
  myForm: FormGroup
  ejercicios = []
  idalumno
  idcurso
  personal={
    fechaini:'',
    fechafin:''
  }
  tokencli
  curso
  idusu_cur
  constructor(
    private formb: FormBuilder,
    public modalController: ModalController,
    public storage:Storage,
    public rutina:RutinaProvider,
    public toastController: ToastController,
    public navCtrl:NavController,
    private arouter:ActivatedRoute,
    private fcm : FcmService,
    public loadingController: LoadingController
  ) {
    this.myForm = this.formb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]]
    });
    this.idalumno=this.arouter.snapshot.paramMap.get('idusu')
    this.tokencli=this.arouter.snapshot.paramMap.get('token')
    this.curso=this.arouter.snapshot.paramMap.get('curso')
    this.idcurso=this.arouter.snapshot.paramMap.get('id_curso')
    this.idusu_cur=this.arouter.snapshot.paramMap.get('idusu_cur')
    console.log(this.idalumno);
    
  }

  ngOnInit() {
  }
  async addEjercicio() {
    const modal = await this.modalController.create({
      component: ModaladdejerPage,
      componentProps: { ejerselec:this.ejercicios }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss()
    console.log(data);
    this.ejercicios=data
  }
  eliminar(i){
    this.ejercicios.splice(i, 1);
  }
  guardar(){
    if(this.myForm.invalid || this.ejercicios.length==0)
      this.presentToast('Tienen que llenar todos los campos y seleccionar al menos un ejercicio')
    else{
      let loading = this.presentLoading()
      let _idusu, _idrut
      this.storage.get('idusuario')
      .then(idusu=>{
        _idusu = idusu
        let tipo=this.idalumno?'p':'d'
        return this.rutina.crearRutina(_idusu,this.myForm.value,tipo)
      })
      .then(res=>{
        let func = []
        console.log(res)
        _idrut=res
        for(let i in this.ejercicios)
          func.push(this.rutina.crearRutina_Ejer(res,this.ejercicios[i].idejercicios))
        return Promise.all(func)
      })
      .then(()=>this.rutina.listaridejerrut(_idrut))
      .then(array=>{
        console.log(array);
        let func=[]
        /**
         * 
         array.forEach(item=>{
           this.ejercicios.forEach(ejer=>{
             if(item.id_ejercicio==ejer.idejercicios){
               ejer.sets.forEach(sets=>{
                 func.push(this.rutina.crearSetRutina_Ejer(item.idrut_ejer,sets))
               })
             }
           })
         })
         */
        return Promise.all(func)
        //id_ejercicio,idrut_ejer
      })
      .then(()=>{
        return this.guardarRut_usu(_idrut)
      })
      .then(()=>{
        this.rutina.estadousu_cur(this.idusu_cur)
        loading.then(load=>load.dismiss())
        this.presentToast('Se guardo corectamente la rutina')
        .then(()=>loading)
        .then(load=>load.dismiss())
        this.navCtrl.back()
      })
      .catch(err=>{
        console.log(err);
        loading.then(load=>load.dismiss())
        this.presentToast('No se puedo guardar la rutina correctamente')
        this.navCtrl.back()
      })
    }
  }
  guardarRut_usu(_idrut){ 
    if(this.idalumno)
      return this.rutina.crearRut_Usu(this.idalumno,_idrut,this.idusu_cur,this.personal)
      .then(res=>{
        console.log(res);
        return this.fcm.notificacionforToken(
          'Rutina asignada',
          'Tienen una nueva rutina en el curso '+this.curso,
          this.tokencli,
          '',
          '/cli/mis-cursos'
        )
      })
    else return true
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Guardando datos...',
    });
    await loading.present();
    return loading
  }
}
