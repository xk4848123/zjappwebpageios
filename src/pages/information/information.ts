import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  public messages = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private config: ConfigProvider, public storage: StorageProvider, public httpService: HttpServicesProvider, public toast: ToastProvider) {
  }

  ionViewWillEnter() {
    let token = this.storage.get('token');
    if (token) {
      //api请求
      let api = 'v1/PersonalCenter/getLogisticsInformation/' + token;
      this.httpService.doFormPost(api, { orderNo: this.navParams.get('orderNo') }, (data) => {
        if (data.error_code == 0) {
          this.messages = data.data;
        }
        else {
          this.toast.showToast('数据获取异常');
        }
      });
    }
  }
}
