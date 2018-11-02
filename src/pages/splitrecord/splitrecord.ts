import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';

/**
 * Generated class for the SplitrecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splitrecord',
  templateUrl: 'splitrecord.html',
})
export class SplitrecordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider, private noticeSer: ToastProvider,
    private httpService: HttpServicesProvider, private rlogin: RloginprocessProvider) {
  }

  datas:any;

  ionViewWillEnter() {
    this.initData();
  }

  initData(){
      //请求数据
     
      let token = this.storage.get('token');
      if (token) {
        let api = 'v1/MemberShip/SplitStreamRecord/' + token;
        this.httpService.requestData(api, (data) => {
          if (data.error_code == 0) {//请求成功
            this.datas = data.data;
          } else if (data.error_code == 3) {//token过期
            this.rlogin.rLoginProcessWithHistory(this.navCtrl);
          }
          else {
            this.noticeSer.showToast('数据获取异常：' + data.error_message);
          }
        });
      }
  }
}
