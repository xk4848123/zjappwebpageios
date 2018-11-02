import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { WeblinkProvider } from '../../providers/weblink/weblink';
import { AppUpdateProvider } from '../../providers/app-update/app-update';
import { ToastProvider } from '../../providers/toast/toast';
import { AlertProvider } from '../../providers/alert/alert';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  public SetpaypasswordPage = 'SetpaypasswordPage';

  public UpdatepasswordPage = 'UpdatepasswordPage';

  public AddressPage = 'AddressPage';

  constructor(public navCtrl: NavController, private webLink: WeblinkProvider, public config: ConfigProvider,
    private appUpdateProvider: AppUpdateProvider, private noticeSer: ToastProvider, private alertProvider: AlertProvider) {

  }

  aboutUs() {
    this.webLink.goWeb(this.config.domain + '/html/sysaticle.html?id=2');
  }

  checkforUpdate() {
   this.appUpdateProvider.checkVersion().then((result) => {
      if (result == 0) {
        this.noticeSer.showToast("已经是最新版本");
      } else if (result == -1) {
        this.noticeSer.showToast("该版本已不可使用，必须升级");
        this.appUpdateProvider.download();
      } else if (result == 1) {
        this.alertProvider.showAlert('发现新版本，您要升级吗？', '', [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '升级',
            handler: () => {
            }
          }
        ]);
      } else {
        this.noticeSer.showToast("发生错误");
      }
    }, (err) => { this.noticeSer.showToast("发生错误") });
  }
}
