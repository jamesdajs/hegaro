import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VercursoPage } from './vercurso.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';



const routes: Routes = [
  {
    path: '',
    component: VercursoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    FormBuilder,
    Geolocation
  ],
  declarations: [VercursoPage]
})
export class VercursoPageModule {}
