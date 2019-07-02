import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlumnosdetallePage } from './alumnosdetalle.page';
import { ModalrutdefPage } from '../modalrutdef/modalrutdef.page';
import { ModalrutdefPageModule } from '../modalrutdef/modalrutdef.module';

const routes: Routes = [
  {
    path: '',
    component: AlumnosdetallePage
  }
];

@NgModule({
  entryComponents:[
    ModalrutdefPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalrutdefPageModule
  ],
  declarations: [AlumnosdetallePage]
})
export class AlumnosdetallePageModule {}
