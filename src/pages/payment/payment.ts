import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess'
declare let cordova;
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  private realpay;

  private orderNo;

  private orderType;

  public aliSignature = '';

  public way = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider, private storage: StorageProvider, private noticeSer: ToastProvider, private rloginprocess: RloginprocessProvider) {
    this.realpay = this.navParams.get('realpay');
    this.orderNo = this.navParams.get('orderNo');
    this.orderType = this.navParams.get('orderType');
  }


  ionViewWillEnter() {
    this.aliSignature = '';
  }

  unescapeHTML(a) {
    let aNew = "" + a;
    return aNew.replace(/</g, "<").replace(/>/g, ">").replace(/&/g, "&").replace(/"/g, '"').replace(/'/g, "'");
  }


  wxpay() {
    this.noticeSer.showToast('该方式正在开通中');
  }

  alipay() {
    if (this.aliSignature == '') {
      this.httpService.doPost('/ali/createaliparam/', { total_fee: this.realpay,out_trade_no: this.orderNo,type:this.orderType}, (data) => {
        if (data.error_code == 0) {
          this.aliSignature = data.data;//保存签名页面至页面退出
          let payInfo = this.unescapeHTML(data.data);
          cordova.plugins.alipay.payment(payInfo, (success) => {
            if (success.resultStatus === "9000") {
              this.noticeSer.showToast('支付成功');
              this.navCtrl.push("PaysuccessPage",{
                orderType: this.orderType
              });
            } else {
              this.noticeSer.showToast('支付失败');
            }
          }, (error) => {
            //支付失败
            this.noticeSer.showToast('支付失败');
          });
        } else if (data.error_code == 3) {
          this.rloginprocess.rLoginProcess(this.navCtrl);
        } else {
          this.noticeSer.showToast(data.error_message);

        }
      });
    } else {
      let payInfo = this.unescapeHTML(this.aliSignature);
      cordova.plugins.alipay.payment(payInfo, (success) => {
        if (success.resultStatus === "9000") {
          this.noticeSer.showToast('支付成功');
          this.navCtrl.push("PaysuccessPage",{
            orderType: this.orderType
          });
        } else {
          this.noticeSer.showToast('支付失败');
        }
      }, (error) => {
        //支付失败

      });
    }
  }

  pay() {

    if (this.way == 1) {
      this.wxpay();
    } else if (this.way == 2) {
      this.alipay();
    }
  }
}