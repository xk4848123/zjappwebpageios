import { Injectable } from '@angular/core';

import { LoadingController,NavController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
declare let cordova;
/*
  Generated class for the WeblinkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeblinkProvider {

  constructor(public loadingCtrl: LoadingController,
    private storage: StorageProvider, private config: ConfigProvider) {
    console.log('Hello WeblinkProvider Provider');
  }

  loading: any;

  goWeb(webUrl) {
  let ref = cordova.InAppBrowser.open(encodeURI(webUrl), '_blank', 'location=yes,closebuttoncaption=关闭,hideurlbar=yes');
  }

  wxGoWebPay(navCtrl:NavController, orderNo, realpay, orderType) {
     navCtrl.push("PaymentPage",{
      orderNo: orderNo,
      realpay: realpay,
      orderType: orderType
     });
  }

  show() {
    this.loading = this.loadingCtrl.create({
      content: '跳转支付中...'
    });
    this.loading.present();
    setTimeout(() => {
      this.hide();
    }, 3000);
  }
  // 隐藏loading
  hide() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

}