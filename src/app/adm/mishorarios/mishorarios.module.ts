import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MishorariosPage } from './mishorarios.page';

const routes: Routes = [
  {
    path: '',
    component: MishorariosPage
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
  declarations: [MishorariosPage],
  providers:[
    FormBuilder
  ],
})
export class MishorariosPageModule {}
