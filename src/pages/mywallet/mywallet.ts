import { Component, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
/**
 * Generated class for the MywalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mywallet',
  templateUrl: 'mywallet.html',
})
export class MywalletPage {

  public RechargePage = 'RechargePage';
  public WithdrawPage = 'WithdrawPage';
  public UpdaterankPage ='UpdaterankPage';
  public myHome = TabsPage;
  public userInfo = '';
  public imgs = {
    img1: '',
    img2: 'assets/imgs/quasiagency_gold_dark.png',
    img3: 'assets/imgs/vip_gold_dark.png',
    img4: 'assets/imgs/partner_gold_dark.png',
    img5: 'assets/imgs/agent_gold_dark.png'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private el: ElementRef,
    private renderer2: Renderer2, private storage: StorageProvider, private noticeSer: ToastProvider,
    private httpService: HttpServicesProvider, private rlogin: RloginprocessProvider) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MywalletPage');
    //把图标居中
    let templateDiv = this.el.nativeElement.querySelector('#templateDiv');
    //剩余空间宽段
    let remianWidth = screen.width - templateDiv.offsetWidth * 5;

    //小球宽度
    let smallBallWidth = templateDiv.offsetWidth
    //两边宽度
    let rimWidth = remianWidth * 0.2;
    //间隙宽度
    let intervalWidth = remianWidth * 0.15;
    let img_div_one = this.el.nativeElement.querySelector('.rank_parent_div > .img_div:first-child');
    let img_div_two = this.el.nativeElement.querySelector('.rank_parent_div > .img_div:nth-child(3)');
    let img_div_three = this.el.nativeElement.querySelector('.rank_parent_div > .img_div:nth-child(5)');
    let img_div_four = this.el.nativeElement.querySelector('.rank_parent_div > .img_div:nth-child(7)');
    let img_div_five = this.el.nativeElement.querySelector('.rank_parent_div > .img_div:nth-child(9)');
    let width_one = rimWidth;
    let width_two = width_one + smallBallWidth + intervalWidth;
    let width_three = width_two + smallBallWidth + intervalWidth;
    let width_four = width_three + smallBallWidth + intervalWidth;
    let width_five = width_four + smallBallWidth + intervalWidth;
    this.renderer2.setStyle(img_div_one, 'left', width_one + 2 + 'px');
    this.renderer2.setStyle(img_div_two, 'left', width_two + 'px');
    this.renderer2.setStyle(img_div_three, 'left', width_three + 'px');
    this.renderer2.setStyle(img_div_four, 'left', width_four + 'px');
    this.renderer2.setStyle(img_div_five, 'left', width_five + 'px');
    //把线给居中
    let line_div_arrays = this.el.nativeElement.querySelectorAll('.update_line');
    let line_one_left = rimWidth + smallBallWidth;
    let line_tow_left = line_one_left + intervalWidth + smallBallWidth;
    let line_three_left = line_tow_left + intervalWidth + smallBallWidth;
    let line_four_left = line_three_left + intervalWidth + smallBallWidth;
    this.renderer2.setStyle(line_div_arrays[0], 'left', line_one_left + 4 + 'px');
    this.renderer2.setStyle(line_div_arrays[1], 'left', line_tow_left + 4 + 'px');
    this.renderer2.setStyle(line_div_arrays[2], 'left', line_three_left + 4 + 'px');
    this.renderer2.setStyle(line_div_arrays[3], 'left', line_four_left + 4 + 'px');
    this.renderer2.setStyle(line_div_arrays[0], 'top', smallBallWidth * 17 / 10 + 'px');
    this.renderer2.setStyle(line_div_arrays[1], 'top', smallBallWidth * 17 / 10 + 'px');
    this.renderer2.setStyle(line_div_arrays[2], 'top', smallBallWidth * 17 / 10 + 'px');
    this.renderer2.setStyle(line_div_arrays[3], 'top', smallBallWidth * 17 / 10 + 'px');
    this.renderer2.setStyle(line_div_arrays[0], 'width', intervalWidth - 8 + 'px');
    this.renderer2.setStyle(line_div_arrays[1], 'width', intervalWidth - 8 + 'px');
    this.renderer2.setStyle(line_div_arrays[2], 'width', intervalWidth - 8 + 'px');
    this.renderer2.setStyle(line_div_arrays[3], 'width', intervalWidth - 8 + 'px');
    let rank_parent_div = this.el.nativeElement.querySelector('.rank_parent_div');
    this.renderer2.setStyle(rank_parent_div, 'padding-top', smallBallWidth * 1.2 + 'px');
    //图标居中
    let treasureImgDivArrays = this.el.nativeElement.querySelectorAll('#treasure .treasure_img_div');
    let treasureImgDIvParent = this.el.nativeElement.querySelector('#treasure .treasure_img_div_parent');
    let iconWidth = treasureImgDivArrays[0].offsetWidth;
    let treasureImgDIvInterval = (treasureImgDIvParent.offsetWidth - iconWidth * 4) / 5
    // 计算出图标left
    let treasureImgOneLeft = treasureImgDIvInterval;
    let treasureImgTwoLeft = treasureImgOneLeft + treasureImgDivArrays[0].offsetWidth + treasureImgDIvInterval;
    let treasureImgThreeLeft = treasureImgTwoLeft + treasureImgDivArrays[0].offsetWidth + treasureImgDIvInterval;
    let treasureImgFourLeft = treasureImgThreeLeft + treasureImgDivArrays[0].offsetWidth + treasureImgDIvInterval;
    this.renderer2.setStyle(treasureImgDivArrays[0], 'left', treasureImgOneLeft + 'px');
    this.renderer2.setStyle(treasureImgDivArrays[1], 'left', treasureImgTwoLeft + 'px');
    this.renderer2.setStyle(treasureImgDivArrays[2], 'left', treasureImgThreeLeft + 'px');
    this.renderer2.setStyle(treasureImgDivArrays[3], 'left', treasureImgFourLeft + 'px');
    // 自动拓展
    let mygoldDiv = this.el.nativeElement.querySelector('.mygold');
    let goldOriginalHeight = mygoldDiv.offsetHeight;
    let expandHeight = goldOriginalHeight + 99 + 'px';
    this.renderer2.setStyle(mygoldDiv, 'height', expandHeight);

  }

  ionViewWillEnter() {
    this.initData();
  }

  initData() {
    //请求数据
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/initPersonalWallet/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          this.userInfo = data.data;
          //等级设置
          //如果lev为0
          if (this.userInfo['personDataMap'].Lev == 0) {
            if (this.userInfo['isGCmember']) {
              //99会员
              this.imgs.img1 = 'assets/imgs/free.png';
              this.imgs.img2 = 'assets/imgs/quasiagency_gold.png';
            } else {
              //免费会员
              this.imgs.img1 = 'assets/imgs/free.png';
            }
            //如果lev为1
          } else if (this.userInfo['personDataMap'].Lev == 1) {
            this.imgs.img1 = 'assets/imgs/free.png';
            this.imgs.img2 = 'assets/imgs/quasiagency_gold.png';
            this.imgs.img3 = 'assets/imgs/vip_gold.png';
            //如果lev为2
          } else if (this.userInfo['personDataMap'].Lev == 2) {
            if (this.userInfo['personDataMap'].IsSubProxy == 1) {
              //准代理
              this.imgs.img1 = 'assets/imgs/free.png';
              this.imgs.img2 = 'assets/imgs/quasiagency_gold.png';
              this.imgs.img3 = 'assets/imgs/vip_gold.png';
              this.imgs.img4 = 'assets/imgs/partner_gold.png';
            } else {
              //VIP
              this.imgs.img1 = 'assets/imgs/free.png';
              this.imgs.img2 = 'assets/imgs/quasiagency_gold.png';
              this.imgs.img3 = 'assets/imgs/vip_gold.png';
            }

          } else {
            //代理
            this.imgs.img1 = 'assets/imgs/free.png';
            this.imgs.img2 = 'assets/imgs/quasiagency_gold.png';
            this.imgs.img3 = 'assets/imgs/vip_gold.png';
            this.imgs.img4 = 'assets/imgs/partner_gold.png';
            this.imgs.img5 = 'assets/imgs/agent_gold.png';
          }
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast('数据获取异常：' + data.error_message);
        }
      });
    }
  }
  viewLog(type){
    this.navCtrl.push('MoneyrecordPage',{
      type:type
    });
  }

  viewSplit(){
    this.navCtrl.push('SplitinitPage');
  }

  transferElec(){
    this.navCtrl.push('ElectransferPage');
  }
 
}
