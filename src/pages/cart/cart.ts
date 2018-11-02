import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ToastProvider } from '../../providers/toast/toast';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { AlertProvider } from '../../providers/alert/alert';
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  public list = [];
  public allPrice=0;  /*总价*/

  public isChencked=false;  /*全选反选*/

  public isEdit=false;   /*是否编辑*/

  public hasData = false;   /*是否有数据*/

  public productName:(string);/**商品名 */

  public length = 0;/**商品种类数量 */

  public isIndex = true;/**是否从详情页进入购物车，true为从首页进入 */

  public productArray = [];

  public num = 1;/**记录第几次进入购物车且未登陆 */

  constructor(public alertProvider:AlertProvider,public rlogin:RloginprocessProvider,public navCtrl: NavController,public navParams: NavParams,public config:ConfigProvider,public storage:StorageProvider,public httpservice :HttpServicesProvider,public toast:ToastProvider) {
    this.isIndex = navParams.get("isIndex");
    if(this.isIndex==undefined){
      this.isIndex = true;
    }
  }
  ionViewDidLoad(){
    
  }
  ionViewWillEnter(){
    if(this.isIndex === true){
    }
    this.num = this.storage.getSessionStorage("carNum")==null ? 1 : this.storage.getSessionStorage("carNum");
    this.getCartsData();
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
  /**乘法 */
  mul(num1,num2){
    var m=0,s1=num1.toString(),s2=num2.toString(); 
    try{m+=s1.split(".")[1].length}catch(e){};
    try{m+=s2.split(".")[1].length}catch(e){};
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
  }
  getCartsData(){
    /**判断是否是从详情页进入的购物车 */
    var api =  'v1/PersonalCenter/PersonalCenter/getShoppingCartInfo';
    var cartsData=this.storage.get('token');
    var params = {"token":cartsData};
    this.httpservice.requestData(api,(data)=>{
      if(data.error_code==0){
        this.list = data.data;
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].producerName=='' || this.list[i].producerName==null){
            this.list[i].producerName="平台自营";
          }
          for(var j=0;j<this.list[i].productList.length;j++){
            if(this.list[i].productList[j].product.productname.length>=20){
              this.productName = this.list[i].productList[j].product.productname;
              this.productName = this.productName.substring(0,20)+"...";
              this.list[i].productList[j].product.productname = this.productName;
            }
            this.length++;
            this.list[i].productList[j].checked=false;
          }
        }
        if(this.list.length>0){
          this.hasData=true;
        }else{
          this.list=[];
          this.hasData=false;
        }
      }else if(data.error_code==3){
        if(this.num==2){
          this.num=1;
          this.storage.setSessionStorage("carNum",this.num);
        }else{
          this.num++;
          this.storage.setSessionStorage("carNum",this.num);
          this.navCtrl.push('LoginPage');
        }  
      }else{
        this.toast.showToast(data.error_message);
      }
    },params);
    this.isChencked = false;
    this.allPrice = 0;
  }
  changeCarts(){
    if(this.getChenckNum()==this.length){
      this.isChencked=true;
    }else{
      this.isChencked=false;
    }
    this.sumPrice();  
  }
