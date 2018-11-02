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
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {
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
  public redBak:(boolean) = false;
  public buy:(boolean) = false;
  public cash:(boolean) = false;
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
  public productArray = [];
  public maxCoupon = 0;
  public allAmount = 0;
  public realpay = 0;
  public isTwoAddress = false;
  public memo = '';
  public addressId = '';
  constructor(public weblink: WeblinkProvider,public passwordProvider:VerifypasswordProvider,public toast: ToastProvider,public alert:AlertProvider,public navCtrl: NavController, public navParams: NavParams,private event: Events, public config:ConfigProvider,public httpservice : HttpServicesProvider,public storage:StorageProvider,public rlogin:RloginprocessProvider) {
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
     //this.allAmount = this.allAmount+this.productArray[i].buynum*this.productArray[i].specPrice;
     this.allAmount = this.add(this.allAmount,this.mul(this.productArray[i].buynum,this.productArray[i].specPrice));
   }
   this.realpay = this.allAmount;
   /**可使用红包数 */
   for(var j=0;j<this.productArray.length;j++){
     this.maxCoupon = this.maxCoupon + (this.productArray[j].specElec/2)*this.productArray[j].buynum;
   }
  }
  ionViewWillEnter(){
    this.token = this.storage.get("token");
    var api = "v1/PersonalCenter/GetPersonalAccountBalance/"+this.token;
    this.httpservice.requestData(api,(data)=>{
        if(data.error_code==3){
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }else{
          this.res={
            "redBak":data.data.personDataMap.Coupon,
            "buy":data.data.personDataMap.RemainPoints,
            "cash":data.data.personDataMap.RemainElecNum
          }
          this.remainCoupon = this.res.redBak;
          this.remainPay = this.res.buy;
          this.remainCash = this.res.cash;
          if(!this.isTwoAddress){
            this.getDefaultAddress();
          }
        }
    })
  }
   /**乘法 */
   mul(num1,num2){
    var m=0,s1=num1.toString(),s2=num2.toString(); 
    try{m+=s1.split(".")[1].length}catch(e){};
    try{m+=s2.split(".")[1].length}catch(e){};
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
  }
  /**加法 精度问题 */
  add(num1,num2){
    var r1,r2,m;
       try{
           r1 = num1.toString().split('.')[1].length;
       }catch(e){
           r1 = 0;
       }
       try{
           r2=num2.toString().split(".")[1].length;
       }catch(e){
           r2=0;
       }
       m=Math.pow(10,Math.max(r1,r2));
       // return (num1*m+num2*m)/m;
       return Math.round(num1*m+num2*m)/m;
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
  ionViewDidLoad() {
    
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
    if(this.redBak==true && this.buy==true && this.cash==true){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==false && this.cash==true){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==true && this.cash==false){
      this.deduRedback  = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==false && this.cash==false){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==false && this.cash==false){
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==false && this.cash==true){
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==true && this.cash==false){
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else{
      this.deduRedback = 0;
      this.dedubuy = this.allAmount-this.deduRedback>=this.res.buy ? this.res.buy: this.allAmount - this.deduRedback;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }
  }
  clickred(){
    if(this.redBak==true && this.buy==true && this.cash==true){
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==false && this.cash==true){
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==true && this.cash==false){
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==false && this.cash==false){
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==false && this.cash==false){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy = 0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==false && this.cash==true){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==true && this.cash==false){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else{
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }
  }
  clickbuy(){
    if(this.redBak==true && this.buy==true && this.cash==true){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==false && this.cash==true){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==true && this.cash==false){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==true && this.buy==false && this.cash==false){
      this.deduRedback = this.res.redBak>=this.maxCoupon ? this.maxCoupon : this.res.redBak;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==false && this.cash==false){
      this.deduRedback = 0;
      this.dedubuy =  this.subDouble(this.allAmount,this.deduRedback,2)>=this.res.buy ? this.res.buy: this.subDouble(this.allAmount,this.deduRedback,2);
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==false && this.cash==true){
      this.deduRedback = 0;
      this.dedubuy = this.allAmount-this.deduRedback>=this.res.buy ? this.res.buy: this.allAmount - this.deduRedback;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else if(this.redBak==false && this.buy==true && this.cash==false){
      this.deduRedback = 0;
      this.dedubuy =  0;
      this.deduCash = 0;
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }else{
      this.deduRedback = 0;
      this.dedubuy = 0;
      this.deduCash = this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2)>=this.res.cash ? this.res.cash : this.subDouble3(this.allAmount,this.deduRedback,this.dedubuy,2);
      this.realpay = this.subDouble4(this.allAmount,this.deduRedback,this.dedubuy,this.deduCash,2);
    }
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
        "useVIPRemainNum":0
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
