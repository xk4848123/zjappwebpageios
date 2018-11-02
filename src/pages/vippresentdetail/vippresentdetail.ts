import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';

/**
 * Generated class for the VippresentdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vippresentdetail',
  templateUrl: 'vippresentdetail.html',
})
export class VippresentdetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private config: ConfigProvider, private rlogin: RloginprocessProvider) {
      this.callback = this.navParams.get('callback');
  }
  public obj: object = null;
  public sysid: number = null;
  callback: any;

  searchBySysId() {
    let token = this.storage.get('token');
    let api = "v1/MemberShip/getMemberBySysId/" + token;
    this.httpService.requestData(api, (res) => {
      if (res.error_code == 0) {
        this.obj = res.data;
        this.obj['UserName'] = this.hidePhoneNum(this.obj['UserName']);
      } else if (res.error_code == 3) {
        //抢登处理
        this.rlogin.rLoginProcess(this.navCtrl);
      } else {
        this.noticeSer.showToast('众健号不存在');
      }
    }, { SysID: this.sysid });

  }
  hidePhoneNum(tel): string {
    let mtel = tel.substr(0, 3) + '****' + tel.substr(7);
    return mtel;
  }

  execute() {
    if (this.obj) {
      let token = this.storage.get('token');
      let api = "v1/MemberShip/GivePresentPromptly/" + token;
      this.httpService.doFormPost(api, { passiveUserId: this.obj['Id'], sendHeadId: this.navParams.get('sendHeadId') }, (res) => {
        if (res.error_code == 0) {
          this.noticeSer.showToast('赠送成功~');
          this.callback().then(()=>{ this.navCtrl.pop() });
        } else if (res.error_code == 3) {
          //抢登处理
          this.rlogin.rLoginProcess(this.navCtrl);
        } else {
          this.noticeSer.showToast('只能赠送给免费会员');
        }
      });
    } else {
      this.noticeSer.showToast('请先搜索众健号');
    }
  }
}
