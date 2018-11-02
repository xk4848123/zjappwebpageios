import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KeyProductListPage } from './key-product-list';

@NgModule({
  declarations: [
    KeyProductListPage,
  ],
  imports: [
    IonicPageModule.forChild(KeyProductListPage),
  ],
})
export class KeyProductListPageModule {}
