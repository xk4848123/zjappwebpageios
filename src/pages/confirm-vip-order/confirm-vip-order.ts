import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { AlertProvider } from '../../providers/alert/alert';
import { ToastProvider } from '../../providers/toast/toast';
import { VerifypasswordProvider } from '../../providers/verifypassword/verifypassword';
import { WeblinkProvider } from '../../providers/weblink/weblink';

@IonicPage()
@Component({
  selector: 'page-confirm-vip-order',
  templateUrl: 'confirm-vip-order.html',
})
export class ConfirmVipOrderPage {
  public elec:(number);
  public specname:(any);
  public specid:(any);
  public productid:(any);
  public price:(any);
  public productname:(string);
  public buynum:(any);
  public img :(any);
  public deduRedback = 0;
  public dedubuy = 0;
  public deduCash = 0;
  public deduVip = 0;
  public redBak:(boolean) = false;
  public buy:(boolean) = false;
  public cash:(boolean) = false;
  public vip:(boolean) = false;
  public redBakNum:(number);
  public buyNum:(number);
  public cashNum:(number);
  public vipNum:(number);
  public res:(any);
  public isup = false;
  public clientHeight:(any);
  public token :(any);
  public addressName:(any);
  public addressPhone:(any);
  public address:(any);
  public addressDetail:(any);
  public remainCoupon:(any);
  public remainPay:(any);
  public remainCash:(any);
  public remainVip:(any);
  public productArray = [];
  public maxCoupon = 0;
  public allAmount = 0;
  public realpay = 0;
  public isTwoAddress = false;
  public memo = '';
  public addressId = '';
  constructor(public weblink:WeblinkProvider,public passwordProvider:VerifypasswordProvider,public toast: ToastProvider,public alert:AlertProvider,public navCtrl: NavController, public navParams: NavParams,private event: Events, public config:ConfigProvider,public httpservice : HttpServicesProvider,public storage:StorageProvider,public rlogin:RloginprocessProvider) {
    this.productArray = this.navParams.get("product");
    /**处理商品名 */
    for(var z=0;z<this.productArray.length;z++){
      this.productname = this.productArray[z].productname;
      if(this.productname.length>=15){
        this.productArray[z].productname = this.productname.substr(0,8)+"..."+this.productname.substr(this.productname.length-5,5);
      }
    }
    /**总价 */
    for(var i=0;i<this.productArray.length;i++){
     this.allAmount = this.allAmount+this.productArray[i].buynum*this.productArray[i].specPrice;
   }
   this.realpay = this.allAmount;
   /**可使用红包数 */
   for(var j=0;j<this.productArray.length;j++){
     this.maxCoupon = this.maxCoupon + (this.productArray[j].specElec/2)*this.productArray[j].buynum;
   }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmVipOrderPage');
  }
  ionViewWillEnter(){
    this.redBakNum = 1;
    this.cashNum = 1;
    this.buyNum = 1;
    this.vipNum = 1;
    this.token = this.storage.get("token");
    var api = "v1/PersonalCenter/GetPersonalAccountBalance/"+this.token;
    this.httpservice.requestData(api,(data)=>{
        if(data.error_code==3){
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }else{
          this.res={
            "redBak":data.data.personDataMap.Coupon,
            "buy":data.data.personDataMap.RemainPoints,
            "cash":data.data.personDataMap.RemainElecNum,
            "vip":data.data.personDataMap.RemainVIPAmount
          }
          this.remainCoupon = this.res.redBak;
          this.remainPay = this.res.buy;
          this.remainCash = this.res.cash;
          this.remainVip = this.res.vip;
          if(!this.isTwoAddress){
            this.getDefaultAddress();
          }
        }
    })
  }
  /**获取用户默认地址 */
  getDefaultAddress(){
    var api = "v1/AddressManager/getDefaultAddressOfUser";
    var params = {
      "token":this.token
    }
    this.httpservice.doFormPost(api,params,(data)=>{
      if(data.error_code==0){
        this.addressId = data.data.Id;
        this.addressName = data.data.Name;
        this.addressPhone = data.data.Phone;
        this.address = data.data.ProvinceName+data.data.CityName+data.data.RegionName;
        this.addressDetail = data.data.DetailAddress;
      }else if(data.error_code==-1){
        this.addressName = "未设置默认地址";
      }
    })
  }
  /**回调获取用户地址 */
  getUserAddress(addressId){
    var api = "v1/AddressManager/getAddressOfUserById/"+this.token+'/'+addressId;
    this.httpservice.requestData(api,(data)=>{
      if(data.error_code==0){
        this.addressId = addressId;
        this.addressName = data.data.Name;
        this.addressPhone = data.data.Phone;
        this.address = data.data.ProvinceName+data.data.CityName+data.data.RegionName;
        this.addressDetail = data.data.DetailAddress;
      }else if(data.error_code==3){
        this.rlogin.rLoginProcessWithHistory(this.navCtrl);
      }else{
        this.toast.showToast(data.error_message);
      }
    })
  }
  action = (msg)=>{
    this.isTwoAddress = true;
     return new Promise((resolve,reject)=>{
       if(msg!=undefined){
         this.getUserAddress(msg);
         resolve('ok');
       }else{
         reject(Error('error'));
       }
     });
   }
  /**选择地址 */
  toAddress(){
    this.navCtrl.push("AddressPage",{'action':this.action});
  }
  /**监听键盘弹出，收起 ios*/
  blurInput(){
    this.isup = false;
  }
  focusInput(){
    this.isup = true;
  }
  /**处理减法精度丢失 */
  subDouble(f,s,digit){
    var m = Math.pow(10, digit);
    return Math.round((f*m-s*m))/m;
  }
  /**处理三个数减法精度丢失 */
  subDouble3(f,s,t,digit){
    var m = Math.pow(10, digit);
    var middle =  Math.round((f*m-s*m))/m;
    return Math.round((middle*m-t*m))/m;
  }
   /**处理四个数减法精度丢失 */
   subDouble4(f,s,t,fouth,digit){
    var m = Math.pow(10, digit);
    var middle =  Math.round((f*m-s*m))/m;
    var middle1 = Math.round((middle*m-t*m))/m;
    return Math.round((middle1*m-fouth*m))/m;
  }
  /**监听币值切换 */
  clickcash(){
    if(this.redBakNum%2==0 && this.buyNum%2==0 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==1 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==0 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback  = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==1 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==1 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==1 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==0 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else{
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = this.allAmount-this.deduRedback>=this.res.buy ? this.res.buy: this.allAmount - this.deduRedback;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }
    this.cashNum++;
  }
  clickred(){
    if(this.redBakNum%2==0 && this.buyNum%2==0 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==1 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==0 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==1 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==1 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==1 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==0 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else{
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }
    this.redBakNum++;
  }
  clickbuy(){
    if(this.redBakNum%2==0 && this.buyNum%2==0 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==1 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==0 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==0 && this.buyNum%2==1 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==1 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==1 && this.cashNum%2==0){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = this.allAmount-this.deduRedback>=this.res.buy ? this.res.buy: this.allAmount - this.deduRedback;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBakNum%2==1 && this.buyNum%2==0 && this.cashNum%2==1){
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy =  0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else{
      this.vip = false;
      if(this.vipNum%2==0){
        this.vipNum++;
      }
      this.deduVip = 0;
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }
    this.buyNum++;
  }
  clickvip(){
    if(this.vipNum%2 == 1){
      this.redBak = false;
      this.buy = false;
      this.cash = false;
      if(this.redBakNum%2==0){
        this.redBakNum++;
      }
      if(this.buyNum%2==0){
        this.buyNum++;
      }
      if(this.cashNum%2==0){
        this.cashNum++;
      }
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.deduVip = this.allAmount>=this.remainVip ? this.remainVip : this.allAmount;
      this.realpay = this.subDouble(this.allAmount,this.deduVip,2);
    }else{
      this.redBak = false;
      this.buy = false;
      this.cash = false;
      if(this.redBakNum%2==0){
        this.redBakNum++;
      }
      if(this.buyNum%2==0){
        this.buyNum++;
      }
      if(this.cashNum%2==0){
        this.cashNum++;
      }
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.deduVip = 0;
      this.realpay = this.subDouble(this.allAmount,this.deduVip,2);
    }
    this.vipNum++;
  }
  goBuy(){
    var orderHeads = new Array();
    var productList = new Array();
    for(var i=0;i<this.productArray.length;i++){
      if(i==0){
        var _data = {
          "producerno":this.productArray[i].producerno,
          "list":[i]
        };
        orderHeads.push(_data);
      }else{
        for(var z=0;z<orderHeads.length;z++){
          if(orderHeads[z].producerno==this.productArray[i].producerno){
            orderHeads[z].list.push(i);
            break;
          }else if(orderHeads[z].producerno!=this.productArray[i].producerno && z==orderHeads.length-1){
            var _data1 = {
              "producerno":this.productArray[i].producerno,
              "list":[i]
            };
            orderHeads.push(_data1);
            break;
          }
        }
      }
    }
    for(var j=0;j<orderHeads.length;j++){
      var numlist = orderHeads[j].list;
      var orderLines =[];
      var payList = [];
      var totalAmount=0;
      var maxCoupon = 0;
      for(var w=0;w<numlist.length;w++){
        orderLines.push({
          "productId":this.productArray[numlist[w]].id,
          "productNum":this.productArray[numlist[w]].buynum,
          "specId":this.productArray[numlist[w]].specId
        });
        payList.push({
          "totalAmount":this.productArray[numlist[w]].buynum*this.productArray[numlist[w]].specPrice,
          "maxCoupon":this.productArray[numlist[w]].buynum*this.productArray[numlist[w]].specElec/2,
        });
      }
      for(var o =0;o<payList.length;o++){
        totalAmount+=payList[o].totalAmount;
        maxCoupon+=payList[o].maxCoupon;
      }
      var useCoupon = this.deduRedback>=maxCoupon ? maxCoupon : this.deduRedback;
      var usePointNum = this.subDouble(totalAmount,useCoupon,2) >= this.dedubuy ? this.dedubuy : this.subDouble(totalAmount,useCoupon,2);
      var useElecNum = this.subDouble3(totalAmount,useCoupon,usePointNum,2) >= this.deduCash ? this.deduCash : this.subDouble3(totalAmount,useCoupon,usePointNum,2);
      var realpay = this.subDouble4(totalAmount,useCoupon,usePointNum,useElecNum,2);
      realpay = this.subDouble(realpay,this.deduVip,2);
      productList.push({
        "freight":0,
        "memo":this.memo,
        "orderLines":orderLines,
        "producername":this.productArray[numlist[0]].producername,
        "producerno":this.productArray[numlist[0]].producerno,
        "producertel":this.productArray[numlist[0]].producertel,
        "realPay":realpay,
        "totalAmount":totalAmount,
        "useCoupon":useCoupon,
        "useElecNum":useElecNum,
        "usePointNum":usePointNum,
        "useVIPRemainNum":this.deduVip
      });
    }
    var params = {
      "adrressId":this.addressId,
      "orderHeads":productList
    }
    var api = "v2/PersonalCenter/createBOrder/"+this.token;
    this.httpservice.doPost(api,params,(data)=>{
      if(data.error_code==0){
        if(data.data.type==1){
          this.passwordProvider.execute(this.navCtrl,()=>{
            var api = "v1/PersonalCenter/syncHandleOrderC/"+this.token;
            var params = {
              "orderNoC":data.data.datas
            }
            this.httpservice.doFormPost(api,params,(data)=>{
              if(data.error_code==0){
                this.navCtrl.push('PaysuccessPage',{
                  "orderType":"1"
                });
              }else{
                this.toast.showToast(data.error_message);
              }
            });
          });
        }else if(data.data.type==2){
          this.weblink.wxGoWebPay(this.navCtrl,data.data.datas.orderNoC,data.data.datas.realpay,data.data.datas.orderType);
        }else if(data.data.type==3){
          this.passwordProvider.execute(this.navCtrl,()=>{
            this.weblink.wxGoWebPay(this.navCtrl,data.data.datas.orderNoC,data.data.datas.realpay,data.data.datas.orderType);
          });
        }
      }else{
        this.toast.showToast(data.error_message);
      }
    })
  }
}
