import { Component } from '@angular/core';
import { App,NavController, NavParams,ViewController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { AlertProvider } from '../../providers/alert/alert';
import { LoginPage } from '../../pages/login/login';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
@Component({
  selector: 'car-modal',
  templateUrl: 'car-modal.html'
})
export class CarModalComponent {
  public productname:(string);
  public price:(any);
  public elec:(any);
  public img:(any);
  public num:(any);
  public id:(any);
  public productspecs = new Array();
  public buyNumber = 1;
  public specId:(number);
  public specName:(string);
  public product:(any);
  public productArray = [];
  constructor(public rlogin :RloginprocessProvider,public appCtrl : App,public navCtrl :NavController,
    public params: NavParams,public config :ConfigProvider,public viewCrl:ViewController,public storage:StorageProvider,
    public alert: AlertProvider,public httpservice:HttpServicesProvider) {
    this.product = params.get("product");
    this.productname = this.product.productname;
    this.productname = this.productname.substr(0,5)+"..."+this.productname.substr(this.productname.length-5,5);
    this.num = this.product.stocknum;
    this.price = this.product.price;
    this.elec = this.product.elecnum;
    this.id = this.product.id;
    this.img = this.product.productphotos;
    this.productspecs = this.product.productspecs;
  }
  /**立即购买 */
  buynow(){ 
    if(this.storage.get("token")==null){
      var title="未登录";
      var content = "小主，去登陆吧？";
      var ass = "";
      var buttons = [{
      text:"取消",
      role:'cancle',
      handler:()=>{
        this.viewCrl.dismiss();
      }
    },{
      text:"确认",
      role:"destructive",
      handler:()=>{
        this.navCtrl.push(LoginPage,{history:'history'});
        this.viewCrl.dismiss();
      }
    }];
    this.alert.showMoreAlert(title,content,ass,buttons);
    }else{
      if(this.specId == null){
        this.alert.showAlert('未选择规格','',['ok']);
      }else{
        this.product.buynum = this.buyNumber;
        this.productArray.push(this.product);
        this.appCtrl.getRootNav().push("ConfirmOrderPage",{
          "product":this.productArray
        });
        this.viewCrl.dismiss();
      }
    }
  }
  /**点击空白销毁modal */
  dimiss(){
    this.viewCrl.dismiss();
  }
  /**数量减 */
  onMinus(){
    if(this.buyNumber>1){
      this.buyNumber--;
    }
  }
  /**数量+ */
  onAdd(){
    this.buyNumber++;
  }
  /**选择规格 */
  choiceSpec(specid){
    this.specId = specid;
    this.product.specId = specid;
    for(let i=0;i<this.productspecs.length;i++){
      if(this.productspecs[i].id==specid){
        this.product.specPrice = this.productspecs[i].price;
        this.price = this.productspecs[i].price;
        this.product.specElec = this.productspecs[i].elecNum;
        this.elec = this.productspecs[i].elecNum;
        this.product.specName = this.productspecs[i].specname;
      }
    }
  }
  /**加入购物车 */
  addCart(){
    if(this.storage.get("token")==null){
      var title="未登录";
      var content = "小主，去登陆吧？";
      var ass = "";
      var buttons = [{
      text:"取消",
      role:'cancle',
      handler:()=>{
        this.viewCrl.dismiss();
      }
    },{
      text:"确认",
      role:"destructive",
      handler:()=>{
        this.navCtrl.push(LoginPage,{history:'history'});
        this.viewCrl.dismiss();
      }
    }];
    this.alert.showMoreAlert(title,content,ass,buttons);
    }else{
      if(this.specId == null){
        this.alert.showAlert('未选择规格','',['ok']);
      }else{
        var api = 'v1/PersonalCenter/updateShoppingCartInfo/'+this.id+'/'+this.specId;
        var params = {
          "token":this.storage.get("token"),
          "productNum":this.buyNumber
        };
        this.httpservice.doFormPost(api,params,(data)=>{
          if(data.error_code==0){
            this.alert.showAlert("加入购物车成功","",['确定']);
            this.viewCrl.dismiss();
          }else if(data.error_code==3){
            this.rlogin.rLoginProcessWithHistory(this.navCtrl);
          }
        })
      }
    }
  }
}
