import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ConfigProvider } from '../../providers/config/config';
import { AlertProvider } from '../../providers/alert/alert';
/**
 * Generated class for the WithdrawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider,private rlogin:RloginprocessProvider,private config:ConfigProvider,private alert:AlertProvider) {
    console.log('构造WithdrawPage');
  }

 
  public txmoney:number;
  public maxtxmoney:number;
  public obj:object;

  getData = (res) =>
  {
    return new Promise((resolve, reject) => {
      this.obj = res; 
      resolve();
    });
  };

  chooseAcount(){

    this.navCtrl.push('WithdrawaccountPage',{callback: this.getData});

  }
  ionViewWillEnter() {
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/initPersonalCenterData/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
         this.maxtxmoney =Math.floor(tempData['personDataMap'].RemainElecNum/1.03);
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('服务异常：' + data.error_message);
        }
      });
    }
  
  }
 
  tx(){
   
    if(!this.obj){
      this.noticeSer.showToast('请选择提现账号');
      return;
    }
    if(!this.txmoney){
      this.noticeSer.showToast('请输入提现金额');
      return;
    }
    let token = this.storage.get('token');
    let api = 'v1/PersonalCenter/TxElecNum/' + token;
      this.httpService.doFormPost(
        api
        ,{
        money: this.txmoney,
        txType: this.obj['type'],
        cardNo: this.obj['data'].account,
        trueName: this.obj['data'].name,
        },
       (res)=>{
         if (res.error_code == 0) {
          this.noticeSer.showToast('提交成功，等待工作人员处理');
          //跳转至现金币记录页面
          this.navCtrl.pop();
         } else if (res.error_code == 3) {
           //抢登处理
           this.rlogin.rLoginProcess(this.navCtrl);
         } else if (res.error_code == 1) {
          //跳转至实名认证页面
          this.noticeSer.showToast('您还未进行实名认证');

        }else {
           this.noticeSer.showToast(res.error_message);
         }
       });
  }

  verifyPayPassword(payPassword){
    let token = this.storage.get('token');
    let api = 'v1/PersonalCenter/verifyPayPassword';
    this.httpService.doFormPost(
      api
      ,{
      toKen: token,
      payPassword: payPassword,
      },
     (res)=>{
      if (res.error_code == 0) {//请求成功
        this.tx();
      } else if (res.error_code == 3) {//token过期
        this.rlogin.rLoginProcess(this.navCtrl);
      } else if (res.error_code == -1) {//设置支付密码
        this.noticeSer.showToast('您还未设置支付密码');
        this.navCtrl.push('SetpaypasswordPage');
      } else if(res.error_code == 5){
        this.noticeSer.showToast('您的现金币被冻结，请和工作人员联系');
      }
      else {
        this.noticeSer.showToast('服务异常：' + res.error_message);
      }
    });

}




execute(){
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
         this.verifyPayPassword(data[0]);
        }
      }
    ]
  );

}
}
