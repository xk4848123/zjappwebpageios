import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { ViewController,NavParams } from 'ionic-angular';
import { AppshareProvider } from '../../providers/appshare/appshare';
import { AlertProvider } from '../../providers/alert/alert';
/**
 * Generated class for the ShareComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'share',
  templateUrl: 'share.html'
})
export class ShareComponent {

  param: {
    title: string,
    description: string,
    link: string,
    image: string,
  };

  constructor(public viewCrl:ViewController,public navParams: NavParams,public appshare :AppshareProvider,public alert:AlertProvider) {
    if (this.navParams.get('param')) {
      this.param = this.navParams.get('param');
    }
  }
  dimiss(){
    this.viewCrl.dismiss();
  }
  /**分享 */
  share(num){
    if(num==1){
      this.appshare.wxShare(0,this.param.image,this.param.description,this.param.title,this.param.link);
    }else if(num==2){
      this.appshare.wxShare(1,this.param.image,this.param.description,this.param.title,this.param.link);
    }else{
      this.alert.showAlert('系统异常','',['ok']);
    }
  }
}
