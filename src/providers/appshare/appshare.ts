// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController} from 'ionic-angular';

declare var Wechat;
@Injectable()
export class AppshareProvider {
  //标题
  title: string = "女装尖货 - 单件月销1.8万"
  //描述
  description: string = "行业精选女装 好货任你挑";
  //分享链接
  link: string = "http://dress.tongedev.cn";
  //分享图片
  image: string = "https://appnew.zhongjianmall.com/upload/pics/logo.png";

  constructor(public loadingCtrl: LoadingController) {
    
  }
  wxShare(scene,image,description,title,link) {
      this.image = image;
      this.title = title;
      this.link = link;
      this.description = description;
      let loading = this.loadingCtrl.create({ showBackdrop: false });
      loading.present();
      try {
          Wechat.share({
              message: {
                  title: this.title,
                  description: this.description,
                  thumb: this.image,
                  messageExt: "",  // 这是第三方带的测试字段
                  messageAction: "", // <action>dotalist</action>
                  media: {
                      type: Wechat.Type.WEBPAGE,
                      webpageUrl: this.link
                  }
              },
              scene: scene == 0 ? Wechat.Scene.SESSION : Wechat.Scene.TIMELINE,  // share to Timeline
          }, function () {

          }, function (reason) {
          });
      } catch (error) {
      } finally {
          loading.dismiss();
      }
  }
}
