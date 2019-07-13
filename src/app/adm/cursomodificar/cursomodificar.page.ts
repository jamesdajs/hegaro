import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CursoService } from 'src/app/services/curso/curso.service';
import { AlertController, NavController } from '@ionic/angular';
import { AnimationOptions} from '@ionic/angular/dist/providers/nav-controller';

@Component({
  selector: 'app-cursomodificar',
  templateUrl: './cursomodificar.page.html',
  styleUrls: ['./cursomodificar.page.scss'],
})
export class CursomodificarPage implements OnInit {
  datos
  duracion
  myFormins: FormGroup
  constructor(
    private routes:Router,
    public formb: FormBuilder,
    public navCtrl: NavController,
    private alertController:AlertController,
    private cursoservicio:CursoService
  ) {
    this.datos=this.routes.getCurrentNavigation().extras
    this.duracion=this.datos.semanas+" semanas"
    this.myFormins = this.formb.group({
      descripcion: [this.datos.descripcion, [Validators.required]],
      titulo: [this.datos.titulo, [Validators.required]],
      costo: [this.datos.costo, [Validators.required]],
      moneda: [this.datos.tipomoneda, [Validators.required]],
    });  
   }
   ngOnInit() {
  }

  modificar(){
    console.log(this.myFormins.value);
    
    this.cursoservicio.modificarcurso(this.myFormins.value,this.datos.idcursos)
    .then(resp =>{
      this.presentAlert()
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
}
