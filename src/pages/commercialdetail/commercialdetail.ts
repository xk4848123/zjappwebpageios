import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../../providers/config/config';

import { ToastController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { DomSanitizer } from '@angular/platform-browser';


/**
 * Generated class for the CommercialdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-commercialdetail',
  templateUrl: 'commercialdetail.html',
})
export class CommercialdetailPage {
 public curId:number;
 public tempData='';
 public detailPage='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: StorageProvider, public httpService: HttpServicesProvider, public toast: ToastProvider,
    private config: ConfigProvider, private toastCtrl: ToastController, private alertCtrl: AlertController,public sanitizer:DomSanitizer) {
      this.curId=this.navParams.get('curId');
      console.log(this.curId);
  }
  assembleHTML(strHTML:any){
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommercialdetailPage');
  }
  ionViewWillEnter() {
    //课程详细主页
    let apis='v2/commercialcollege/coursedetailmain?' + 'courseid=' + this.curId; 
    this.httpService.requestData(apis, (data) => {
      if(data.error_code==0){
       this.detailPage=data.data;
      }else{
        this.toast.showToast('数据获取异常');
      }
    });
            //课程图文详情
          let api='v2/commercialcollege/coursehtmltext?' + 'courseid=' + this.curId; 
          this.httpService.requestData(api, (data) => {
            if(data.error_code==0){
             this.tempData=data.data;
            }else{
              this.toast.showToast('数据获取异常');
            }
          });
  }
}
