import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VercursoPage } from './vercurso.page';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


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
    RouterModule.forChild(routes),
    DirectiveModule,
  ],
  providers:[
    FormBuilder,

    InAppBrowser
  ],
  declarations: [VercursoPage]
})
export class VercursoPageModule {}
