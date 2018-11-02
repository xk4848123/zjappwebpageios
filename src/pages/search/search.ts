import { Component,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { LoadingController,IonicPage, NavController, NavParams,Content,AlertController  } from 'ionic-angular';


import { ConfigProvider } from '../../providers/config/config';

import { HttpServicesProvider } from '../../providers/http-services/http-services';

import { StorageProvider } from '../../providers/storage/storage';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  //装饰器    this.content.scrollToTop();回到顶部

  @ViewChild(Content) content: Content;



  public flag=false;  /*有没有关键词、关键词开关*/

  public keywords='';  /*关键词*/

  public list=[];  /*模拟商品数据*/

  public page=1; /*分页*/

  // public hasData=true;  /*是否有数据*/

  public historyList=[]; /*历史记录的数据*/

  public priceFlag = false; /*价格排序方式，默认正序 */

  public elecFlag = false; /*积分排序方式，默认正序 */
  
  public selectTag = "sale";/**默认按销量排序 */

  constructor(public loadingCtrl: LoadingController,public ele:ElementRef,public render2:Renderer2,public navCtrl: NavController, public navParams: NavParams,public config:ConfigProvider,public httpService:HttpServicesProvider,public storage:StorageProvider,public alertCtrl: AlertController) {
      
    //获取历史记录
    this.getHistory();
  }

  ionViewDidLoad() {
   
  }


  getSearchList(infiniteScroll){
     var loading = this.loadingCtrl.create({ showBackdrop: false });
     loading.present();
     if(!infiniteScroll){  /*点击搜索按钮*/
        this.page=1;
        // this.hasData=true; 
        this.content.scrollToTop(0); /*回到顶部*/
        //调用保存历史记录的方法
        this.saveHistory();
     }
      var api='v1/ProductManager/searchProduct';
      var param = {"key":this.keywords,"type":1};
      this.httpService.doFormPost(api,param,(data)=>{
          if(this.page==1){  /*第一页 替换数据*/
            this.list=data.data;
            loading.dismiss();
          }else{
            this.list=this.list.concat(data.data);  /*拼接数据*/
            loading.dismiss();
          }         
          this.flag=true;  /*显示商品列表*/
          if(this.flag==true){
            let header = this.ele.nativeElement.querySelector('.tsearch');
            let headerHeight = header.offsetHeight;
            setTimeout(()=>{
              let sub = this.ele.nativeElement.querySelector('.sub_header');
              headerHeight = headerHeight+6;
              this.render2.setStyle(sub,"top",headerHeight+'px');
            },100)
          }
      })
  } 
  //按价格排序
  search_price(){
    this.content.scrollToTop(0); /*回到顶部*/
    var loading = this.loadingCtrl.create({ showBackdrop: false });
    loading.present();
    var api='v1/ProductManager/searchProduct';
    var tag :(number);
    if(this.priceFlag){
      tag = 3;
    }else{
      tag = 2;
    }
    var param = {"key":this.keywords,"type":tag};
    this.httpService.doFormPost(api,param,(data)=>{
        if(this.page==1){  /*第一页 替换数据*/
          this.list=data.data;   
          loading.dismiss();        
        }else{
          this.list=this.list.concat(data.data);  /*拼接数据*/
          loading.dismiss();
        }         
        this.flag=true;  /*显示商品列表*/
    })
    this.priceFlag = !this.priceFlag;
    this.elecFlag = false;
    this.selectTag = 'price';
  }
  //按销量排序
  search_sale(){
    this.content.scrollToTop(0); /*回到顶部*/
    var loading = this.loadingCtrl.create({ showBackdrop: false });
    loading.present();
    var api='v1/ProductManager/searchProduct';
    var param = {"key":this.keywords,"type":1};
    this.httpService.doFormPost(api,param,(data)=>{ 
        if(this.page==1){  /*第一页 替换数据*/
          this.list=data.data;
          loading.dismiss();
        }else{
          this.list=this.list.concat(data.data);  /*拼接数据*/
          loading.dismiss();
        }         
        this.flag=true;  /*显示商品列表*/
    })
    this.selectTag = "sale";
    this.elecFlag = false;
    this.priceFlag = false;
  }
  //按积分排序
  search_elec(){
    this.content.scrollToTop(0); /*回到顶部*/
    var loading = this.loadingCtrl.create({ showBackdrop: false });
    loading.present();
    var api='v1/ProductManager/searchProduct';
    var tag :(number);
    if(this.elecFlag){
      tag = 6;
    }else{
      tag = 5;
    }
    var param = {"key":this.keywords,"type":tag};
    this.httpService.doFormPost(api,param,(data)=>{
        if(this.page==1){  /*第一页 替换数据*/
          this.list=data.data;
          loading.dismiss();
        }else{
          this.list=this.list.concat(data.data);  /*拼接数据*/
          loading.dismiss();
        }         
        this.flag=true;  /*显示商品列表*/
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
  //点击历史记录执行的方法

  goSearch(keywords){
    this.keywords=keywords;
    this.getSearchList('');
  }

  //加载更多
  doLoadMore(infiniteScroll){
    
    this.getSearchList(infiniteScroll)

  }

  //保存历史记录

  saveHistory(){
    /*
      1.localStorage获取历史记录
    */ 

    var history=this.storage.get('historyData');

    //2.判断历史记录存在不存在
    if(history){ /*有*/
      if(history.indexOf(this.keywords)==-1 && this.keywords!='' && history.length<15){
        history.push(this.keywords);
        //重新写入
        this.storage.set('historyData',history);
      }else if(history.indexOf(this.keywords)==-1 && this.keywords!='' && history.length>=15){
        history.push(this.keywords);
        history.shift();
        this.storage.set('historyData',history);
      }
    }else{ /*以前没有*/
      if(this.keywords!=''){
        this.historyList.push(this.keywords);
        this.storage.set('historyData',this.historyList);
      }
    }

  }
  //获取历史记录

  getHistory(){

     var history=this.storage.get('historyData');
     if(history){  /*如果历史记录存在 把历史记录给数据*/
        this.historyList=history;
        console.log(history);
     }
  }
  //删除历史记录

  removeHistory(keywords){
    //提示
    let confirm = this.alertCtrl.create({
      title: '您确定要删除吗?',
      message: '您确定要删除这条历史记录吗，确定点击是，否则点击否。',
      buttons: [
        {
          text: '否',
          handler: () => {
           
          }
        },
        {
          text: '是',
          handler: () => {
           
              var index=this.historyList.indexOf(keywords);
              // console.log(index);

              this.historyList.splice(index,1);
              //写入到localstorage
              this.storage.set('historyData',this.historyList);
          }
        }
      ]
    });
    confirm.present();
  }
  /*清空历史记录*/
  localEmpty(){
    this.historyList.splice(0,this.historyList.length);
    this.storage.set('historyData',this.historyList);
  }
}
