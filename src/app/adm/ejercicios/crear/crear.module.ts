import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearPage } from './crear.page';
//imporstpara fotos

const routes: Routes = [
  {
    path: '',
    component: CrearPage
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
  declarations: [CrearPage]
  ,
  providers:[
    FormBuilder,
  ]
})
export class CrearPageModule {}
