import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../../providers/config/config';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';

/**
 * Generated class for the SalereturnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-salereturn',
  templateUrl: 'salereturn.html',
})
export class SalereturnPage {
  public  getSelectedText='';
  orderNo:string;
  temp:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private config: ConfigProvider,
    public storage: StorageProvider, public httpService: HttpServicesProvider, public toast: ToastProvider,private rclogin: RloginprocessProvider) {
    this.orderNo = this.navParams.get('orderNo');
    this.temp = this.navParams.get('item');
  }
  confirm(){
    let token = this.storage.get('token');
    if (token) {
      //api请求
      let api = 'v1/PersonalCenter/ApplySaleReturn/' +token;
       this.httpService.doFormPost(api,{orderNo:this.orderNo,memo: this.getSelectedText} ,(data) => {
          if (data.error_code == 0) {
            //申请退货后处理
            this.navCtrl.push('OrderhandletransferPage',{type: '4',behindHandle:'behindHandle'});
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
