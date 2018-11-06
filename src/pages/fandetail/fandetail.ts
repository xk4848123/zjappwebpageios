import { Component, Renderer2, ElementRef,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';


import { StorageProvider } from '../../providers/storage/storage';

import { ToastProvider } from '../../providers/toast/toast';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ConfigProvider } from '../../providers/config/config';
// import { ToastProvider } from '../../providers/toast/toast';
/**
 * Generated class for the FandetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fandetail',
  templateUrl: 'fandetail.html',
})
//private noticeSer: ToastProvider
export class FandetailPage {
  @ViewChild(Content) content: Content;

  type: string;

  public fansList = '';

  page: number;

  readonly pageNum: number;

  //fixed div
  redDiv: any;
  yellowDiv: any;
  blueDiv: any;

  dataDiv:any;

  tempData = [];

  infiniteScroll: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,
    public httpService: HttpServicesProvider, private noticeSer: ToastProvider, private el: ElementRef, private re: Renderer2,
    private rlogin: RloginprocessProvider, private config: ConfigProvider) {
    if (this.navParams.get('type')) {
      this.type = this.navParams.get('type');
    } else {
      this.type = 'Red';
    }
    this.page = 0;
    this.pageNum = 10;
  }


  ionViewWillEnter() {
    this.redDiv = this.el.nativeElement.querySelector('.up');
    this.yellowDiv = this.el.nativeElement.querySelector('.down');
    this.blueDiv = this.el.nativeElement.querySelector('.center');
    this.changeColor();
    this.getData();
  }

  getData() {
    let token = this.storage.get('token');
    let api = 'v1/MemberShip/GetFansDetails/' + token;
    this.httpService.requestData(api, (data) => {
      if (data.error_code == 0) {
        if (this.page == 0) {
          this.tempData = data.data;
          this.page++
        } else {
          this.tempData = this.tempData.concat(data.data);
          if (!(data.data.length < this.pageNum)) {
            this.infiniteScroll.enable(true);
            this.page++
          }
        }

      } else if (data.error_code == 3) {
        this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        this.infiniteScroll.enable(true);
      } else {
        this.noticeSer.showToast('数据君出问题啦');
        this.infiniteScroll.enable(true);
      }
    }, { type: this.type, page: this.page, pageNum: this.pageNum });

  }

  toChange(type) {
    this.type = type;
    this.changeColor();
    this.content.scrollToTop(0); /*回到顶部*/
    this.page = 0;
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
    this.getData();
  }
  changeColor() {
    if (this.type == 'Red') {
      this.re.setStyle(this.redDiv, 'opacity', '1');
      this.re.setStyle(this.yellowDiv, 'opacity', '0.7');
      this.re.setStyle(this.blueDiv, 'opacity', '0.7');
    } else if (this.type == 'Yellow') {
      this.re.setStyle(this.redDiv, 'opacity', '0.7');
      this.re.setStyle(this.yellowDiv, 'opacity', '1');
      this.re.setStyle(this.blueDiv, 'opacity', '0.7');
    } else {
      this.re.setStyle(this.redDiv, 'opacity', '0.7');
      this.re.setStyle(this.yellowDiv, 'opacity', '0.7');
      this.re.setStyle(this.blueDiv, 'opacity', '1');
    }
  }
  //上拉加载数据
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.infiniteScroll = infiniteScroll;
      this.getData();
      infiniteScroll.complete();
      //把下拉事件提出来
      infiniteScroll.enable(false);
     
    }, 1000);
  }
}
