import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { promise } from 'protractor';
import { AlertController, ToastController, NavController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mishorarios',
  templateUrl: './mishorarios.page.html',
  styleUrls: ['./mishorarios.page.scss'],
})
export class MishorariosPage implements OnInit {
  dias = ["DOMINGO", 'LUNES', "MARTES", 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
  horario = []
  idusuario
  cantidad = []
  idtipohorario
  myForm: FormGroup
  nombre
  constructor(private storage: Storage,
    private servicioUsuario: UsuarioProvider,
    public navCtrl: NavController,
    private alertController: AlertController,
    public loadingController: LoadingController,
    public arouter: ActivatedRoute,
    private formb: FormBuilder,
    public toastController: ToastController
  ) {
    this.idtipohorario = this.arouter.snapshot.params.idtipo_horario
    this.nombre = this.arouter.snapshot.params.nombre ? this.arouter.snapshot.params.nombre : ''
    this.storage.get('idusuario').then(id => {
      this.idusuario = id
      this.recuperarhorario(this.idtipohorario)
    })
    for (let i = 0; i < 6; i++)
      this.cantidad.push({ name: i })
    this.myForm = this.formb.group({
      nombre: [this.nombre, [Validators.required]]
    });

  }

  ngOnInit() {
    console.log(this.idtipohorario)
  }



  aumentarhoras(_this) {

    _this.push({
      cantidad: 1,
      inicio: "08:00",
      fin: '09:00',
    })
  }
  quitarhoras(_this) {
    let idh = _this[_this.length - 1].id
    if (idh) {
      this.servicioUsuario.verificarhorario(idh)
        .then(resp => {
          if (resp.length == 0) {
            this.presentAlertConfirm(idh, _this)
          } else {
            this.presentAlertMessage()
          }
          console.log(resp);
        }).
        catch(er => {
          console.log(er);
        })
    } else {
      _this.pop()
    }
  }

  //alerta eliminar horario
  async presentAlertConfirm(idh, item) {
    const alert = await this.alertController.create({
      header: 'Estas a punto de eliminar un horario',
      message: 'Estas seguro de <strong>eliminar </strong> definitivamente este horario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.servicioUsuario.eliminarhorario(idh)
              .then(resp => {
                item.pop()
                console.log("elimino " + resp);
              })
          }
        }
      ]
    });

    await alert.present();
  }

  //alerta
  async presentAlertMessage() {
    const alert = await this.alertController.create({
      header: 'Denegado!!',
      message: 'No puedes eliminar este horario porque tienes alumnos inscritos',
      buttons: ['OK']
    });
    await alert.present();
  }


  guardar() {
    if(this.myForm.valid){

      let loading = this.presentLoading('Guardando datos')
      let x = []
      this.modificarOinsertar()
        .then(idtipo => {
  
          for (let i in this.dias) {
            for (let h in this.horario[i].horas) {
              console.log("consulta" + this.horario[i].horas[h].id);
              if (this.horario[i].horas[h].id) {
                console.log("ingreso a modificar");
                x.push(this.servicioUsuario.modificarhorario(this.horario[i].horas[h].cantidad, this.horario[i].horas[h].inicio, this.horario[i].horas[h].fin, this.horario[i].horas[h].id))
              } else {
                console.log("ingreso a adicionar");
                console.log(idtipo, this.horario[i].horas[h].cantidad, this.horario[i].nombre, this.horario[i].horas[h].inicio, this.horario[i].horas[h].fin);
                if (this.idtipohorario)
                  x.push(this.servicioUsuario.guardarhorario(this.idtipohorario, this.horario[i].horas[h].cantidad, this.horario[i].nombre, this.horario[i].horas[h].inicio, this.horario[i].horas[h].fin))
                else
                  x.push(this.servicioUsuario.guardarhorario(idtipo, this.horario[i].horas[h].cantidad, this.horario[i].nombre, this.horario[i].horas[h].inicio, this.horario[i].horas[h].fin))
  
              }
            }
          }
          return Promise.all(x)
        })
        .then(resp => {
          console.log(resp);
          let animations: AnimationOptions = {
            animated: true,
            animationDirection: "back"
          }
          loading.then(load => load.dismiss())
          this.presentToast('Se guardo correctamente el horario')
          this.navCtrl.back(animations)
        })
        .catch(er => {
          console.log(er);
          loading.then(load => load.dismiss())

          this.presentToast('Error al guardar el horario')
        })
    }
    else this.presentToast('Debe tener un nombre el horario')
  }
  modificarOinsertar() {
    if (this.idtipohorario)
      return this.servicioUsuario.modificarNombretipohorario(this.idtipohorario, this.myForm.value.nombre)
    else
      return this.servicioUsuario.guardarTipohorario(this.idusuario, this.myForm.value.nombre)
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

  //FUNCION QUE RECUPERA LOS HORARIOS
  recuperarhorario(id) {
    console.log("entro funcion" + id);
    this.servicioUsuario.mishorarios(id).then(data => {
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
                  cantidad: data[j].cantidad,
                  inicio: data[j].hora_ini,
                  fin: data[j].hora_fin,
                  estado: 1
                })
            }
          }
        }
      } else {
        for (let i in this.dias) {
          this.horario.push({
            nombre: i,
            horas: []
          })
        }
      }
      console.log(this.horario);
    })
      .catch(err => {
        console.log(err)
      })

  }
  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }
}
