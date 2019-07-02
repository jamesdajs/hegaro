import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearTipoejercicioPage } from './crear-tipoejercicio.page';

const routes: Routes = [
  {
    path: '',
    component: CrearTipoejercicioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [CrearTipoejercicioPage]
})
export class CrearTipoejercicioPageModule {}
