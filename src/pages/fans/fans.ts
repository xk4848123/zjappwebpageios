import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';

import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the FansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fans',
  templateUrl: 'fans.html',
})
export class FansPage {


  public fansmessage = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public httpService: HttpServicesProvider, public noticeSer: ToastProvider
    , private rclogin: RloginprocessProvider) {
  }
  goToDetail(type:string) {
    this.navCtrl.push('FandetailPage',{type:type})
  }

  ionViewDidLoad() {
    let token = this.storage.get('token');
    if (token) {
      //api请求
      let api = 'v1/MemberShip/GetFans/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {
          //请求成功
          this.fansmessage = data.data;
        } else if (data.error_code == 3) {
          this.rclogin.rLoginProcessWithHistory(this.navCtrl);
        } else {
          this.noticeSer.showToast('数据君出问题了！');
        }
      });
    }
  }

}
