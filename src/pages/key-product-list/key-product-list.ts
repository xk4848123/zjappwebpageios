import { Component,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';

import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-key-product-list',
  templateUrl: 'key-product-list.html',
})
export class KeyProductListPage {
  @ViewChild(Content) content: Content;

  public list=[];  /*模拟商品数据*/

  public priceFlag = false; /*价格排序方式，默认正序 */

  public elecFlag = false; /*积分排序方式，默认正序 */
  
  public selectTag = "sale";/**默认按销量排序 */
  
  public tag = 1;

  public keywords:(string);/**分类名 */
  constructor(public storage:StorageProvider, public ele:ElementRef,public render2:Renderer2,public navCtrl: NavController, public config:ConfigProvider,public navParams: NavParams,public httpService:HttpServicesProvider) {
    //获取传值
    this.keywords = this.navParams.get('keywords');
    if(this.keywords!=undefined){
      storage.setSessionStorage("keywords",this.keywords);
    }
    if(this.keywords==undefined){
      this.keywords = this.storage.getSessionStorage("keywords");
    }
    this.getProductList();
}

ionViewDidLoad() {
  let header = this.ele.nativeElement.querySelector('.title');
  let headerHeight = header.offsetHeight;
  setTimeout(()=>{
    let sub = this.ele.nativeElement.querySelector('.sub_header');
    this.render2.setStyle(sub,"top",headerHeight+'px');
  },100);
}
getProductList(){
  var api = 'v1/ProductManager/searchProduct';
  var params={
    "key":this.keywords,
    "type":this.tag
  }
  this.httpService.doFormPost(api,params,(data)=>{
    this.list=data.data;
  })
}
//按价格排序
search_price(){
  this.content.scrollToTop(0); /*回到顶部*/
  var api = 'v1/ProductManager/searchProduct';
  var tag :(number);
  if(this.priceFlag){
    tag = 3;
  }else{
    tag = 2;
  }
  var param = {
    "key":this.keywords,
    "type":tag
  };
  this.httpService.doFormPost(api,param,(data)=>{
      this.tag = tag;
      this.list=data.data;                   
  })
  this.priceFlag = !this.priceFlag;
  this.elecFlag = false;
  this.selectTag = 'price';
}
//按销量排序
search_sale(){
  this.content.scrollToTop(0); /*回到顶部*/
  var api = 'v1/ProductManager/searchProduct';
  var param = {
    "key":this.keywords,
    "type":1
  };
  this.httpService.doFormPost(api,param,(data)=>{
    this.list=data.data;           
    this.tag = 1;
  })
  this.selectTag = "sale";
  this.elecFlag = false;
  this.priceFlag = false;
}
 //按积分排序
 search_elec(){
  this.content.scrollToTop(0); /*回到顶部*/
  var api = 'v1/ProductManager/searchProduct';
  var tag :(number);
  if(this.elecFlag){
    tag = 6;
  }else{
    tag = 5;
  }
  var param = {
    "key":this.keywords,
    "type":tag
  };
  this.httpService.doFormPost(api,param,(data)=>{
    this.list=data.data;           
    this.tag = tag;
  })
  this.elecFlag = !this.elecFlag;
  this.priceFlag = false;
  this.selectTag = 'elec';
}
 //跳转详情页
 goProduct(id){
  this.navCtrl.push('ProductDetailPage',{
    id : id
  });
}
}
