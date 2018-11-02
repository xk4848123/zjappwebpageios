import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificationPage } from './certification';

@NgModule({
  declarations: [
    CertificationPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificationPage),
  ],
})
export class CertificationPageModule {}
