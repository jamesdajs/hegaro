import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment, IonSlides, ToastController, ModalController, ActionSheetController, IonButton } from '@ionic/angular';
import { Router } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ModalrutdefPage } from '../modalrutdef/modalrutdef.page';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Storage } from '@ionic/storage';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-alumnosdetalle',
  templateUrl: './alumnosdetalle.page.html',
  styleUrls: ['./alumnosdetalle.page.scss'],
})
export class AlumnosdetallePage implements OnInit {

  @ViewChild('mySlider') slider: IonSlides;
  @ViewChild('butReg') botonreg: IonButton;
  @ViewChild('butfin') botonfin: IonButton;
  selectedSegment = 'first';
  select = "";
  rutinas = []
  slides = [
    {
      id: "first",
      title: "First Slide"
    },
    {
      id: "second",
      title: "Second Slide"
    },
    /**
     * 
     {
       id: "third",
       title: "Third Slide"
     }
     */
  ];
  datos
  registro=[]
  mensage=''
  chats=[]
  id
  constructor(public toastCtrl: ToastController,
    private router: Router,
    private rutina: RutinaProvider,
    public modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private cursoservice:CursoService,
    private storage:Storage
  ) {
    this.datos = this.router.getCurrentNavigation().extras
    console.log(this.datos);

  }
  //----------------funciones tab slide------------------
  onSegmentChanged(segmentButton) {
    this.select = segmentButton.detail.value;
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.detail.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(event) {
    

    this.slider.getActiveIndex()
      .then(num => {
        this.selectedSegment = this.slides[num].id
      })
  }
  //--------------end funciones tab slide--------------*/
  ionViewWillEnter(){
    this.cargarRutinas()

  }
  chatSubscrive:Subscription
  ngOnInit() {
    this.storage.get('idusuario')
    .then(id=>{
      this.id=id
    })
    this.chatSubscrive=this.cursoservice.verchat(this.datos.idusuarios,this.datos.id_curso)
        .subscribe(chats=>{
          this.chats=chats
        })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.chatSubscrive.unsubscribe()
  }

  //-------------funcion para mostrar toast ----------
  estadoToast = true;
  async presentToastWithOptions() {
    const toast = await this.toastCtrl.create({
      message: 'En esta sección podrás asignar rutinas y dietas para',
      showCloseButton: true,
      closeButtonText: 'Ok',
      animated: true,
    });
    if (this.estadoToast) {
      toast.present()
      this.estadoToast = false
    }

    const dismiss = await toast.onDidDismiss();
    if (dismiss.role === 'cancel') {
      this.estadoToast = true;
    }
  }
  //-------------END FUNCTION TOAST--------------
  //--------------FUNCION PARA SUB ITEM-------------
  showSubmenu: boolean = false;

  menuItemHandler(item): void {
    if (item['ejercicios'].length == 0)
      this.rutina.listarEjerciciosporRutinas(item.idrutinas)
        .then(data => {
          item['ejercicios'] = data
          item.estadohidden = true
        })
    else item.estadohidden = !item.estadohidden

  }
  crerdef() {
    this.router.navigate(['/adm/misalumnos/alumnodetalle/creardef',
      {
        idusu: this.datos.idusuarios,
        token: this.datos.token,
        curso: this.datos.titulo,
        id_curso: this.datos.id_curso,
        idusu_cur: this.datos.idusu_cur
      }])
  }
  
  cargarRutinas() {
    this.rutina.listarRutinas_porCurso(this.datos.idusu_cur, true)
      .then(array => {
        for (let i in array) {
          array[i]['estadohidden'] = false
          array[i]['ejercicios'] = []
        }

        console.log(array);
        this.rutinas = array
        return this.rutina.verregistroCurso(this.datos.idusu_cur)
      })
      .then(res=>{
        console.log(res);
        if(res.length!=0) this.botonreg.disabled=true
        if(res.length>2) this.botonfin.disabled=true
        
        this.registro=res
      })
      .catch(err=>{
        console.log(err);
        
      })
  }
  regInicioCurso(){
    this.rutina.registroInicioFinCurso(this.datos.idusu_cur,this.datos.altura,this.datos.peso,0)
    .then(res=>{
      this.botonreg.disabled=true
      this.presentToast("Se registro el inicio del curso")
    })
  }
  regfinCurso(){
    this.rutina.registroInicioFinCurso(this.datos.idusu_cur,this.datos.altura,this.datos.peso,1)
    .then(res=>{
      this.botonfin.disabled=true
      this.presentToast("Se registro el final del curso")
    })
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalrutdefPage,
      componentProps: this.datos
    });

    await modal.present();

  }
  async presentsheetRutina(item,i) {
    let textver = item.estadohidden ? 'Ocultar ejercicios' : 'Ver ejercicios'
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: textver,
          icon: 'eye',
          handler: () => {
            console.log(item);
            this.menuItemHandler(item)
          }
        },
        {
          text: 'Modificar',
          icon: 'paper',
          handler: () => {
            console.log('Share clicked');

            item['idalumno'] = this.datos.idusuarios
            if (item.tipo == 'p')
              this.router.navigate(['/adm/misalumnos/alumnodetalle/modificardef', item])
            else this.presentToast('Las rutinas por defecto no se pueden modifican en esta vista')
          }
        },
        {
          text: 'Desactivar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.rutina.deshabilitarUsu_rut(this.datos.idusuarios,item.idrutinas)
            .then(res=>{
              this.rutinas.slice(i,1)
              console.log(res);
              
            })
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });

    await actionSheet.present();
  }
  async presentToast(txt) {
    const toast = await this.toastCtrl.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }
  verEjercicio(item){
    this.router.navigate(['adm/misalumnos/alumnodetalle/detalleejer',item])
  }
  sendMSM(){
    this.cursoservice.guardarchat(this.datos.idusuarios,this.datos.id_curso,{
      text:this.mensage,
      id:this.id,
      fecha:new Date(),
      rol:'instructor'

    })
    this.mensage=''
  }
}
