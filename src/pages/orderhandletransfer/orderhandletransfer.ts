import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';

/**
 * Generated class for the OrderhandletransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderhandletransfer',
  templateUrl: 'orderhandletransfer.html',
})
export class OrderhandletransferPage {

  @ViewChild(Navbar) navBar: Navbar;

  private pageStackLength: number;
  private type: string;
  private title: string;
  private content: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageStackLength = this.navCtrl.length();
    if(this.navParams.get('type')){
      this.type = this.navParams.get('type');
    }else{
      this.type = '1';
    }
    
  }


  ionViewDidLoad() {
    if (this.navParams.get('behindHandle')) {
      this.navBar.backButtonClick = () => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.pageStackLength - 2));
      }
    }
    if (this.type == '1') {
      //取消订单
      this.title = '取消成功';
      this.content = '订单取消成功啦！';
    } else if (this.type == '2') {
      //确认收货
      this.title = '确认成功';
      this.content = '订单已经确认收货啦！';
    }
    else if (this.type == '3') {
      //申请退款
      this.title = '申请成功';
      this.content = '订单已经成功申请退款啦！平台会在48小时内作出处理。';
    }else if (this.type == '4') {
      //申请退货
      this.title = '申请成功';
      this.content = '订单已经成功申请退货啦！平台会在48小时内作出处理。';
    }else {
      //评价成功
      this.title = '评价成功';
      this.content = '祝您购物愉快。';
    }
  }

  myOrder(){
    this.navCtrl.push('OrdersPage');
  }
}
