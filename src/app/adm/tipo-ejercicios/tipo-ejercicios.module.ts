import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TipoEjerciciosPage } from './tipo-ejercicios.page';

const routes: Routes = [
  {
    path: '',
    component: TipoEjerciciosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TipoEjerciciosPage]
})
export class TipoEjerciciosPageModule {}
