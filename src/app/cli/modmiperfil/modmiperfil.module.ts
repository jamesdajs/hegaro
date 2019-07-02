import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModmiperfilPage } from './modmiperfil.page';

const routes: Routes = [
  {
    path: '',
    component: ModmiperfilPage
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
  declarations: [ModmiperfilPage]
})
export class ModmiperfilPageModule {}
