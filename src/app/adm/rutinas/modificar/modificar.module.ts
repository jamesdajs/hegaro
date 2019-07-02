import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModificarPage } from './modificar.page';
import { ModaladdejerPage } from '../modaladdejer/modaladdejer.page';
import { ModaladdejerPageModule } from '../modaladdejer/modaladdejer.module';

const routes: Routes = [
  {
    path: '',
    component: ModificarPage
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
  declarations: [ModificarPage]
})
export class ModificarPageModule {}
