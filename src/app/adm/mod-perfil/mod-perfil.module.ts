import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModPerfilPage } from './mod-perfil.page';
import { FormBuilder} from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: ModPerfilPage
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
  providers:[
    FormBuilder,
    Geolocation
  ],
  declarations: [ModPerfilPage]
})
export class ModPerfilPageModule {}
