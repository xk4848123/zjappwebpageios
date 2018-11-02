import { Component } from '@angular/core';
import { LoadingController,IonicPage, NavController, NavParams } from 'ionic-angular';
import {StorageProvider} from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
@IonicPage()
@Component({
  selector: 'page-product-comment',
  templateUrl: 'product-comment.html',
})
export class ProductCommentPage {
  public id:(any);
  public commentArray = new Array();
  public page = 0;
  public pageNum = 6;
  public type="all";
  public hasComment = false;
  public infiniteScroll:(any);
  public enable = true;
  constructor(public loadingCtrl: LoadingController,public httpservice:HttpServicesProvider,public config :ConfigProvider,public storage:StorageProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get("id");
    if(this.id==null){
      this.id = storage.getSessionStorage("productcommentId");
    }
    storage.setSessionStorage("productcommentId",this.id);
  }

  ionViewDidLoad() {
    
  }
  ionViewWillEnter(){
    this.getComment('');
  }
  getComment(infiniteScroll){
    var loading = this.loadingCtrl.create({ showBackdrop: false });
    loading.present();
    var api = "v1/ProductManager/getProductCommentById";
    var params = {
      "productId":this.id,
      "page":this.page,
      "pageNum":this.pageNum,
      "type":this.type
    }
    this.httpservice.requestData(api,(data)=>{
      if(data.error_code==0){
        loading.dismiss();
        if(this.page==0){ /*第一页 替换数据*/
          this.commentArray=data.data.productComments;
        }else{
          this.commentArray=this.commentArray.concat(data.data.productComments);  /*拼接数据*/
        } 
        if(this.commentArray.length>0){
          this.hasComment = true;
        }else{
          this.hasComment = false;
        }
      }
      if(infiniteScroll){
        //告诉ionic 请求数据完成
        infiniteScroll.complete();
        if(data.data.productComments.length<=0){ /*没有数据停止上拉更新*/
          infiniteScroll.enable(false);
        }
      };
      this.page++;
    },params);
  }
  goall(){
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.page = 0;
    this.type = "all";
    this.getComment('');
  }
  gopic(){
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.page = 0;
    this.type = "withpicture";
    this.getComment('');
  }
  gogood(){
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.page = 0;
    this.type = "good";
    this.getComment('');
  }
  gososo(){
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.page = 0;
    this.type = "medium";
    this.getComment('');
  }
  gobad(){
    if(this.infiniteScroll!=undefined){
      this.infiniteScroll.enable(true);
    }
    this.page = 0;
    this.type = "bad";
    this.getComment('');
  }
  //加载更多
  doLoadMore(infiniteScroll){
    setTimeout(() => {
      this.getComment(infiniteScroll);
      infiniteScroll.complete();
      infiniteScroll.enable(this.enable);
      this.infiniteScroll = infiniteScroll;
    }, 1000);
  }
}
