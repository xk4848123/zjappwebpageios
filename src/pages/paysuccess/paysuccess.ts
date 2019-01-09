import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the PaysuccesspagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paysuccess',
  templateUrl: 'paysuccess.html',
})
export class PaysuccessPage {

  public orderType:string = '2';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(this.navParams.get('orderType')){
      this.orderType = this.navParams.get('orderType');
    }
    
  }

  goToMyWallet(){
    this.navCtrl.push('MywalletPage',{
      withoutRoot: 'withoutRoot'
    });
  }

  goToOrders(){
    this.navCtrl.push('OrdersPage',{
      withoutRoot: 'withoutRoot'
    });
  }

  gotoRoot(){
    this.navCtrl.popToRoot();
  }
}
