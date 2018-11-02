import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MywalletPage } from './mywallet';

@NgModule({
  declarations: [
    MywalletPage,
  ],
  imports: [
    IonicPageModule.forChild(MywalletPage),
  ],
})
export class MywalletPageModule {}
