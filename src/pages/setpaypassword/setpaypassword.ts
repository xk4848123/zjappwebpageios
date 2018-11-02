import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ToastProvider } from '../../providers/toast/toast';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the SetpaypasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setpaypassword',
  templateUrl: 'setpaypassword.html',
})
export class SetpaypasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private rlogin: RloginprocessProvider, private noticeSer: ToastProvider, private el: ElementRef,
    private renderer2: Renderer2, private alert: AlertProvider) {

  }

  public phoneNum: number;

  private spareTime: number = 60;

  private interval: any = null;

  private verifycode: number;

  ionViewDidLoad() {
    let token = this.storage.get('token');
    let api = 'v1/PersonalCenter/initPersonalCenterData/' + token;
    this.httpService.requestData(api, (res) => {
      if (res.error_code == 0) {//请求成功
        this.phoneNum = res.data['personDataMap'].UserName;
        // this.phoneNum = 18055126049;
      } else if (res.error_code == 3) {//token过期
        this.rlogin.rLoginProcess(this.navCtrl);
      }
      else {
        this.noticeSer.showToast('数据获取异常：' + res.error_message);
      }
    });
  }

  getVerifyCode() {
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
        this.noticeSer.showToast('服务异常：' + res.error_message);
      }
    });
  }
  next() {
    let apiUrl = 'v1/LoginAndRegister/verify'
    let token = this.storage.get('token');
    if (this.verifycode && this.verifycode.toString().length == 4) {
      this.httpService.doPost(apiUrl, { token: token, verifyCode: this.verifycode }, (res) => {
        if (res.error_code == 0) {//请求成功
          this.alert.showPrompt('设置支付密码',
            [
              {
                text: '取消',
                handler: data => {

                }
              },
              {
                text: '确定',
                handler: data => {
                  apiUrl = 'v1/LoginAndRegister/verify/' + res.data;
                  this.httpService.doPost(apiUrl, { token: token, paypassword: data[0] }, (result) => {
                    console.log(result);
                    if (result.error_code == 0) {//请求成功
                      this.noticeSer.showToast('支付密码设置成功');
                      this.navCtrl.pop();
                    } else if (result.error_code == 3) {//token过期
                      this.rlogin.rLoginProcess(this.navCtrl);
                    }
                    else {
                      this.noticeSer.showToast('服务异常：' + result.error_message);
                    }
                  });
                }
              }
            ]
          );
        } else if (res.error_code == 3) {//token过期
          this.rlogin.rLoginProcess(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('服务异常：' + res.error_message);
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
