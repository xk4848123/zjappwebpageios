import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  public datas = [];
  public callback: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private rlogin: RloginprocessProvider) {
    if (this.navParams.get('action')) {
      this.callback = this.navParams.get('action');
    }
  }
  ionViewWillEnter() {
    this.initData();
  }


  backWithAdrress($event, addressId) {
    if ($event.target.className == 'button') {
      this.addOrEdit(addressId);
    } else {
      this.callback(addressId).then(() => { this.navCtrl.pop() });

    }
  }


  initData() {
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/AddressManager/getAllAddressOfUser/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          this.datas = data.data;
          for (let index = 0; index < this.datas.length; index++) {
            this.datas[index].headName = this.getHeadName(this.datas[index].Name);

          }
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast(data.error_message);
        }
      });
    }
  }

  getHeadName(name: string): string {
    return name.substr(0, 1);
  }

  addOrEdit(id: number) {
    if (id) {
      //修改地址
      this.navCtrl.push('OperateaddressPage', { id: id });

    } else {
      //新增地址
      this.navCtrl.push('OperateaddressPage');

    }

  }
}
