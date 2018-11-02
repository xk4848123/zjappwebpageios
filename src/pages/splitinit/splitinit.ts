import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the SplitinitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splitinit',
  templateUrl: 'splitinit.html',
})
export class SplitinitPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider, private noticeSer: ToastProvider,
    private httpService: HttpServicesProvider, private rlogin: RloginprocessProvider, private alert: ActionSheetController) {
  }

  data: number;

  ionViewWillEnter() {
    this.initData();
  }
  initData() {
    //请求数据
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/initPersonalWallet/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          this.data = tempData['personDataMap'].RemainStream;
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('数据获取异常：' + data.error_message);
        }
      });
    }
  }

  splitRecord() {
    this.navCtrl.push('SplitrecordPage');
  }

  spliting(type) {
    let num = 0;
    if (type == 1) {
      num = 3000;
    } else {
      num = 50000;
    }
    if (num > this.data) {
      this.noticeSer.showToast('分流币不足');
    }
    this.navCtrl.push('SplitimmediatelyPage', { type: type });
  }

  choose() {
    let actionSheet = this.alert.create({
      title: '选择额度',
      cssClass: 'global-action-sheet',
      buttons: [
        {
          text: '3000',
          role: 'destructive',
          cssClass: 'global-zm-action-button',
          handler: () => {
            this.spliting(1);

          }
        }, {
          text: '50000',
          role: 'destructive',
          cssClass: 'global-zm-action-button',
          handler: () => {
            this.spliting(2);
          }
        }, {
          text: '取消',
          role: 'cancel',
          cssClass: 'global-zm-action-button',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
}
