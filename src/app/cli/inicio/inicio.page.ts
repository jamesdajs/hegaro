import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso/curso.service';
import { UsuarioProvider } from 'src/app/services/usuario/usuario';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonInfiniteScroll } from '@ionic/angular';

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
  count=0
  constructor(private routes: Router,
    private servicesCurso:CursoService,
    private socialsharing:SocialSharing) { 
      
    }
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


    

  ngOnInit() {
    this.listarcursos()
  }
 /* toggleInfiniteScroll() {
    console.log('Done',this.infiniteScroll.disabled);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }*/
  ionViewWillEnter() {
    
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
  im

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
    this.servicesCurso.Getnumcursos(1)
    .then(num=>{})
  }

  //FUNCION VER INSTRUCTOR
  verInstructor(id){
    console.log("id facebook"+id);
      this.routes.navigate(['/cli/inicio/verinstructorI'],id)
  }

  //-----FUNCIONES PARA COMPARTIR CURSOS----

  //FUNCION QUE COMPARTE MEDIANTE CUALQUIER RED SOCIAL
  shareWithOptions(item){
    console.log("foto 1 ",item.fotos[0].url);
    if(item.fotos[0].url==0){
      this.socialsharing.shareWithOptions({
        message:item.titulo,
        subject:item.descripcion,
        url:'www.hegaro.com.bo',
        chooserTitle:'Compartir Via'
        }).then(() => {
          console.log("shared successfull"); 
        }).catch((e) => {
          console.log("shared failed"+e);
        });
    }else{
      this.socialsharing.shareWithOptions({
        message:item.titulo,
        subject:item.descripcion,
        files:[item.fotos[0].url],
        url:'www.hegaro.com.bo',
        chooserTitle:'Compartir Via'
        }).then(() => {
          console.log("shared successfull"); 
        }).catch((e) => {
          console.log("shared failed"+e);
        });
    }
  }
 

 doInfinite(event) {

  console.log('funcion');
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      //if (data.length == 1000) {
       // event.target.disabled = true;
      //}
    }, 500);
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  doRefresh(event) {
    this.servicesCurso.listarcursos(1).subscribe(data=>{

      data.forEach(item=>{
        item.idcursos
        item['fotos']=[]
        this.servicesCurso.listarfotos(item.idcursos)
        .then(res=>{
          item['fotos']=res
          event.target.complete();
          this.count=0
        })
      })
      this.cursos=data
      console.log(data)
    },err=>{
      console.log(err);
      event.target.cancel()
    })
  }
  loadData(event) {
    this.count+=3
    this.servicesCurso.listarcursosPaginador(1,this.count).subscribe(data=>{

      data.forEach(item=>{
        item.idcursos
        item['fotos']=[]
        this.servicesCurso.listarfotos(item.idcursos)
        .then(res=>{
          item['fotos']=res
          //event.target.complete();
        })
      })
      this.cursos.push(...data)
      //console.log(data)
    },err=>{
      console.log(err);
      //event.target.cancel()
    })
  }
}
