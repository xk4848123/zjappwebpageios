///<reference path="../../services/user_defined.d.ts"/>
import { Component, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { ShareComponent } from '../../components/share/share';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../../providers/config/config';
@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  public username: (string);
  public sysId: (any);
  public headpic: (string);
  public codeWidth: (number);
  public code: (any);

  private modal:Modal;
  constructor(public config: ConfigProvider, public rlogin: RloginprocessProvider, public toast: ToastProvider, public storage: StorageProvider, public httpservice: HttpServicesProvider, public navCtrl: NavController,
    public navParams: NavParams, public rend: Renderer2, public ele: ElementRef,private modalCtrl:ModalController) {

  }
  ionViewDidLoad() {
    let card = this.ele.nativeElement.querySelector('.inGround');
    let top = this.ele.nativeElement.querySelector('.tcontent');
    let cardHeight = card.offsetHeight;
    cardHeight = cardHeight * 0.05;
    this.rend.setStyle(top, 'padding-top', cardHeight + 'px');
    let img = this.ele.nativeElement.querySelector('.headimg');
    let imgHeight = img.offsetHeight;
    imgHeight = imgHeight / 2;
    this.rend.setStyle(top, 'line-height', imgHeight + 'px');
    this.code = document.getElementById("code");
    this.codeWidth = this.code.offsetWidth;
    this.codeWidth = this.codeWidth * 0.5438;
    this.loadContent();
  }
  loadContent() {
    var api = "v1/PersonalCenter/GetPersonalInfo/" + this.storage.get("token");
    this.httpservice.requestData(api, (data) => {
      if (data.error_code == 0) {
        this.username = data.data.personDataMap.UserName;
        this.sysId = data.data.personDataMap.InviteCode;
        this.headpic = data.data.personDataMap.HeadPhoto;
        var content = "https://appnew.zhongjianmall.com/zjapp/wechat/transfer.html?usercode=" + this.sysId;
        setTimeout(() => {
          global_wxFunciton.global_createCard(this.code, this.codeWidth, this.codeWidth, content);
        }, 10);
      } else if (data.error_code == 3) {
        this.rlogin.rLoginProcessWithHistory(this.navCtrl);
      } else {
        this.toast.showToast(data.error_message);
      }
    });
  }
  share() {
    this.modal = this.modalCtrl.create(ShareComponent, {
      param: {
        title: "众健商城",
        description: "买得到的健康,看得见的品质",
        link: "https://appnew.zhongjianmall.com/zjapp/wechat/transfer.html?usercode=" + this.sysId,
        image: 'https://appnew.zhongjianmall.com/upload/pics/logo.png',
      }
    }, {
        showBackdrop: true,
        enableBackdropDismiss: true
      });
    this.modal.present();
  }
}
