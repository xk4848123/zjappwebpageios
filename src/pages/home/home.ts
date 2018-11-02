import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { Jsonp } from "@angular/http";
import { ToastProvider } from '../../providers/toast/toast';
import { StorageProvider } from '../../providers/storage/storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("indexAdv") child_index_adv;//定义子组件对象
  @ViewChild(Content) content: Content;
  @ViewChild('search') search;
  public paramsA1 = new Array();/*A模块参数*/
  public paramsB1 = new Array();/*B模块参数*/
  public paramsC1 = new Array();/*C模块参数*/
  public paramsD1 = new Array();/*D模块参数*/
  public paramsG1 = new Array();/*G模块参数*/
  public paramsA2 = new Array();/*A模块参数*/
  public paramsB2 = new Array();/*B模块参数*/
  public paramsC2 = new Array();/*C模块参数*/
  public paramsD2 = new Array();/*D模块参数*/
  public paramsG2 = new Array();/*G模块参数*/
  public paramsA3 = new Array();/*A模块参数*/
  public paramsB3 = new Array();/*B模块参数*/
  public paramsC3 = new Array();/*C模块参数*/
  public paramsD3 = new Array();/*D模块参数*/
  public paramsG3 = new Array();/*G模块参数*/
  public paramsA4 = new Array();/*A模块参数*/
  public paramsB4 = new Array();/*B模块参数*/
  public paramsC4 = new Array();/*C模块参数*/
  public paramsD4 = new Array();/*D模块参数*/
  public paramsG4 = new Array();/*G模块参数*/
  public paramsA5 = new Array();/*A模块参数*/
  public paramsB5 = new Array();/*B模块参数*/
  public paramsC5 = new Array();/*C模块参数*/
  public paramsD5 = new Array();/*D模块参数*/
  public paramsG5 = new Array();/*G模块参数*/
  public paramsA6 = new Array();/*A模块参数*/
  public paramsB6 = new Array();/*B模块参数*/
  public paramsC6 = new Array();/*C模块参数*/
  public paramsD6 = new Array();/*D模块参数*/
  public paramsG6 = new Array();/*G模块参数*/
  public testParams = new Array();
  public isRed = false;
  public usercode: (string);
  public isSetSlides = false;

  constructor(public storage: StorageProvider, public ngzone: NgZone, public navCtrl: NavController, public config: ConfigProvider, public jsonp: Jsonp, public httpService: HttpServicesProvider, private noticeSer: ToastProvider) {
    this.loadIndex();
    
  }
  /**加载首页数据 */
  loadIndex() {
    var api = "v2/HomePage/initHomePage";
    this.httpService.requestData(api, (data) => {
      if (data.error_code == 0) {
        this.testParams = data.data;
        this.testParams.shift();
        this.getindex();
        this.get();
      } else {
        this.noticeSer.showToast(data.error_message);
      }
    })
  }
  ionViewWillEnter() {
    this.setSlides();
    this.content.ionScroll.subscribe(($event: any) => {
      this.ngzone.run(() => {//如果在页面滑动过程中对数据进行修改，页面是不会重构的。所以在对应的操作中需要使用如下方法，使页面能够重构。
        let length = $event.scrollTop;//当前滑动的距离
        if (length >= 219.4) {
          this.isRed = true;
        } else {
          this.isRed = false;
        }
        this.search.nativeElement//获取html中标记为one的元素
      });
    });
  }
  setSlides(){
    if (this.child_index_adv.slides) {
      if(!this.isSetSlides){
        this.child_index_adv.slides.autoplayDisableOnInteraction = false;
        this.isSetSlides = true;
      }
    }else{
      setTimeout(() => {
        this.setSlides();
      }, 100);
    }
  }
  //加载首页收据
  getindex() {
    for (let i = 0; i < this.testParams.length; i++) {
      if (this.testParams[i].type == 2) {
        if (i == 0) {
          this.paramsA1 = this.testParams[i];
        } else if (i == 1) {
          this.paramsA2 = this.testParams[i];
        } else if (i == 2) {
          this.paramsA3 = this.testParams[i];
        }
        else if (i == 3) {
          this.paramsA4 = this.testParams[i];
        }
        else if (i == 4) {
          this.paramsA5 = this.testParams[i];
        }
        else if (i == 5) {
          this.paramsA6 = this.testParams[i];
        }
      } else if (this.testParams[i].type == 3) {
        if (i == 0) {
          this.paramsB1 = this.testParams[i];
        } else if (i == 1) {
          this.paramsB2 = this.testParams[i];
        } else if (i == 2) {
          this.paramsB3 = this.testParams[i];
        }
        else if (i == 3) {
          this.paramsB4 = this.testParams[i];
        }
        else if (i == 4) {
          this.paramsB5 = this.testParams[i];
        }
        else if (i == 5) {
          this.paramsB6 = this.testParams[i];
        }
      } else if (this.testParams[i].type == 4) {
        if (i == 0) {
          this.paramsC1 = this.testParams[i];
        } else if (i == 1) {
          this.paramsC2 = this.testParams[i];
        } else if (i == 2) {
          this.paramsC3 = this.testParams[i];
        } else if (i == 3) {
          this.paramsC4 = this.testParams[i];
        } else if (i == 4) {
          this.paramsC5 = this.testParams[i];
        } else if (i == 5) {
          this.paramsC6 = this.testParams[i];
        }
      } else if (this.testParams[i].type == 5) {
        if (i == 0) {
          this.paramsD1 = this.testParams[i];
        } else if (i == 1) {
          this.paramsD2 = this.testParams[i];
        } else if (i == 2) {
          this.paramsD3 = this.testParams[i];
        }
        else if (i == 3) {
          this.paramsD4 = this.testParams[i];
        }
        else if (i == 4) {
          this.paramsD5 = this.testParams[i];
        }
        else if (i == 5) {
          this.paramsD6 = this.testParams[i];
        }
      } else if (this.testParams[i].type == 6) {
        if (i == 0) {
          this.paramsG1 = this.testParams[i];
        } else if (i == 1) {
          this.paramsG2 = this.testParams[i];
        } else if (i == 2) {
          this.paramsG3 = this.testParams[i];
        } else if (i == 3) {
          this.paramsG4 = this.testParams[i];
        } else if (i == 4) {
          this.paramsG5 = this.testParams[i];
        } else if (i == 5) {
          this.paramsG6 = this.testParams[i];
        }
      }
    }
  }
  //下拉刷型界面
  doRefresh($event) {
    this.loadIndex();
    setTimeout(() => {
      $event.complete();
      this.noticeSer.showToast('加载成功');
    }, 1000);
  }
  //操作dom
  get() {
    var a = document.querySelectorAll('.dis');
    for (let i = 0; i < this.testParams.length; i++) {
      if (this.testParams[i].type == 2) {
        var a1 = a[i].querySelectorAll("ion-modle-a");
        a1[0]['style'].display = '';
      } else if (this.testParams[i].type == 3) {
        var b1 = a[i].querySelectorAll("ion-modle-b");
        b1[0]['style'].display = '';
      } else if (this.testParams[i].type == 4) {
        var c1 = a[i].querySelectorAll("ion-modle-c");
        c1[0]['style'].display = '';
      } else if (this.testParams[i].type == 5) {
        var d1 = a[i].querySelectorAll("ion-modle-d");
        d1[0]['style'].display = '';
      } else if (this.testParams[i].type == 6) {
        var g1 = a[i].querySelectorAll("ion-modle-g");
        g1[0]['style'].display = '';
      }
    }

  }
  //定义一个跳转到搜索页面的方法
  goSearch() {
    this.navCtrl.push('SearchPage');
  }
}
