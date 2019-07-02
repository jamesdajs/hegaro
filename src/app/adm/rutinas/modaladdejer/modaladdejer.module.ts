import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaladdejerPage } from './modaladdejer.page';
import { ModalasetsPageModule } from '../modalasets/modalasets.module';
import { ModalasetsPage } from '../modalasets/modalasets.page';



@NgModule({
  entryComponents: [
    ModalasetsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalasetsPageModule
  ],
  declarations: [ModaladdejerPage]
})
export class ModaladdejerPageModule { }
