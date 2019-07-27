import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MiscursosPage } from './miscursos.page';
import { DirectiveModule } from 'src/app/directives/directive.module';

const routes: Routes = [
  {
    path: '',
    component: MiscursosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectiveModule
  ],
  declarations: [MiscursosPage]
})
export class MiscursosPageModule {}
