import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm/fcm.service';

@Component({
  selector: 'app-selecthorario',
  templateUrl: './selecthorario.page.html',
  styleUrls: ['./selecthorario.page.scss'],
})
export class SelecthorarioPage implements OnInit {
  idcurso
  idusu
  idalumno
  curso
  tokenInstructor
  dias = ["DOMINGO", 'LUNES', "MARTES", 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
  horario = []
  seleccionados=[]
  idtipo_horario
  fbitemusuario={
    inscritos:0
  }
  constructor(private navCtrl:NavController,
    private servicioCurso:CursoService,
    private user:UsuarioProvider,
    private servicioUsuario:UsuarioProvider,
    private fcm:FcmService,
    public alertController: AlertController,
    private route:ActivatedRoute,
    private storage:Storage,
    public loadingController: LoadingController
    ) {
    //this.id=this.routes.getCurrentNavigation().extras
    this.idcurso = this.route.snapshot.paramMap.get('idcursos')
    this.curso = this.route.snapshot.paramMap.get('titulo')
    this.idusu = this.route.snapshot.paramMap.get('idusuarios')
      this.idtipo_horario=this.route.snapshot.paramMap.get('idtipo_horario')
    this.tokenInstructor = this.route.snapshot.paramMap.get('token')
    console.log("id"+ this.idcurso);
    this.recuperarhorario(this.idtipo_horario)
    this.storage.get("idusuario")
      .then(id => {
        console.log(id,this.idusu)
        this.idalumno = id
        
      })
   }

  ngOnInit() {
    this.servicioCurso.veralumnosinscritos(this.idusu,this.idcurso)
    .subscribe(item=>{
      console.log(item);
      this.fbitemusuario=item
    })
  }

    //GUARDAR HOARIOS SELECCIONADOS
    horariosseleccionados(){
      let load=this.presentLoading('Guardando datos')
      this.servicioCurso.crearUsu_cur(this.idalumno,this.idcurso,"i")
      .then(resp=>{
        let aux=[]
        for(let i in this.horario){
          if(this.horario[i].selec){
            aux.push(this.servicioCurso.guardar_registro_horario(this.horario[i].selec,resp))
          }
        }
        this.servicioCurso.modalumnosinscritos(this.idusu,this.idcurso,{inscritos:this.fbitemusuario.inscritos+1})
        this.servicioCurso.modsubcripcion(this.idalumno,this.idcurso,{rutinasnew:0,estado:true})
        aux.push(this.enviarnotificacion())
        return Promise.all(aux)
      })
      .then(resp=>{
        load.then(l=>l.dismiss())
        this.navCtrl.back()
        console.log(resp);
      }).catch(err=>{

        load.then(l=>l.dismiss())
        console.log(err);
      })
     console.log(this.horario);
     
    }

    //ENVIAR NOTIFICACION
    enviarnotificacion(){
      return this.fcm.notificacionforToken("Alumno nuevo","nueva suscripcion al curso"+this.curso,this.tokenInstructor,"","/adm/misalumnos")
      
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
              selec:"",
              horas: []
            })
            for (let j in data) {
              if (data[j].dia == i) {
                this.horario[i].horas.push(
                  {
                    id:data[j].idhorarios,
                    cantidad: data[j].cantidad-data[j].contador,
                    inicio: data[j].hora_ini.substring(0,5),
                    fin: data[j].hora_fin.substring(0,5),
                    estado:1
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
    }

    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        header: 'Horarios seleccionados!!',
        message: 'Se guardaran tus horarios seleccionados',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Guardar',
            handler: () => {
              this.horariosseleccionados()
              console.log('Confirm Okay');
            }
          }
        ]
      });
      await alert.present();
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
