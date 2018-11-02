import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {

  public ProductlistPage='ProductlistPage';  /*商品列表页面*/

  public tempDatas=[]; 

  public leftCate=[];  /*左侧分类数据*/

  public rightCate=[];  /*右侧分类数据*/

  public leftId: (any);/**点击左侧分类，默认为0 */

  constructor(public storage:StorageProvider,public navCtrl: NavController,public config:ConfigProvider,public httpService:HttpServicesProvider) {
    
  }

  ionViewWillEnter(){
    this.getLeftCateData();/*左侧分类*/ 
  }

  //左侧分类的方法
  getLeftCateData(){
    let api='v1/ProductManager/getProductOfCategory';
    //网络接口请求
    this.httpService.requestData(api,(data)=>{
        this.leftCate=data.data;
        for(let index=0; index < data.data.length  ; index ++){
          this.tempDatas[data.data[index].id]=data.data[index].productSubCategories;
        }
        if(this.leftId==null){
          this.getRightCateData(data.data[0].id);
        }else{
          this.getRightCateData(this.leftId);
        }
    });
  }

  getRightCateData(id){
    this.leftId=id;
    this.rightCate=this.tempDatas[id];
  }
  goSearch(){
    this.navCtrl.push('SearchPage');
  }
}






