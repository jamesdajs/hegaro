import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearcursoPage } from './crearcurso.page';
import { DirectiveModule } from 'src/app/directives/directive.module';

const routes: Routes = [
  {
    path: '',
    component: CrearcursoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DirectiveModule
  ],
  declarations: [CrearcursoPage]
})
export class CrearcursoPageModule {}
