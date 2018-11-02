import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the AddaliacountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addaliacount',
  templateUrl: 'addaliacount.html',
})
export class AddaliacountPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private rlogin: RloginprocessProvider) {
    console.log('构造addaliacount');
  }
  public aliname: string;
  public aliacount: string;
  confirm() {
    if(!this.aliname){
      this.noticeSer.showToast('姓名不可为空');
      return;
    }
    if(!this.aliacount){
      this.noticeSer.showToast('账号不可为空');
      return;
    }
    let token = this.storage.get('token');
    let apiUrl = 'v1/AccountManager/AccountManager/AddAliAccount/' + token;
    this.httpService.doFormPost(
      apiUrl, 
      {
        name: this.aliname,
        account: this.aliacount
      },
      (res) => {
        if (res.error_code == 0) {
          this.noticeSer.showToast('添加成功');
          this.navCtrl.pop();
        } else if (res.error_code == 3) {
          //抢登处理
          this.rlogin.rLoginProcess(this.navCtrl);
        } else {
          this.noticeSer.showToast('服务异常');
        }
      });
  }
}
