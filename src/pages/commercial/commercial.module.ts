import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommercialPage } from './commercial';

@NgModule({
  declarations: [
    CommercialPage,
  ],
  imports: [
    IonicPageModule.forChild(CommercialPage),
  ],
})
export class CommercialPageModule {}
