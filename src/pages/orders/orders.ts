import { Component, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../../providers/config/config';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';

import { ToastController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { VerifypasswordProvider } from '../../providers/verifypassword/verifypassword';
import { WeblinkProvider } from '../../providers/weblink/weblink';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  public temp = [];
  typeData: any = 'all';
  page: number = 0;
  pageNum: number = 3;
  enable: boolean = true;
  infiniteScroll: any;
  constructor(public weblink:WeblinkProvider,public rlogin:RloginprocessProvider,public passwordProvider:VerifypasswordProvider,public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public httpService: HttpServicesProvider, public toast: ToastProvider,
    private config: ConfigProvider, private toastCtrl: ToastController, private alertCtrl: AlertController,
    private re: Renderer2, private el: ElementRef,private rclogin: RloginprocessProvider) {
    if (this.navParams.get('type')) {
      this.typeData = this.navParams.get('type');
    }
  }
  //从订单页面到订单详情页
  pushdetail(orderId,orderno,item) {
    this.navCtrl.push('OrderlistPage',
      { orderId: orderId,
        orderNo:orderno,
        item:item
      });
  }


  changeCss(attrOne, attrs) {
    for (let index = 0; index < attrs.length; index++) {
      this.re.setStyle(attrs[index], 'color', '#555555');
      this.re.setStyle(attrs[index], 'border-bottom', '0');
      this.re.setStyle(attrs[index], 'cursor ', 'auto');
    }

    this.re.setStyle(attrOne, 'color', '#f53d3d');
    this.re.setStyle(attrOne, 'border-bottom', '1px solid #f53d3d');
    this.re.setStyle(attrOne, 'cursor ', 'pointer');
  }

  bindEvent(attrDom) {

    attrDom[0].onclick = () => {
      if (this.typeData == 'all') {
        return;
      }
      this.typeData = 'all';
      this.changeCss(attrDom[0], attrDom);
      this.initData();
    }
    attrDom[1].onclick = () => {
      if (this.typeData == 'wp') {
        return;
      }
      this.typeData = 'wp';
      this.changeCss(attrDom[1], attrDom);
      this.initData();
    }
    attrDom[2].onclick = () => {
      if (this.typeData == 'ws') {
        return;
      }
      this.typeData = 'ws';
      this.changeCss(attrDom[2], attrDom);
      this.initData();
    }
    attrDom[3].onclick = () => {
      if (this.typeData == 'wr') {
        return;
      }
      this.typeData = 'wr';
      this.changeCss(attrDom[3], attrDom);
      this.initData();
    }
    attrDom[4].onclick = () => {
      if (this.typeData == 'wc') {
        return;
      }
      this.typeData = 'wc';
      this.changeCss(attrDom[4], attrDom);
      this.initData();
    }
  }
  ionViewDidLoad() {
    this.initData();
    //初始化数据后改变点击按钮颜色
    var attrDom = this.el.nativeElement.querySelectorAll('.col-demo');
    if (this.typeData == 'all') {
      this.changeCss(attrDom[0], attrDom);
    }
    if (this.typeData == 'wp') {
      this.changeCss(attrDom[1], attrDom);
    }
    if (this.typeData == 'ws') {
      this.changeCss(attrDom[2], attrDom);
    }
    if (this.typeData == 'wr') {
      this.changeCss(attrDom[3], attrDom);
    }
    if (this.typeData == 'wc') {
      this.changeCss(attrDom[4], attrDom);
    }
    this.bindEvent(attrDom);


  }

  getData() {
    
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/getOrder/' + token + '/' + this.typeData;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {
          for (let i = 0; i < data.data.length; i++) {
            this.temp.push(data.data[i]);
          }
          if (data.data.length < this.pageNum) {
            //没有更多数据了
            this.enable = false;
            if(this.infiniteScroll){
              this.infiniteScroll.enable(false);
            }
          } 
         
            this.page++;
    

        } else if (data.error_code == 3) {
          //抢登处理
        } else {
          this.toast.showToast(data.error_message);
        }
      }, { page: this.page, pageNum: this.pageNum });
    }
  }

  initData() {
    //刚进入该页或者点击时页数置0
    this.page = 0;
    //刚进入该页或者点击时上拉加载置为可以
    this.enable = true;
    //从未下拉加载过就不执行
    if(this.infiniteScroll){
      this.infiniteScroll.enable(this.enable);
    }
    //数据清空
    this.temp = [];
    this.getData();
  }
  //取消订单
  pushcancelOrder(orderno) {
      let token = this.storage.get('token');
      if (token) {
        //api请求
        let api = 'v1/PersonalCenter/cancelOrder/' +token;
         
         this.httpService.doFormPost(api,{orderNo: orderno} ,(data) => {
            if (data.error_code == 0) {
              this.navCtrl.push('OrderhandletransferPage',{type: '1'});
           } else if(data.error_code == 3){
             //抢登处理
             this.rclogin.rLoginProcess(this.navCtrl);
           }
           else {
             this.toast.showToast(data.error_message);
           }
        });
      }
  }
  //支付订单

  payNow(orderno) {

    let alert = this.alertCtrl.create({
      subTitle: '确定支付订单吗？',
      buttons: ['取消',
        {
          text: '确定',
          handler: () => {
            this.realpayNow(orderno);
          }
        }]
    })
    alert.present();
  }

   //立即支付
   realpayNow(orderno){
    var api = "v2/PersonalCenter/HandleEOrder/"+this.storage.get('token');
    var params = {
      "orderNo":orderno
    }
    this.httpService.doFormPost(api,params,(data)=>{
      console.log(data);
      if(data.data.type==1){
        //使用虚拟货币未使用钱 
        this.passwordProvider.execute(this.navCtrl,()=>{
          var api = "v1/PersonalCenter/syncHandleOrder/"+this.storage.get('token');
          var params = {
            "orderNo":data.data.datas
          }
          this.httpService.doFormPost(api,params,(data)=>{
            if(data.error_code==0){
              this.navCtrl.push('PaysuccessPage',{
                "orderType":"1"
              });
            }else if(data.error_code==3){
              this.rlogin.rLoginProcess(this.navCtrl);
            }else{
              this.toast.showToast(data.error_message);
            }
          });
        });
      }else if(data.data.type==2){
        //使用钱
        this.weblink.wxGoWebPay(this.navCtrl,data.data.datas.orderNo,data.data.datas.realpay,data.data.datas.orderType);
      }else if(data.data.type==3){
        //使用虚拟货币使用钱
        this.passwordProvider.execute(this.navCtrl,()=>{
          this.weblink.wxGoWebPay(this.navCtrl,data.data.datas.orderNo,data.data.datas.realpay,data.data.datas.orderType);
        });
      }
    });
  }
  //申请退款
  pushrefund(orderno){
    this.navCtrl.push('RefundPage',
    {
      orderNo:orderno 
    });
  }
  //申请退货
  pushsale(orderno){
    this.navCtrl.push('SalereturnPage',
    {
      orderNo:orderno 
    });
  }
  //确认收货
