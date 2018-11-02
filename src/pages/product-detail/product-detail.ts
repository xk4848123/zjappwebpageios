import { Component,ElementRef,Renderer2,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,App,Content,ModalController, Modal,Slides } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { AlertProvider } from '../../providers/alert/alert';
import { DomSanitizer } from '@angular/platform-browser';/*转译html标签*/
import { ShareComponent } from '../../components/share/share';
import { CarModalComponent } from '../../components/car-modal/car-modal';
import { CarMemberComponent } from '../../components/car-member/car-member';
import { StorageProvider } from '../../providers/storage/storage';
import { CartPage } from '../../pages/cart/cart';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  public id :(number);
  public product :(any);
  public productText :(string);
  public focusList=[];  /*数组 轮播图*/
  public starList=[];/**星星个数 */
  public comment :(string);
  public commentDetail:(any);
  public beLongToVIP = false;
  public commentHeight:(number);
  public detailHeight:(number);
  public topHeight:(number);
  public username = "";
  public headPic = "";
  public sysId:(string);
  public usercode:(string);

  private modal:Modal;
  private isSetSlides = false;

  constructor(public rlogin:RloginprocessProvider,private renderer2: Renderer2,public eleref:ElementRef,
    public navCtrl: NavController, public navParams: NavParams,public httpService: HttpServicesProvider,public config:ConfigProvider,
    public alertProvider:AlertProvider,public sanitizer: DomSanitizer,public app:App,public storage:StorageProvider,private modalCtrl:ModalController) {
    this.id = this.navParams.get("id");
    this.usercode = this.getQueryString();
    if(this.id==undefined){
      this.id = this.storage.getSessionStorage("productId");
    }
    if(this.id==undefined){
      this.id = this.getQueryproductId();
    }
    if(this.usercode!=undefined){
      this.storage.setSessionStorage("usercode",this.usercode);
    }
    var api = "v1/PersonalCenter/GetPersonalInfo/"+this.storage.get("token");
    this.httpService.requestData(api,(data)=>{
      if(data.error_code==0){
        this.sysId = data.data.personDataMap.InviteCode;
      }
    })
  }
  ionViewDidLoad() {
      let footer = this.eleref.nativeElement.querySelector('.tfoot-left');
      let footerHeight = footer.offsetHeight;
      let buy = this.eleref.nativeElement.querySelector('.buy');
      let join = this.eleref.nativeElement.querySelector('.join');
      this.commentHeight = this.eleref.nativeElement.querySelector('.tcomment').offsetTop;
      this.detailHeight = this.eleref.nativeElement.querySelector('.tproductText').offsetTop;
      this.topHeight = this.eleref.nativeElement.querySelector('.t-title').offsetHeight;
      footerHeight = footerHeight+2;
      footerHeight = footerHeight+2;
      this.renderer2.setStyle(buy,'height',footerHeight+'px');
      this.renderer2.setStyle(join,'height',footerHeight+'px');
  }

  ionViewWillEnter(){
    this.starList = [];
    this.focusList = []; 
    this.getFocus();
    this.getPicText();
    this.setSlides();
  }
  ionViewWillLeave(){
    if(this.id!=undefined){
      this.storage.setSessionStorage("productId",this.id);
    }
  }
  setSlides(){
    if (this.slides) {
      if(!this.isSetSlides){
        this.slides.autoplayDisableOnInteraction = false;
        this.isSetSlides = true;
      }
    }else{
      setTimeout(() => {
        this.setSlides();
      }, 100);
    }
  }
  /**获取url中的父级邀请码 */
  getQueryString() {
    let qs = location.search.substr(1), // 获取url中"?"符后的字串  
      args = {}, // 保存参数数据的对象
      items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
      item = null,
      len = items.length;

    for (let i = 0; i < len; i++) {
      item = items[i].split("=");
      let name = decodeURIComponent(item[0]),
        value = decodeURIComponent(item[1]);
      if (name) {
        args[name] = value;
      }
      if(name==="usercode"){
        return args[name];
      }
    }
  }
  /**获取url中的productId */
  getQueryproductId() {
    let qs = location.search.substr(1), // 获取url中"?"符后的字串  
      args = {}, // 保存参数数据的对象
      items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
      item = null,
      len = items.length;

    for (let i = 0; i < len; i++) {
      item = items[i].split("=");
      let name = decodeURIComponent(item[0]),
        value = decodeURIComponent(item[1]);
      if (name) {
        args[name] = value;
      }
      if(name=="productId"){
        return args[name];
      }
    }
  }
   /**分享*/
   share(title,picurl){
     let url = '';
     if(this.sysId){
        url = this.config.apiUrl + "v2/wxshare/shareProduct?usercode="+this.sysId+"&productId="+this.id;
     }else{
        url = this.config.apiUrl + "v2/wxshare/shareProduct?&productId="+this.id;
     }
     this.modal = this.modalCtrl.create(ShareComponent, {
      param: {
        title: title,
        description: "快点带它回家",
        link: url,
        image: picurl,
      }
    }, {
        showBackdrop: true,
        enableBackdropDismiss: true
      });
    this.modal.present();
  }
  /**获取商品详情 */
  getFocus(){
    var api = "v1/ProductManager/getProductDetails";
    var param = {"productId":this.id};
    this.httpService.requestData(api,(data)=>{
      if(data.error_code!=0){
        this.alertProvider.showAlert('数据获取异常','',['ok']);
        return;
      }
      let shareDom = this.eleref.nativeElement.querySelector('.t-share');
      shareDom.onclick = (e) => {
        this.share(data.data.product.productname,"https://appnew.zhongjianmall.com"+data.data.product.productphotos[0].photo);
      }
      this.beLongToVIP = data.data.beLongToVIP;
      this.product = data.data.product;
      this.commentDetail = data.data.productComment;
      if(this.commentDetail==null){
        this.commentDetail={
          "id": -1,
          "createtime": "",
          "memo": "还没有人评价呢，快来评价吧！",
          "star": 0,
          "productCommentPhotos": []
        } 
      }else{
        if(this.commentDetail.user==null){
          this.username = "匿名用户";
        }else{
          this.username = this.commentDetail.user.truename;
          this.headPic = this.commentDetail.user.headphoto;
        }
      }
      this.comment = this.commentDetail.memo;
      if(this.comment.length>42){
        this.comment = this.comment.substring(0,41)+"...";
      }
      for(let i=0;i<this.commentDetail.star;i++){
        this.starList.push(1);
      }
      for(let i=0;i<data.data.product.productphotos.length;i++){
        this.focusList.push(data.data.product.productphotos[i].photo);
      }
    },param)
  }
  /**跳转评论页 */
  goevaluation(){
    this.navCtrl.push('ProductCommentPage',{
      "id":this.id
    });
  }
  /*获取图文详情*/
  getPicText(){
    var api =  "v1/ProductManager/getProductImgAndText";
    var param = {"productId":this.id};
    this.httpService.requestData(api,(data)=>{
      if(data.error_code!=0){
        this.alertProvider.showAlert('数据获取异常','',['ok']);
        return;
      }
      var reg = new RegExp("/upload","g");
      var reg1 = new RegExp("https://appnew.zhongjianmall.com/","g");
      this.productText = data.data.replace(reg1,'');
      this.productText = this.productText.replace(reg,this.config.domain+"/upload");
    },param)
  }
  /**转译html标签 */
  assembleHTML(strHTML:any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }
  /*客服 */
  goTel(){
    var title="客服电话";
    var content = "0571-57183790";
    var ass = "";
    var buttons = [{
      text:"取消",
      role:'cancle',
      handler:()=>{
       
      }
    },{
      text:"确认",
      role:"destructive",
      handler:()=>{
       window.location.href = "tel:"+content;
      }
    }];
    this.alertProvider.showMoreAlert(title,content,ass,buttons);
  }
  /**跳转购物车 */
  goShop(){
    this.navCtrl.push(CartPage,{
      "isIndex":false
    });
  }
  /**加入购物车 */
  joinShop(){
    if(this.beLongToVIP == false){
      this.alertProvider.showAlertM(CarModalComponent,{
        "product":this.product
      });
    }
  }
  /**立即购买 */
  goBuy(){
    if(this.beLongToVIP == false){
      this.alertProvider.showAlertM(CarModalComponent,{
        "product":this.product
      });
    }else{
      this.alertProvider.showAlertM(CarMemberComponent,{
        "product":this.product
      });
    }
  }
  choiceSpec(){
    if(this.beLongToVIP == false){
      this.alertProvider.showAlertM(CarModalComponent,{
        "product":this.product
      });
    }else{
      this.alertProvider.showAlertM(CarMemberComponent,{
        "product":this.product
      });
    }
  }
  /**跳转头部 */
  goProductDiv(){
      this.content.scrollTo(0, 0, 300);
  }
  /**跳转评价 */
  goCommentDiv(){
    this.content.scrollTo(0, this.commentHeight+this.topHeight, 300);
  }
  godetailDiv(){
  /**跳转详情 */
    this.content.scrollTo(0, this.detailHeight+this.topHeight, 300);
  }
}
