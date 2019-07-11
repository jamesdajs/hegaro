import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment, IonSlides, ToastController, ModalController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RutinaProvider } from 'src/app/services/rutina/rutina';
import { ModalrutdefPage } from '../modalrutdef/modalrutdef.page';

@Component({
  selector: 'app-alumnosdetalle',
  templateUrl: './alumnosdetalle.page.html',
  styleUrls: ['./alumnosdetalle.page.scss'],
})
export class AlumnosdetallePage implements OnInit {

  @ViewChild('mySlider') slider: IonSlides;
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
    {
      id: "third",
      title: "Third Slide"
    }
  ];
  datos
  constructor(public toastCtrl: ToastController,
    private router: Router,
    private rutina: RutinaProvider,
    public modalController: ModalController,
    private actionSheetController: ActionSheetController
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

  ngOnInit() {
    this.cargarRutinas()
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
      token:this.datos.token,
      curso:this.datos.titulo,
      id_curso:this.datos.id_curso
    }])
  }

  cargarRutinas() {
    this.rutina.listarRutinas_cli(this.datos.idusuarios, true)
      .then(array => {
        for (let i in array) {
          array[i]['estadohidden'] = false
          array[i]['ejercicios'] = []
        }

        console.log(array);
        this.rutinas = array
      })
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalrutdefPage,
      componentProps: this.datos
    });

    await modal.present();

  }
  async presentsheetRutina(item) {
    let textver = item.estadohidden ? 'Ocultar ejercicios' : 'Ver ejercicios'
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Desactivar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Modificar',
        icon: 'paper',
        handler: () => {
          console.log('Share clicked');

          item['idalumno']=this.datos.idusuarios
          if(item.tipo=='p')
          this.router.navigate(['/adm/misalumnos/alumnodetalle/modificardef', item])
          else this.presentToast('Las rutinas por defecto no se pueden modifican en esta vista')

        }
      }, {
        text: textver,
        icon: 'eye',
        handler: () => {
          console.log(item);
          this.menuItemHandler(item)
        }
      }, {
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
}
