import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the SetattrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setattr',
  templateUrl: 'setattr.html',
})
export class SetattrPage {

  nickName: string;
  inviteCode: number;


  title: string;
  type: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, private noticeSer: ToastProvider,
    public httpService: HttpServicesProvider, private rlogin: RloginprocessProvider) {
    this.type = this.navParams.get('type');
    if (this.type == 1) {
      this.title = '更改昵称';
    } else {
      this.title = '设置推荐人';
    }

  }

  ionViewWillEnter() {
    if (this.type != 2) {
      this.initData();
    }
  }

  initData() {
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/GetPersonalInfo/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          this.nickName = tempData['personDataMap'].NickName;
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('数据获取异常：' + data.error_message);
        }
      });
    }
  }

  confirm() {
    let token = this.storage.get('token');
    if (token) {
      let api = '';
      let tempData = null;
      if (this.type == 1) {
         api = 'v1/PersonalCenter/updateNickName/' + token
         tempData = { nickName: this.nickName };
      } else {
         api = 'v1/PersonalCenter/updateInviteCode/' + token
         tempData = { inviteCode: this.inviteCode };
      }
      console.log(api);
      console.log(tempData);
      this.httpService.doFormPost(api, tempData, (data) => {
        if (data.error_code == 0) {//请求成功
          this.noticeSer.showToast('设置成功');
          this.navCtrl.pop();
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast( data.error_message);
        }
      });
    }
  }
}
