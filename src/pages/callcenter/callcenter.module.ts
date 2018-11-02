import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallcenterPage } from './callcenter';

@NgModule({
  declarations: [
    CallcenterPage,
  ],
  imports: [
    IonicPageModule.forChild(CallcenterPage),
  ],
})
export class CallcenterPageModule {}
