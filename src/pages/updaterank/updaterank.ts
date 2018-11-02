import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { WeblinkProvider } from '../../providers/weblink/weblink';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { VerifypasswordProvider } from '../../providers/verifypassword/verifypassword';
import { AlertProvider } from '../../providers/alert/alert';
/**
 * Generated class for the UpdaterankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updaterank',
  templateUrl: 'updaterank.html',
})
export class UpdaterankPage {

  private greenInfoType: number = 1;

  private vipInfo: number = 1;

  private avaliableLev: String = '';

  private remainElec: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider, private noticeSer: ToastProvider,
    private httpService: HttpServicesProvider, private rlogin: RloginprocessProvider, private verify: VerifypasswordProvider, private alert: AlertProvider
  ,private webLink:WeblinkProvider) {
  }

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
          this.remainElec = tempData['personDataMap'].RemainElecNum;
          //等级设置
          //如果lev为0
          if (tempData['personDataMap'].Lev == 0) {
            if (tempData['isGCmember']) {
              //99会员
              this.greenInfoType = 1;
              this.vipInfo = 0;
            } else {
              //免费会员
              this.greenInfoType = 0;
              this.vipInfo = 0;
            }
            this.avaliableLev = 'VIP';
          } else if (tempData['personDataMap'].Lev == 1) {
            this.greenInfoType = 1;
            this.vipInfo = 1;
            this.avaliableLev = '准代理';
          } else if (tempData['personDataMap'].Lev == 2) {
            if (tempData['personDataMap'].IsSubProxy == 1) {

              //准代理
              this.greenInfoType = 1;
              this.vipInfo = 1;
              this.avaliableLev = '代理';
            } else {
              //合伙人
              this.greenInfoType = 1;
              this.vipInfo = 1;
              this.avaliableLev = '准代理';
            }

          }
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('数据获取异常：' + data.error_message);
        }
      });
    }
  }

  elecHandle(orderNo) {
    this.verify.execute(this.navCtrl, () => {
      let token = this.storage.get('token');
      let apiUrl = 'v1/MemberShip/syncHandleVipOrder/' + token;
      this.httpService.doFormPost(apiUrl, { orderNo: orderNo }, (data) => {
        if (data.error_code == 0) {//请求成功
          //现金币处理成功
          this.noticeSer.showToast('充值成功！')
          this.initData();
        } else if (data.error_code == 3) {
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        } else {
          this.noticeSer.showToast(data.error_message);
        }
      });
    });
  }

  createOrder(type, lev) {
    let token = this.storage.get('token');
    let apiUrl = 'v2/MemberShip/createVOrder/' + token;
    this.httpService.doFormPost(apiUrl,
      { type: type, lev: lev },
      (data) => {
        if (data.error_code == 0) {//请求成功
          if (type == 0) {
            this.elecHandle(data.data);
          } else {
            let tempData = data.data;
              this.webLink.wxGoWebPay(this.navCtrl,tempData.orderNo,tempData.realpay,tempData.orderType);
          }
        } else if (data.error_code == 3) {
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        } else {
          this.noticeSer.showToast(data.error_message);
        }
      });
  }

  updateGreen() {
    if (this.greenInfoType == 0) {
      if (this.remainElec >= 99) {
        this.alert.showAlert('您可以通过现金币充值~', '', [
          {
            text: '同意',
            handler: () => {
              this.createOrder(0, 0);
            }
          },
          {
            text: '跳过',
            handler: () => {
              this.createOrder(1, 0);
            }
          }
        ]);

      } else {
        this.createOrder(1, 0);
      }
    }
  }

  updateVIP() {
    if (this.vipInfo == 0) {
      if (this.remainElec >= 3000) {
        this.alert.showAlert('您可以通过现金币充值~', '', [
          {
            text: '同意',
            handler: () => {
              this.createOrder(0, 1);
            }
          },
          {
            text: '跳过',
            handler: () => {
              this.createOrder(1, 1);
            }
          }
        ]);

      } else {
        this.createOrder(1, 1);
      }
    }
  }

  directUpdate(){
    let type = 0;
    if(this.avaliableLev == 'VIP'){
      type = 1;
    }
    if(this.avaliableLev == '准代理'){
      type = 2;
    }
    if(this.avaliableLev == '代理'){
      type = 3;
    }
    if(type != 0){

      let token = this.storage.get('token');
      let apiUrl = 'v1/MemberShip/directUpdate/' + token;
      this.httpService.doFormPost(apiUrl,
        { type: type},
        (data) => {
          if (data.error_code == 0) {//请求成功
            this.noticeSer.showToast('升级成功啦，您现在是'+ this.avaliableLev + '了');
            this.initData();
          } else if (data.error_code == 3) {
            this.rlogin.rLoginProcessWithHistory(this.navCtrl);
          } else {
            this.noticeSer.showToast(data.error_message);
          }
        });

    }
  
  }
  
}
