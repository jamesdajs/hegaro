import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CursoalumnosPage } from './cursoalumnos.page';

const routes: Routes = [
  {
    path: '',
    component: CursoalumnosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CursoalumnosPage]
})
export class CursoalumnosPageModule {}
