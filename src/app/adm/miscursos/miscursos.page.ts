import { Component, OnInit , ViewChild} from '@angular/core';
import { IonSlides,ActionSheetController,ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CursoService } from 'src/app/services/curso/curso.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-miscursos',
  templateUrl: './miscursos.page.html',
  styleUrls: ['./miscursos.page.scss'],
})
export class MiscursosPage implements OnInit {

  @ViewChild('mySlider') slider: IonSlides;
  selectedSegment='first';
  select="";
  slides = [
    {
      id: "first",
      title: "First Slide"
    },
    {
      id: "second",
      title: "Second Slide"
    }
  ];

  cursos=[]
  idusu

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl:ToastController,
    private routes:Router,
    private servicesCurso:CursoService,
    private socialsharing:SocialSharing,
    private storage:Storage,
    private alertController:AlertController
  ) { }
  ngOnInit() {
    this.listarcursos()
  }
  ionViewWillEnter() {
  }
  //-------------lista mis cursos----------------
  //FUNCION LISTAR CURSOS
  listarcursos() {
    this.storage.get("idusuario")
    .then(id => {
      this.idusu = id
      this.servicesCurso.miscursospublicados(1,parseInt(this.idusu))
      .subscribe(data=>{
        data.forEach(item=>{
          item.idcursos
          item['fotos']=[]
          this.servicesCurso.listarfotos(item.idcursos)
          .then(res=>{
            item['fotos']=res
          })
        })
        this.cursos=data
      })
    })
    console.log('id usuario'+this.idusu);
  }

  //----------------funciones tab slide------------------
  onSegmentChanged(segmentButton) {
    this.select=segmentButton.detail.value;
     const selectedIndex = this.slides.findIndex((slide) => {
       return slide.id === segmentButton.detail.value;
     });
     this.slider.slideTo(selectedIndex);
   }
 
   onSlideChanged(event) {
     
     this.slider.getActiveIndex()
     .then(num=>{
       this.selectedSegment=this.slides[num].id
     })
     
   }
   //--------------end funciones tab slide--------------*/

  //----------FUNCION DESLIZAR OPCIONES---------------
  opciones(item,i){
    this.actionSheetCtrl.create({
      buttons:[
        {
          text: 'Compartir',
          icon: 'md-share',
          handler: () => {
            console.log('Delete clicked');
            this.shareWithOptions(item)
          }
        },
        {
          text: 'Modificar',
          icon: 'create',
          handler: () => {
            this.routes.navigate(["/adm/cursos/cursomodificar"],item)
          }
        },
        {
          text: 'Eliminar',
          icon:'trash',
          handler: () => {
            console.log('Archive clicked');
            //this.eliminarpubli(p)
            this.estadoCurso(item.idcursos,i)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            
          }
        }
      ]
    }).then(actionsheet => {
      actionsheet.present();
    });
  }

  //

   //-------------funcion para mostrar toast ----------
   estadoToast=true;
   async presentToastWithOptions(){
     const toast = await this.toastCtrl.create({
       message: 'Esta seccion visualizará todos tus cursos publicados',
       showCloseButton: true,
       closeButtonText: 'Ok',
       animated:true,
     });
     if(this.estadoToast){
       toast.present()
       this.estadoToast=false
     } 
 
     const dismiss = await toast.onDidDismiss();
     if(dismiss.role === 'cancel') {
       this.estadoToast=true;
     }
    }
    //-------------END FUNCTION TOAST--------------

    //-------------------FUNCION CREAR CURSO------------
    crearcurso(){
      this.routes.navigate(['/adm/cursos/crearcurso'])
    }

      //FUNCION QUE COMPARTE MEDIANTE CUALQUIER RED SOCIAL
  shareWithOptions(item){
    console.log("foto 1 ",item.fotos[0].url);
      this.socialsharing.shareWithOptions({
        message:item.titulo,
        subject:item.descripcion,
        files:[item.fotos[0].url],
        url:'android:www.hegaro.com.bo',
        chooserTitle:'Compartir Via'
        }).then(() => {
          console.log("shared successfull"); 
        }).catch((e) => {
          console.log("shared failed"+e);
        });
  }

  //funcion para dar de baja curso
  async estadoCurso(id,i){
    const alert = await this.alertController.create({
      header: 'Estas a punto de eliminar este curso!',
      message: 'Ten en cuenta que al eliminar este curso, ya no estará disponible para que otras personas se puedan inscribir, sin embargo los estudiantes que esten inscritos podran visualizar sus rutinas normalmente!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Eliminar');
            this.cursos.splice(i,1);
            this.servicesCurso.eliminar(0,id).then(resp => {
              
            })
          }
        }
      ]
    });
    await alert.present();
    
}
doRefresh(event) {
  console.log("funciona");
  
  this.storage.get("idusuario")
.then(id => {
  this.idusu = id
  this.servicesCurso.miscursospublicados(1,parseInt(this.idusu))
  .subscribe(data=>{
    data.forEach(item=>{
      item.idcursos
      item['fotos']=[]
      this.servicesCurso.listarfotos(item.idcursos)
      .then(res=>{
        item['fotos']=res
        event.target.complete()
      })
    })
    this.cursos=data
  
  })
})
}


cursosinactivos(){
  this.storage.get("idusuario")
    .then(id => {
    this.routes.navigate(["/adm/cursos/cursosinactivos"],id)
  })
}
}
