import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearPage } from './crear.page';
import { ModaladdejerPage } from '../modaladdejer/modaladdejer.page';
import { ModaladdejerPageModule } from '../modaladdejer/modaladdejer.module';

const routes: Routes = [
  {
    path: '',
    component: CrearPage
  }
];

@NgModule({
  entryComponents:[
    ModaladdejerPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModaladdejerPageModule
  ],
  declarations: [CrearPage]
})
export class CrearPageModule {}
