import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { StorageProvider } from '../../providers/storage/storage';
import { AlertProvider } from '../../providers/alert/alert';
import { ToastProvider } from '../../providers/toast/toast';
/*
  Generated class for the VerifypasswordProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VerifypasswordProvider {

  constructor(private storage: StorageProvider, private httpService: HttpServicesProvider,
    private rlogin:RloginprocessProvider,private alert: AlertProvider,private noticeSer:ToastProvider) {
  }

  private verifyPayPassword(payPassword,navCtrl: NavController,callback) {
    let token = this.storage.get('token');
    let api = 'v1/PersonalCenter/verifyPayPassword';
    this.httpService.doFormPost(
      api
      , {
        toKen: token,
        payPassword: payPassword,
      },
      (res) => {
        if (res.error_code == 0) {//请求成功
          callback();
        } else if (res.error_code == 3) {//token过期
          this.rlogin.rLoginProcess(navCtrl);
        } else if (res.error_code == -1) {//设置支付密码
          this.noticeSer.showToast('您还未设置支付密码');
          navCtrl.push('SetpaypasswordPage');
        } else if (res.error_code == 5) {
          this.noticeSer.showToast('您的现金币被冻结，请和工作人员联系');
        }
        else {
          this.noticeSer.showToast('服务异常：' + res.error_message);
        }
      });

  }

  execute(navCtrl: NavController,callback) {
    //密码验证
    this.alert.showPrompt('验证支付密码',
      [
        {
          text: '取消',
          handler: data => {

          }
        },
        {
          text: '确定',
          handler: data => {
            this.verifyPayPassword(data[0],navCtrl,callback);
          }
        }
      ]
    );

  }
}
