import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { WeblinkProvider } from '../../providers/weblink/weblink';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
@Component({
  selector: 'page-index-adv',
  templateUrl: 'index-adv.html',
})
export class IndexAdvPage {
  @ViewChild(Slides) slides: Slides;
  public focusList = [];  /*数组 轮播图*/
  constructor(public noticeSer: ToastProvider, public httpService: HttpServicesProvider, public toast: ToastProvider, public storage: StorageProvider,
    public config: ConfigProvider, public web: WeblinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getFocus();
  }

  /**轮播页跳转 */
  goDetail(item) {
    if (item.picType == 1) {
      this.web.goWeb(item.picUrl);
    } else if (item.picType == 2) {
      this.navCtrl.push("ProductDetailPage", {
        "id": item.picProductid
      });
    } else if (item.picType == 3) {
      this.navCtrl.push("KeyProductListPage", {
        "keywords": item.picKeyword
      });
    }
  }
  getFocus() {
    var api = "v2/HomePage/initHomePage";
    this.httpService.requestData(api, (data) => {
      if (data.error_code == 0) {
        this.focusList = data.data[0].pageMoudles;
      } else {
        this.noticeSer.showToast(data.error_message);
      }
    })
  }
  commercial() {
    this.navCtrl.push('CommercialPage');
  }
  newUser() {
    let token = this.storage.get("token");
    if (token == null) {
      this.navCtrl.push('LoginPage', { history: 'history' });
    } else {
      this.web.goWeb(this.config.domain + "/html/newpeople.html?token=" + token);
    }
  }
  goSign() {
    let token = this.storage.get("token");
    if (token == null) {
      this.navCtrl.push('LoginPage', { history: 'history' });
    } else {
      this.web.goWeb(this.config.domain + "/html/signIn.html?token=" + token);
    }
  }
  goOldUser() {
    this.navCtrl.push('MembersProductPage');
  }
  gobulk() {
    this.toast.showToast("暂未开放,敬请期待！");
  }
}
