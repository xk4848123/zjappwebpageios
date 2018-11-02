import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the SplitimmediatelyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splitimmediately',
  templateUrl: 'splitimmediately.html',
})
export class SplitimmediatelyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private config: ConfigProvider, private rlogin: RloginprocessProvider) {
  }

  public obj: object = null;
  public sysid: number = null;

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
    let token = this.storage.get('token');
    let api = "v1/MemberShip/SplitStream/" + token;
    this.httpService.doFormPost(api, { toUserId: this.obj['Id'], type: this.navParams.get('type') }, (res) => {
      if (res.error_code == 0) {
        this.noticeSer.showToast('分流成功~');
        this.navCtrl.pop();
      } else if (res.error_code == 3) {
        //抢登处理
        this.rlogin.rLoginProcess(this.navCtrl);
      } else {
        this.noticeSer.showToast(res.error_message);
      }
    });
  }

}
