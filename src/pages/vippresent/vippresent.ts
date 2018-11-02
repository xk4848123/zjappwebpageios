import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the VippresentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vippresent',
  templateUrl: 'vippresent.html',
})
export class VippresentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider,private rlogin:RloginprocessProvider) {
  }


  public type: string = '';
  public list: Array<any> = [];

  getData = () =>
  {
    return new Promise((resolve, reject) => {
      if(this.type == 'possessor'){
        this.getPossessor();
      }else{
        this.getAlreadyGive();
      }
      resolve();
    });
  }

  ionViewWillEnter() {
    this.type = 'possessor'; 
  }

  getPossessor() {
    let token = this.storage.get('token');
    let api = 'v1/MemberShip/GetPresent/' + token;
    this.httpService.requestData(api, (res) => {
      if (res.error_code == 0) {
        this.list = res.data;

      } else if (res.error_code == 3) {
        //抢登处理
        this.rlogin.rLoginProcessWithHistory(this.navCtrl);
      } else {
        this.noticeSer.showToast('服务异常，请稍后重试');
      }
    }, { type: 1 });
  }
  getAlreadyGive() {
    let token = this.storage.get('token');
    let api = 'v1/MemberShip/GetPresent/' + token;
    this.httpService.requestData(api, (res) => {
      if (res.error_code == 0) {
        this.list = res.data;

      } else if (res.error_code == 3) {
        //抢登处理
        this.rlogin.rLoginProcessWithHistory(this.navCtrl);
      } else {
        this.noticeSer.showToast('服务异常，请稍后重试');
      }
    }, { type: 2 });
  }
  segmentChanged($event) {
    if ($event.value == 'possessor') {
      this.getPossessor();
    } else {
      this.getAlreadyGive();
    }
  }

  GiveImmediately(sendHeadId){
     this.navCtrl.push('VippresentdetailPage',{
       sendHeadId: sendHeadId,
       callback: this.getData
     })
  }

}
