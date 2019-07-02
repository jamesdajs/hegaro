import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  items: any;
  cursos=[]
  instructor=[]
  datos = {
    idcursos: '',
    costo: '',
    fecha: '',
    hora: '',
    semanas: '',
    titulo: '',
    descripcion: '',
    tipomoneda: '',
    estado: '',
    idusuarios:'',
    fullname:'',
    foto:'',
    telefono:''
  }

  constructor(private routes: Router,
    private servicesCurso:CursoService,
    private socialsharing:SocialSharing) { 
  
    }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.listarcursos()
  }

  //BUSCAR CURSO 
  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.cursos = this.cursos.filter((item) => {
        return (item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  //cancelar busqueda
  clearFilter() { 
    console.log("cancelar busqueda");
    this.listarcursos()
  }

  onCancel(){
    this.listarcursos()
  }

  //FUNCION PARA VISUALIZAR EL CURSO SELECCIONADO
  vercurso(curso) {
    console.log("id :"+curso.titulo + " "+ curso.descripcion);
    this.routes.navigate(['/cli/inicio/vercurso'],curso)
  }

  //FUNCION LISTAR CURSOS
  listarcursos() {
    this.servicesCurso.listarcursos(1).subscribe(data=>{

      data.forEach(item=>{
        item.idcursos
        item['fotos']=[]
        this.servicesCurso.listarfotos(item.idcursos)
        .then(res=>{
          item['fotos']=res
        })
      })
      this.cursos=data
      console.log(data)
    })
  }

  //FUNCION VER INSTRUCTOR
  verInstructor(id){
    console.log("id facebook"+id);
      this.routes.navigate(['/cli/inicio/verinstructorI'],id)
  }

  //-----FUNCIONES PARA COMPARTIR CURSOS----

  shareWithOptions(item){
    /*var options = {
      message: 'hola',
      subject: 'descripcion nada',
      files: "https://www.fbhoy.com/wp-content/uploads/2016/03/como-personalizar-url-pagina-facebook.jpg", 
      url:'www.hegaro.com.bo',//the property mentioned in the explanation
      chooserTitle: 'Share via'
    };*/

    this.socialsharing.shareWithOptions({
      message:"hola",
      subject:'algo para mostrar',
      url:'www.hegaro.com.bo',
      chooserTitle:'Compartir Via'
    }).then(() => {
      console.log("shared successfull"); 
    }).catch((e) => {
      console.log("shared failed"+e);
    });
  }

  async shareInstagram() {
    this.socialsharing.shareViaInstagram("mi curso", "https://www.fbhoy.com/wp-content/uploads/2016/03/como-personalizar-url-pagina-facebook.jpg").then(() => {
      console.log("shared successfull"); 
  }).catch((e) => {
      console.log("shared failed"+e);
    });
  }

  async shareFacebook() {
    this.socialsharing.shareViaFacebook("mi curso", "https://www.fbhoy.com/wp-content/uploads/2016/03/como-personalizar-url-pagina-facebook.jpg", null).then(() => {
      console.log("shared successfull"); 
  }).catch((e) => {
      console.log("shared failed"+e);
    });
  }

  async shareWhatsApp() {
    this.socialsharing.shareViaWhatsApp("", null, "").then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareTwitter() {
    this.socialsharing.shareViaTwitter(null, null, "this.url").then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareEmail() {
    this.socialsharing.shareViaEmail("this.text", 'My custom subject', ['saimon@devdactic.com'], null, null, "file.nativeURL").then(() => {
      
    }).catch((e) => {
      // Error!
    });
  }
}
