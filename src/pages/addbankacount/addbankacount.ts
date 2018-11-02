import { Component, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigProvider } from '../../providers/config/config';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';

/**
 * Generated class for the AddbankacountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addbankacount',
  templateUrl: 'addbankacount.html',
})
export class AddbankacountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider, private noticeSer: ToastProvider,
     private sanitizer: DomSanitizer, private config: ConfigProvider, private el: ElementRef,private renderer2: Renderer2,private storage: StorageProvider,
    private rclogin:RloginprocessProvider) {
    this.init();

  }

  private bankArray=[];
  private strHTML: string = '';
  public name:string;
  public bankacount:number;
  public bankinfo:string;
  public selectInfo;
  init() {
    let apiUrl = 'v1/AccountManager/AccountManager/GetAllBank';
    this.httpService.requestData(
      apiUrl,
      (res) => {
        if (res.error_code == 0) {
          let dataLength = res.data.length;
          this.bankArray = res.data;
          for (let index = 0; index < dataLength; index++) {
            let logo = res.data[index].logo;
            let bankname = res.data[index].bankname;
            if (index == dataLength - 1) {
              this.strHTML += '<div class="card-line-head">' +
                '<img  src="' + this.config.domain + logo + '"><span class="head-span">' + bankname + '</span><span style="display: none">' + index + '</span></div></div>';
            } else {
              this.strHTML += '<div class="card-line-head">' +
                '<img  src="' + this.config.domain + logo + '"><span class="head-span">' + bankname + '</span><span style="display: none">' + index + '</span></div><div class="line-div"></div>';
            }
          }
        } else {
          this.noticeSer.showToast('服务异常');
        }
      });

  }
  assembleHTML(strHTML: any) {
    return this.sanitizer.bypassSecurityTrustHtml(this.strHTML);
  }

  bindEvent(div) {
    div.onclick = (e)=>{
      let index: number;//选择的银行数组下标
      let clickEle = e.target;
      let clickCss = clickEle.className;
      if (clickCss == 'card-line-head') {
        index = clickEle.lastChild.innerHTML;
      } else if (clickCss == 'line-div') {
        index = clickEle.previousElementSibling.lastChild.innerHTML;
      } else {
        index = clickEle.parentNode.lastChild.innerHTML;
      }
     //填充div银行信息
      this.selectInfo=this.bankArray[index];
      this.closeSelect();
    }

  }


  ionViewDidEnter(){
    //初始化时移动div到屏幕最下边
    let cardDiv = this.el.nativeElement.querySelector('.card-div');
    // let leftSet = screen.width - cardDiv.offsetWidth;
    // console.log(leftSet);
    // this.renderer2.setStyle(cardDiv, 'left', leftSet + 'px');
    // this.renderer2.setStyle(cardDiv, 'bottom', 0);
    this.bindEvent(cardDiv);
  }

  selectBank() {
    let cardDiv = this.el.nativeElement.querySelector('.card-div');
    let hidebg = this.el.nativeElement.querySelector('#hidebg');
    let ionList = this.el.nativeElement.querySelector('ion-list');
    this.renderer2.setStyle(hidebg, 'display', 'block');
    this.renderer2.setStyle(cardDiv, 'display', 'block');
    let leftSet = (screen.width - cardDiv.offsetWidth)/2;
    let topSet = ionList.offsetHeight;
    let originalHeight = cardDiv.offsetHeight;
    this.renderer2.setStyle(cardDiv, 'left', leftSet + 'px');
    this.renderer2.setStyle(cardDiv, 'top', topSet-20 + 'px');
    this.renderer2.setStyle(cardDiv, 'height', originalHeight + 'px');
  }
  closeSelect(){
    let cardDiv = this.el.nativeElement.querySelector('.card-div');
    let hidebg = this.el.nativeElement.querySelector('#hidebg');
    this.renderer2.setStyle(cardDiv, 'display', 'none');
    this.renderer2.setStyle(hidebg, 'display', 'none');
  }

  confirm(){
    if(!this.name){
      this.noticeSer.showToast('请输入姓名');
      return;
    }
    if(!this.bankacount){
      this.noticeSer.showToast('请输入卡号');
      return;
    }
    if(!this.selectInfo){
      this.noticeSer.showToast('请选择银行');
      return;
    }
    if(!this.bankinfo){
      this.noticeSer.showToast('请填写支行信息');
      return;
    }
     let token = this.storage.get('token');
     let api = 'v1/AccountManager/AccountManager/AddBankAccount/' + token;
     this.httpService.doFormPost(
       api
       ,{
        account: this.bankacount,
        bankName: this.selectInfo.bankname,
        bankInfo: this.bankinfo,
        bankLogo: this.selectInfo.logo,
        name: this.name
       },
      (res)=>{
        if (res.error_code == 0) {
          this.noticeSer.showToast('添加成功');
          this.navCtrl.pop();
        } else if (res.error_code == 3) {
          //抢登处理
          this.rclogin.rLoginProcess(this.navCtrl);
        } else {
          this.noticeSer.showToast('服务异常');
        }
      });

  }
}
