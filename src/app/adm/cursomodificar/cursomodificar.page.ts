import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CursoService } from 'src/app/services/curso/curso.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AnimationOptions} from '@ionic/angular/dist/providers/nav-controller';
import { Storage } from '@ionic/storage';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';

@Component({
  selector: 'app-cursomodificar',
  templateUrl: './cursomodificar.page.html',
  styleUrls: ['./cursomodificar.page.scss'],
})
export class CursomodificarPage implements OnInit {
  datos
  duracion
  myFormins: FormGroup
  idusuario
  datoslug=[]
  horarios=[]
  constructor(
    private routes:Router,
    public formb: FormBuilder,
    public navCtrl: NavController,
    private alertController:AlertController,
    private cursoservicio:CursoService,
    private storage:Storage,
    private lugares:LugaresService,
    private usuario:UsuarioProvider,
    public loadingController: LoadingController
  ) {
    this.datos=this.routes.getCurrentNavigation().extras
    this.duracion=this.datos.semanas+" semanas"
    this.myFormins = this.formb.group({
      descripcion: [this.datos.descripcion, [Validators.required]],
      titulo: [this.datos.titulo, [Validators.required]],
      costo: [this.datos.costo, [Validators.required]],
      moneda: [this.datos.tipomoneda, [Validators.required]],
      horario: [this.datos.idtipo_horario, [Validators.required]],
      iddatos_ins: [this.datos.iddatos_ins, [Validators.required]],
    });  
   }
   ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('idusuario')
    .then(idusu => {
      this.idusuario=idusu
      this.listarlugars(idusu)
    })
  }


  listarlugars(id){
    console.log("idusus",id);
    
    this.lugares.listarlugares(1,id).then(resp=>{
      console.log(resp);
      
        this.datoslug=resp
        return this.usuario.listarTipohorario(id)
    })
    .then(datos=>{
      this.horarios=datos
      console.log(datos);
      
    })
  }
  modificar(){
    let loading=this.presentLoading('Modificando Datos')
    console.log(this.myFormins.value);
    
    this.cursoservicio.modificarcurso(this.myFormins.value,this.datos.idcursos)
    .then(resp =>{
      return loading
    })
    .then(load=>{
      this.presentAlert()
      load.dismiss()
    })
  }
 
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Curso modificado',
      message: 'Los datos del curso fueron modificados correctamente',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
              let animations:AnimationOptions={
                animated: true,
                animationDirection: "back"
              }
              this.navCtrl.back(animations)
          }
        }
      ]
    });
  
    await alert.present();
  }

  adicionarlugar(){
    this.navCtrl.navigateForward(["/adm/cursos/cursomodificar/crearlugar"],this.idusuario)
  }

    adicionarhorario(){
      this.navCtrl.navigateForward(["/adm/cursos/cursomodificar/mishorarios"])
    }
    async presentLoading(txt) {
      const loading = await this.loadingController.create({
        message: txt,
        duration: 2000
      });
      await loading.present();
      return loading
    }
}
