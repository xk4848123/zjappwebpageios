import { Injectable } from '@angular/core';
import { App,NavController } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
/*
  Generated class for the JpushProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JpushProvider {

  public registrationId: string;

  devicePlatform: string;
  sequence: number = 0;

  constructor(private device: Device, private jpush: JPush) {
    this.devicePlatform = device.platform;
  }
  

  aliasResultHandler = function (result) {

  };

  errorHandler = function (err) {
  };

  jPushInit(app: App) {
    this.jpush.init();
    let nav = app.getActiveNav();
    document.addEventListener('jpush.openNotification', (event: any) => {
      let content;
      if (this.devicePlatform == 'Android') {
        content = event.extras["cn.jpush.android.EXTRA"].extKey;
      } else {  // iOS
        if (event.aps == undefined) { // 本地通知
          content = event.content;
        } else {  // APNS
          content = event.aps.alert;
        }    
      }
      this.jpush.setApplicationIconBadgeNumber(0);
      if (content == 'shareBenit') {
        nav.push('MoneyrecordPage', {
          type: 'elec'
        });
      }
    }, false);
  }

  getRegistrationID() {
    this.jpush.getRegistrationID()
      .then(rId => {
        this.registrationId = rId;
      })
      .catch(error => {
      });

  }
  setAlias(alias) {
    this.jpush.setAlias({ sequence: this.sequence++, alias: alias })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  getAlias() {
    this.jpush.getAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  deleteAlias() {
    this.jpush.deleteAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  addLocalNotification() {
    if (this.devicePlatform == 'Android') {
      this.jpush.addLocalNotification(0, 'Hello JPush', 'JPush', 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, 'Hello JPush', 1, 'localNoti1');
    }
  }

}
