import { Component, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../../providers/config/config';

import { ToastController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

//课程详情
import { CommercialdetailPage } from '../commercialdetail/commercialdetail';

/**
 * Generated class for the CommercialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-commercial',
  templateUrl: 'commercial.html',
})
export class CommercialPage {
  public commercialData = '';
  public page = 0;
  public pageNum = 5;
  type: any = '1';
  public typeData = '';
  public temp = [];
  infiniteScroll: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public httpService: HttpServicesProvider, public toast: ToastProvider,
    private config: ConfigProvider, private toastCtrl: ToastController, private alertCtrl: AlertController, private re: Renderer2, private el: ElementRef) {
    if (this.navParams.get('type')) {
      this.type = this.navParams.get('type');
    }
    this.getHomePage();
  
   
  }

  changeCss(attrOne, attrs) {
    for (let index = 0; index < attrs.length; index++) {
      this.re.setStyle(attrs[index], 'color', 'rgb(0, 0, 0)');
      // this.re.setStyle(attrs[index], 'text-decoration', 'none');
      // this.re.setStyle(attrs[index], 'margin-top', '0');
      this.re.setStyle(attrs[index], 'border-bottom', '0');
      this.re.setStyle(attrs[index], 'cursor ', 'auto');
    }

    this.re.setStyle(attrOne, 'color', '#f53d3d');
   // this.re.setStyle(attrOne, 'text-decoration', 'underline');
    //this.re.setStyle(attrOne, 'margin-top', '-0.5rem');
    this.re.setStyle(attrOne, 'border-bottom', '1px solid #f53d3d');
    this.re.setStyle(attrOne, 'cursor ', 'pointer');
  }
  bindEvent(attrDom) {

    attrDom[0].onclick = () => {
      if (this.type == '1') {
        return;
      }
      this.type = '1';
      this.changeCss(attrDom[0], attrDom);
      this.initData();
    }
    attrDom[1].onclick = () => {
      if (this.type == '2') {
        return;
      }
      this.type = '2';
      this.changeCss(attrDom[1], attrDom);
      this.initData();
    }
    attrDom[2].onclick = () => {
      if (this.type == '3') {
        return;
      }
      this.type = '3';
      this.changeCss(attrDom[2], attrDom);
      this.initData();
    }
  }
  initData() {
    //刚进入该页或者点击时页数置0
    this.page = 0;
    this.getData();

    //从未下拉加载过就不执行
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
    //数据清空
    this.temp = [];
  }


  ionViewDidLoad() {
  //初始化数据后改变点击按钮颜色
  var attrDom = this.el.nativeElement.querySelectorAll('.col-demo');
  this.changeCss(attrDom[0], attrDom);
  this.bindEvent(attrDom);

  this.initData();

  }
  //进入课程详情
  pushDetail(curId) {
    this.navCtrl.push('CommercialdetailPage', {
      curId: curId,
    })
  }


 getHomePage(){
  let api = 'v2/commercialcollege/homepage';
  this.httpService.requestData(api, (data) => {
    //console.log(data);
    if (data.error_code == 0) {
      this.commercialData = data.data;
      //console.log(this.commercialData);
    } 
    else {
      this.toast.showToast(data.error_message);
    }
  });
 }

  getData() {
  
    let apis = 'v2/commercialcollege/coursesbytype?' + 'type=' + this.type + '&page=' + this.page + '&pageNum=' + this.pageNum;
    this.httpService.requestData(apis, (res) => {
      if (res.error_code == 0) {
        for (let i = 0; i < res.data.length; i++) {
          this.temp.push(res.data[i]);
        }
        if (res.data.length < this.pageNum) {
          //没有更多数据了
          if(this.infiniteScroll){
            this.infiniteScroll.enable(false);
          }
         
        }
        this.page++;
      } else {
        this.toast.showToast('数据获取异常');
      }
    });

  }
  //上拉加载数据
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.getData();
      infiniteScroll.complete();
      //把下拉事件提出来
      this.infiniteScroll = infiniteScroll;
    }, 1000);
  }
  //下拉刷新界面
  doRefresh($event) {
    this.getHomePage();
    this.initData();
    setTimeout(() => {
      $event.complete();
      this.toast.showToast('加载成功');
    }, 1000);
  }
  
}
