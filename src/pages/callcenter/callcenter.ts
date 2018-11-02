import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WeblinkProvider } from '../../providers/weblink/weblink';
import { ConfigProvider } from '../../providers/config/config';
/**
 * Generated class for the CallcenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-callcenter',
  templateUrl: 'callcenter.html',
})
export class CallcenterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private webLink:WeblinkProvider,
              private config: ConfigProvider) {
  }

  webUrl(title){
    if(title == 'rule'){
      this.webLink.goWeb(this.config.domain + '/html/sysaticle.html?id=3');
    }
    if(title == 'ensure'){
      this.webLink.goWeb(this.config.domain + '/html/sysaticle.html?id=4');
    }
  }

  dialing(){
    
    window.location.href= 'tel:0571-57183790';
  }

  advice(){
     
  }
}
