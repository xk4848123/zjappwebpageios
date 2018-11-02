import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';


/**
 * Generated class for the WithdrawaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdrawaccount',
  templateUrl: 'withdrawaccount.html',
})
export class WithdrawaccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private config: ConfigProvider,private rlogin:RloginprocessProvider,private alertCtrl:AlertController) {
    this.callback = this.navParams.get('callback');
  }

  public aliacounts=[];
  public bankacounts=[];
  public callback:any;


  ionViewWillEnter() {
    //进页面的时候加载已有的支付宝和银行卡
    let token = this.storage.get('token');
    let apiUrl = 'v1/AccountManager/AccountManager/GetAllAccount/' + token;
    this.httpService.requestData(apiUrl,(res)=>{
      if (res.error_code == 0) {
      this.aliacounts=res.data.aliAccount;
      this.bankacounts=res.data.bankAccount;
      for (let index = 0; index < this.bankacounts.length; index++) {
        this.bankacounts[index].account=this.hidebankAccount(this.bankacounts[index].account);
      }
      }else if (res.error_code == 3) {
        //抢登处理
        this.rlogin.rLoginProcess(this.navCtrl);
      } else {
        this.noticeSer.showToast('服务异常');
      }
    });

  }

  addaliacount(){
    this.navCtrl.push('AddaliacountPage');
  }

  addbankacount(){
    this.navCtrl.push('AddbankacountPage');
  }

  carryAli(key){
    this.callback({type: 1,data: this.aliacounts[key]}).then(()=>{ this.navCtrl.pop() });
  }

  carryBank(key){
    this.callback({type: 3,data: this.bankacounts[key]}).then(()=>{ this.navCtrl.pop() });
  }

  deleteAliAcount(key){
    let confirm = this.alertCtrl.create({
      title: '提示信息?',
      message: '您确定要删除吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
          
          }
        },
        {
          text: '确定',
          handler: () => {
            let token = this.storage.get('token');
            let apiUrl = 'v1/AccountManager/AccountManager/DeleteAliAccount/' + token;
           
            this.httpService.doFormPost(apiUrl,{id: this.aliacounts[key].id},(res)=>{
              if (res.error_code == 0) {
              //数组中数据清理
              this.aliacounts.splice(key,1);
              }else if (res.error_code == 3) {
                //抢登处理
                this.rlogin.rLoginProcess(this.navCtrl);
              } else {
                this.noticeSer.showToast('服务异常');
              }
            });

          }
        }
      ]
    });
    confirm.present();
  }

  deleteBankAcount(key){
    let confirm = this.alertCtrl.create({
      title: '提示信息?',
      message: '您确定要删除吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
          
          }
        },
        {
          text: '确定',
          handler: () => {
            let token = this.storage.get('token');
            let apiUrl = 'v1/AccountManager/AccountManager/DeleteBankAccount/' + token;
           
            this.httpService.doFormPost(apiUrl,{id: this.bankacounts[key].id},(res)=>{
              if (res.error_code == 0) {
              //数组中数据清理
              this.bankacounts.splice(key,1);
              }else if (res.error_code == 3) {
                //抢登处理
                this.rlogin.rLoginProcess(this.navCtrl);
              } else {
                this.noticeSer.showToast('服务异常');
              }
            });

          }
        }
      ]
    });
    confirm.present();
  }


  hidebankAccount(bankAccount):string{
    let mtel = bankAccount.substr(0, 4) + '****' + bankAccount.substr( bankAccount.length-4);
    return mtel;
 }
}
