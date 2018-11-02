import { Component,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
@IonicPage()
@Component({
  selector: 'page-members-product',
  templateUrl: 'members-product.html',
})
export class MembersProductPage {
  @ViewChild(Content) content: Content;
  public list=[];  /*模拟商品数据*/

  public page=0; /*分页*/

  public priceFlag = false; /*价格排序方式，默认正序 */

  public elecFlag = false; /*积分排序方式，默认正序 */
  
  public selectTag = "sale";/**默认按销量排序 */

  public enable = true;
  
  public tag = 1;

  public infiniteScroll:(any);
  constructor(public httpService:HttpServicesProvider,public config:ConfigProvider,public ele:ElementRef,public render2:Renderer2,public navCtrl: NavController, public navParams: NavParams) {
    this.getProductList('');
  }

  ionViewDidLoad() {
    let header = this.ele.nativeElement.querySelector('.title');
    let headerHeight = header.offsetHeight;
    setTimeout(()=>{
      let sub = this.ele.nativeElement.querySelector('.sub_header');
      this.render2.setStyle(sub,"top",headerHeight+'px');
    },100);
  }
  getProductList(infiniteScroll){
    var api = 'v1/HomePage/MemberArea';
    var params={
      "type":this.tag,
      "page":this.page,
      "pageNum":6
    }
    this.httpService.requestData(api,(data)=>{
      console.log(data);
      if(this.page==0){  /*第一页 替换数据*/
        this.list=data.data;
      }else{
        this.list=this.list.concat(data.data);  /*拼接数据*/
      } 
      if(infiniteScroll){
        //告诉ionic 请求数据完成
        infiniteScroll.complete();
        if(data.data.length<=0){ /*没有数据停止上拉更新*/
          infiniteScroll.enable(false);
        }
      };
      this.page++;
    },params)
  }
   //按价格排序
   search_price(){
    this.page = 1;
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.content.scrollToTop(0); /*回到顶部*/
    var api = 'v1/HomePage/MemberArea';
    var tag :(number);
    if(this.priceFlag){
      tag = 3;
    }else{
      tag = 2;
    }
    var param = {
      "page":0,
      "pageNum":6,
      "type":tag
    };
    this.httpService.requestData(api,(data)=>{
        this.tag = tag;
        this.list=data.data;                   
    },param)
    this.priceFlag = !this.priceFlag;
    this.elecFlag = false;
    this.selectTag = 'price';
  }
   //按销量排序
   search_sale(){
    this.page = 1;
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.content.scrollToTop(0); /*回到顶部*/
    var api = 'v1/HomePage/MemberArea';
    var param = {
      "page":0,
      "pageNum":6,
      "type":1
    };
    this.httpService.requestData(api,(data)=>{
      this.list=data.data;           
      this.tag = 1;
    },param)
    this.selectTag = "sale";
    this.elecFlag = false;
    this.priceFlag = false;
  }
  //按积分排序
  search_elec(){
    this.page = 1;
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.content.scrollToTop(0); /*回到顶部*/
    var api = 'v1/HomePage/MemberArea';
    var tag :(number);
    if(this.elecFlag){
      tag = 6;
    }else{
      tag = 5;
    }
    var param = {
      "page":0,
      "pageNum":6,
      "type":tag
    };
    this.httpService.requestData(api,(data)=>{
      this.list=data.data;           
      this.tag = tag;
    },param)
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
  //加载更多
  doLoadMore(infiniteScroll){
    setTimeout(() => {
      this.getProductList(infiniteScroll);
      infiniteScroll.complete();
      infiniteScroll.enable(this.enable);
      this.infiniteScroll = infiniteScroll;
    }, 1000);
  }
}
