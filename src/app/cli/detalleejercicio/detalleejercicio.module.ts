import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleejercicioPage } from './detalleejercicio.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleejercicioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleejercicioPage]
})
export class DetalleejercicioPageModule {}
