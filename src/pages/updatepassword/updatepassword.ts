import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the UpdatepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatepassword',
  templateUrl: 'updatepassword.html',
})
export class UpdatepasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private rlogin: RloginprocessProvider) {
  }


  public newpassword: string;

  public newpasswordagain: string;

  confirm() {

    if (!this.newpassword) {
      this.noticeSer.showToast('新密码不能为空');
      return;
    }
    if (!this.newpasswordagain) {
      this.noticeSer.showToast('请确认新密码');
      return;
    }

    let token = this.storage.get('token');
    let api = 'v2/LoginAndRegister/modifyPassword';
    this.httpService.doPost(
      api,
      {
        token: token,
        newPassword: this.newpassword,
        newPasswordAgain: this.newpasswordagain
      },
      (res) => {
        if (res.error_code == 0) {//请求成功
          this.noticeSer.showToast('修改成功');
          this.navCtrl.pop();
        }
        else if (res.error_code == 3) {//token过期
          this.rlogin.rLoginProcess(this.navCtrl);
        }
        else {
          this.noticeSer.showToast(res.error_message);
        }
      });

  }

}
