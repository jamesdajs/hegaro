import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CursosinactivosPage } from './cursosinactivos.page';

const routes: Routes = [
  {
    path: '',
    component: CursosinactivosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CursosinactivosPage]
})
export class CursosinactivosPageModule {}