confirmorder(item){
  let token = this.storage.get('token');
  if (token) {
    //api请求
    let api = 'v1/PersonalCenter/confirmOrder/' +token;
     //发送请求提交退款申请
     this.httpService.doFormPost(api,{orderNo:item.orderno } ,(data) => {
        if (data.error_code == 0) {
          this.navCtrl.push('OrderhandletransferPage',{type: '2'});
       } else if(data.error_code == 3){
         //抢登处理
         this.rclogin.rLoginProcess(this.navCtrl);
       }
       else {
         this.toast.showToast(data.error_message);
       }
    });
  }
}
//查看物流
information(orderNo){
  this.navCtrl.push('InformationPage',
  {
   orderNo: orderNo
  });
}
//评价
comment(orderId,orderNo,item){
  this.navCtrl.push('CommentPage',{
   orderId:orderId,
   orderNo:orderNo,
   item:item
  })
}
  //上拉加载数据
  doInfinite(infiniteScroll) {
    setTimeout(() => {
    this.getData();
    infiniteScroll.complete();
    infiniteScroll.enable(this.enable);
    //把下拉事件提出来
    this.infiniteScroll=infiniteScroll;
  }, 1000);
  }
  //下拉刷新界面
  doRefresh($event) {
    setTimeout(() => {
      this.initData();
      $event.complete();
      this.toast.showToast('加载成功');
    }, 1000);
  }
}
