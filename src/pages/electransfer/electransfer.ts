import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { AlertProvider } from '../../providers/alert/alert';
import { VerifypasswordProvider } from '../../providers/verifypassword/verifypassword';
/**
 * Generated class for the ElectransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-electransfer',
  templateUrl: 'electransfer.html',
})
export class ElectransferPage {

  private sysID;
  private transferElec;
  private remainElec;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider,
    private noticeSer: ToastProvider, private httpService: HttpServicesProvider, private rlogin: RloginprocessProvider,
    private alert: AlertProvider,private verify:VerifypasswordProvider) {
  }

  ionViewDidLoad() {
    this.getRemianElec();
  }
  getRemianElec() {
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/GetPersonalInfo/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          this.remainElec = tempData['personDataMap'].RemainElecNum;
          console.log(this.remainElec);
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('数据获取异常：' + data.error_message);
        }
      });
    }
  }
  transfer() {
  
    if (!this.sysID) {
      this.noticeSer.showToast('请输入众健号');
      return;
    }
    if (!this.transferElec) {
      this.noticeSer.showToast('请输入转让金额');
      return;
    }
    let token = this.storage.get('token');
    let api = 'v1/MemberShip/TransferOfMoney/' + token;

    this.httpService.doFormPost(
      api
      , {
        money: this.transferElec,
        sysID: this.sysID
      },
      (res) => {
        if (res.error_code == 0) {
          this.noticeSer.showToast('已转让给众健号为' + this.sysID + '的用户'  + this.remainElec + '现金币');
          this.sysID = null;
          this.transferElec = null;
        } else if (res.error_code == 3) {
          //抢登处理
          this.rlogin.rLoginProcess(this.navCtrl);
        } else if (res.error_code == 1) {
          //跳转至实名认证页面
          this.noticeSer.showToast('您还未进行实名认证');

        } else {
          this.noticeSer.showToast(res.error_message);
        }
      });
  }

  // verifyPayPassword(payPassword) {
  //   let token = this.storage.get('token');
  //   let api = 'v1/PersonalCenter/verifyPayPassword';
  //   this.httpService.doFormPost(
  //     api
  //     , {
  //       toKen: token,
  //       payPassword: payPassword,
  //     },
  //     (res) => {
  //       if (res.error_code == 0) {//请求成功
  //         // this.tx();
  //       } else if (res.error_code == 3) {//token过期
  //         this.rlogin.rLoginProcess(this.navCtrl);
  //       } else if (res.error_code == -1) {//设置支付密码
  //         this.noticeSer.showToast('您还未设置支付密码');
  //         this.navCtrl.push('SetpaypasswordPage');
  //       } else if (res.error_code == 5) {
  //         this.noticeSer.showToast('您的现金币被冻结，请和工作人员联系');
  //       }
  //       else {
  //         this.noticeSer.showToast('服务异常：' + res.error_message);
  //       }
  //     });

  // }




  execute() {
    // //密码验证
    // this.alert.showPrompt('验证支付密码',
    //   [
    //     {
    //       text: '取消',
    //       handler: data => {

    //       }
    //     },
    //     {
    //       text: '确定',
    //       handler: data => {
    //         this.verifyPayPassword(data[0]);
    //       }
    //     }
    //   ]
    // );
    this.verify.execute(this.navCtrl,()=>{
      this.transfer();
    });
  }
}
