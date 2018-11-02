import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert'
import { ClearloginProvider } from '../../providers/clearlogin/clearlogin'
import { LoginPage } from '../../pages/login/login';
/*
  Generated class for the RloginprocessProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RloginprocessProvider {

  constructor(private  alertProvider:AlertProvider,private clearLogin:ClearloginProvider) {
  }

  rLoginProcess(navCtrl:NavController){
            this.clearLogin.release();

            this.alertProvider.showAlert('您的账号在别处登录啦~', '', [
              {
                text: '关闭',
                handler: () => {
                }
              },
              {
                text: '登录',
                handler: () => {
                  navCtrl.push(LoginPage);
                }
              }
            ]);
  }
  rLoginProcessWithHistory(navCtrl:NavController){
    this.clearLogin.release();

    this.alertProvider.showAlert('您的账号在别处登录啦~', '', [
      {
        text: '关闭',
        handler: () => {
        }
      },
      {
        text: '登录',
        handler: () => {
          navCtrl.push(LoginPage,{history:'history'});
        }
      }
    ]);
}

}
