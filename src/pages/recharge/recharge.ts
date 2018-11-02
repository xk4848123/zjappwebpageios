import { Component, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ToastProvider } from '../../providers/toast/toast';
import { WeblinkProvider } from '../../providers/weblink/weblink';
/**
 * Generated class for the RechargePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html',
})
export class RechargePage {

  public money = '100';

  public num: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private renderer2: Renderer2, private noticeSer: ToastProvider,
    private el: ElementRef, private storage: StorageProvider, private httpService: HttpServicesProvider, private rloginprocess: RloginprocessProvider,private webLink:WeblinkProvider) {
  }

  ionViewWillEnter() {
    this.num = 0;
  }

  choose($event) {
    let moneyDiv = $event.target;
    let tempMoney = moneyDiv.innerHTML;
    if (!isNaN(tempMoney)) {
      this.num++;
      this.money = tempMoney;
      let flow_divs_array = this.el.nativeElement.querySelectorAll('.flow_divs');
      for (let i = 0; i < flow_divs_array.length; i++) {
        let children = flow_divs_array[i].children;
        for (let j = 0; j < children.length; j++) {
          this.renderer2.setStyle(children[j], 'border', '');
          this.renderer2.setStyle(children[j], 'box-shadow', '0 0.1rem 0.1rem #888888');
        }
      }
      this.renderer2.setStyle(moneyDiv, 'border', '1px solid #f53d3d');
      this.renderer2.setStyle(moneyDiv, 'box-shadow', '0 0');
    }
  }

  inputClick() {
    if (this.num == 0) {
      this.money = '';
      // this.renderer2.setStyle(moneyDiv,'innerHTML','');
      this.num++;
    }
  }
  pay() {
    let token = this.storage.get('token');
    if (token) {
      let apiUrl = "v2/MemberShip/createCOrderV2/" + token;
      this.httpService.doFormPost(apiUrl, { money: this.money }, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          this.webLink.wxGoWebPay(this.navCtrl,tempData.orderNo,tempData.realpay,tempData.orderType);
        } else if (data.error_code == 3) {
          this.rloginprocess.rLoginProcessWithHistory(this.navCtrl);
        } else {
          this.noticeSer.showToast(data.error_message);
        }
      });
   
    }


  }

}
