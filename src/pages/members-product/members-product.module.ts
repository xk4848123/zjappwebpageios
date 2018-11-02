import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MembersProductPage } from './members-product';

@NgModule({
  declarations: [
    MembersProductPage,
  ],
  imports: [
    IonicPageModule.forChild(MembersProductPage),
  ],
})
export class MembersProductPageModule {}
