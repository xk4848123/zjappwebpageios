import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoneyrecordPage } from './moneyrecord';

@NgModule({
  declarations: [
    MoneyrecordPage,
  ],
  imports: [
    IonicPageModule.forChild(MoneyrecordPage),
  ],
})
export class MoneyrecordPageModule {}
