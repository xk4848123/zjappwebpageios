import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the RefundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-refund',
  templateUrl: 'refund.html',
})
export class RefundPage {
orderNo:string;
temp:any;
public  getSelectedText='';
  constructor(public navCtrl: NavController, public navParams: NavParams,private config: ConfigProvider,public storage: StorageProvider,
     public httpService: HttpServicesProvider, public toast: ToastProvider,private rclogin: RloginprocessProvider) {
      this.orderNo = this.navParams.get('orderNo');
      this.temp = this.navParams.get('item');
  }
  confirm(){
    let token = this.storage.get('token');
    if (token) {
      //api请求
      let api = 'v1/PersonalCenter/ApplyRefund/' + token; 
      this.httpService.doFormPost(api,{orderNo: this.orderNo,memo: this.getSelectedText} ,(data) => {
          if (data.error_code == 0) {           
           //申请退款处理
           this.navCtrl.push('OrderhandletransferPage',{type: '3',behindHandle:'behindHandle'});
         } else if(data.error_code == 3){
           //抢登处理
           this.rclogin.rLoginProcess(this.navCtrl);
         }
         else {
           this.toast.showToast(data.error_message);
         }
      });
    }
      }

}