/*计算总价*/
  sumPrice(){
      var tempAllPrice=0;
      for(let i=0;i<this.list.length;i++){
        for(let j=0;j<this.list[i].productList.length;j++){
          if(this.list[i].productList[j].checked==true){
            //tempAllPrice+=this.list[i].productList[j].productnum*this.list[i].productList[j].productSpec.price;
            tempAllPrice = this.add(tempAllPrice,this.mul(this.list[i].productList[j].productnum,this.list[i].productList[j].productSpec.price));
          }
        }
      }
      this.allPrice=tempAllPrice;
  }

  //数量变化  双向数据绑定

  decCount(item){
    let api = "v1/PersonalCenter/updateShoppingCartInfo/"+item.id;
    var params = {
      "token":this.storage.get("token"),
      "productNum":item.productnum-1
    };
    if(item.productnum>1){
      this.httpservice.doFormPost(api,params,(data)=>{
        if(data.error_code==0){
          --item.productnum;
          this.sumPrice(); 
        }else{
          this.toast.showToast(data.error_message);
        }
      });
    }
  }

  incCount(item){
    let api = "v1/PersonalCenter/updateShoppingCartInfo/"+item.id;
    var params = {
      "token":this.storage.get("token"),
      "productNum":item.productnum+1
    };
    this.httpservice.doFormPost(api,params,(data)=>{
      if(data.error_code==0){
        ++item.productnum;
        this.sumPrice();  
      }else{
        this.toast.showToast(data.error_message);
      }
    });
  }

  //离开的时候保存购物车数据
   ionViewWillLeave(){
    this.list = [];
    this.allPrice = 0;
    this.isChencked = false;
    this.isEdit = false;
    this.hasData = false;
    this.productName = null;
    this.length=0;
   }

   //全选反选
 //ionChange  事件只要checkbox改变就会触发
   checkAll(){ /*按钮*/
      if(this.isChencked){/*选中*/
         for(let i=0;i<this.list.length;i++){
           for(let j=0;j<this.list[i].productList.length;j++){
            this.list[i].productList[j].checked=false;   
           }
         }
         this.isChencked=false;
      }else{
         for(let i=0;i<this.list.length;i++){
           for(let j=0;j<this.list[i].productList.length;j++){
            this.list[i].productList[j].checked=true;
           }          
         }
         this.isChencked=true;
      }
      this.sumPrice();
   }
   //获取选中的数量
   getChenckNum(){
      let sum=0;
      for(let i=0;i<this.list.length;i++){
        for(let j=0;j<this.list[i].productList.length;j++){
          if(this.list[i].productList[j].checked==true){
            sum+=1;
          }
        }        
      }
      return sum;
   }

  //执行删除操作
  doDelete(){
        this.length=0;
        var noCheckProduct=[];
        var delArr=[];
        for(var o=0;o<this.list.length;o++){
          for(var z=0;z<this.list[o].productList.length;z++){
            if(this.list[o].productList[z].checked){
              delArr.push(this.list[o].productList[z].id);
            }
          }
        }
         /**调用删除接口 */
         var api = "v2/PersonalCenter/batchdelshoppingcart?token="+this.storage.get("token");
         var params = delArr;
         this.httpservice.doPost(api,params,(data)=>{
           if(data.error_code==0){
            for(var i=0;i<this.list.length;i++){
              var len = 0;
              var noCheckedArr=[];
              for(var j=0;j<this.list[i].productList.length;j++){
                if(!this.list[i].productList[j].checked){
                  noCheckedArr.push(this.list[i].productList[j]);
                  this.length++;
                  len++;
                }
              }
              if(len==0){
    
              }else{
                noCheckProduct.push({
                  "producerName":this.list[i].producerName,
                  "productList":noCheckedArr
                });
              }
            }
          //改变当前数据
          this.list=noCheckProduct;
          this.list.length>0?this.hasData=true:this.hasData=false;
           }else{
            this.toast.showToast(data.error_message);
           }
         });    
  }
    //改变编辑状态  
    changeedit(){
      this.isChencked = true;
      this.checkAll();
      this.isEdit=!this.isEdit
    }
   //去结算  去订单页面
   doPay(){
    //获取购物车选中的数据
    /**
     * 
     */
      var tempArr=[];    
      for(var i=0;i<this.list.length;i++){
        for(var j=0;j<this.list[i].productList.length;j++){
          if(this.list[i].productList[j].checked){
            tempArr.push({
              "buynum":this.list[i].productList[j].productnum,
              "id":this.list[i].productList[j].product.id,
              "freight":0,
              "producername":this.list[i].productList[j].product.producername,
              "producerno":this.list[i].productList[j].product.producerno,
              "producertel":this.list[i].productList[j].product.producertel,
              "productname":this.list[i].productList[j].product.productname,
              "productphotos":this.list[i].productList[j].product.productphotos,
              "specElec":this.list[i].productList[j].productSpec.elecNum,
              "specId":this.list[i].productList[j].productSpec.id,
              "specName":this.list[i].productList[j].productSpec.specname,
              "specPrice":this.list[i].productList[j].productSpec.price
            });
          }
        }
      }
      //选中的数据
      //保存订单数据
      if(tempArr.length>0){
        this.navCtrl.push('ConfirmOrderPage',{
          "product":tempArr
        });
      }else{
        this.alertProvider.showAlert("未选中数据",'',['确定']);
      }
   }
}
