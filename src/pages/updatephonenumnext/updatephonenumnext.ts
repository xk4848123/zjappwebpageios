import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ToastProvider } from '../../providers/toast/toast';
import { AlertProvider } from '../../providers/alert/alert';
/**
 * Generated class for the UpdatephonenumnextPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatephonenumnext',
  templateUrl: 'updatephonenumnext.html',
})
export class UpdatephonenumnextPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private rlogin: RloginprocessProvider, private noticeSer: ToastProvider, private el: ElementRef,
    private renderer2: Renderer2, private alert: AlertProvider) {

  }

  public phoneNum: number;

  private spareTime: number = 60;

  private interval: any = null;

  private verifycode: number;

  verifyPhone(phoneNum) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(phoneNum)) {
      return false;
    } else {
      return true;
    }
  }

  getVerifyCode() {
    if (!this.verifyPhone(this.phoneNum)) {
      this.noticeSer.showToast('手机格式不正确');
      return;
    }
    let apiUrl = 'v1/LoginAndRegister/SendRegisterVerifyCode';
    this.httpService.doPost(apiUrl, { phoneNum: this.phoneNum }, (res) => {
      if (res.error_code == 0) {//请求成功
        let button = this.el.nativeElement.querySelector('#button');
        this.renderer2.setStyle(button, 'display', 'none');
        //设置倒计时
        let time = this.el.nativeElement.querySelector('#time');
        this.renderer2.setStyle(time, 'display', 'inline-block');
        this.interval = setInterval(() => {
          this.spareTime--;
          if (this.spareTime == 0) {
            this.renderer2.setStyle(time, 'display', 'none');
            this.renderer2.setStyle(button, 'display', 'inline-block')
            this.spareTime = 60;
            clearInterval(this.interval);
          }
        }, 1000);
      }
      else {
        this.noticeSer.showToast(res.error_message);
      }
    });
  }
  confirm() {
    let apiUrl = 'v1/LoginAndRegister/verifyUpdateUserName/' + this.navParams.get('Certficate');
    let token = this.storage.get('token');
    if (this.phoneNum.toString().length != 11) {
      this.noticeSer.showToast("手机号格式不正确");
      return;
    }
    if (this.verifycode && this.verifycode.toString().length == 4) {
      this.httpService.doFormPost(apiUrl, { token: token, verifyCode: this.verifycode, userName: this.phoneNum }, (res) => {
        if (res.error_code == 0) {//请求成功
          console.log(this.navCtrl.length());
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
        } else if (res.error_code == 3) {//token过期
          this.rlogin.rLoginProcess(this.navCtrl);
        }
        else {
          this.noticeSer.showToast(res.error_message);
        }
      });
    } else {
      this.noticeSer.showToast('请输入正确验证码');
    }

  }
  ionViewWillUnload() {
    //清理定时器，收回资源
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
