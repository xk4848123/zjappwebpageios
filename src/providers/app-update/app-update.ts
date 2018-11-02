import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AppVersion } from '@ionic-native/app-version';
import { LoadingController } from 'ionic-angular';
import { ToastProvider } from '../toast/toast';
import { HttpServicesProvider } from '../http-services/http-services';
declare let cordova;

/*
  Generated class for the AppUpdateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppUpdateProvider {

  private loading;

  constructor(private loadingCtrl: LoadingController, private httpService: HttpServicesProvider,
    private transfer: FileTransfer, private noticeSer: ToastProvider,private appVersion: AppVersion) {

  }
  presentProgress(present) {
    if (present == 100) {
      this.loading.dismiss();
      this.loading = null;
      return;
    }
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: '已下载：' + present + '%'
      });
      this.loading.present();
    }

    this.loading.data.content = '已下载：' + present + '%';
  }

  checkVersion():Promise<number>{
    return new Promise((resolve,reject)=>{
      let api = 'appNeedUpdate';
      let returnNumber = -100;
      this.appVersion.getVersionNumber().then((version: string)=>{
        this.httpService.requestData(api, (data) => {
          if (data.error_code == 0) {//请求成功
            returnNumber = 0;//可升级
          } else if (data.error_code == -1) {
            returnNumber = -1;//强制升级
          }
          else if(data.error_code == 1){
            returnNumber = 1;//可升级
          }else{
            returnNumber = 500;
          }
          if(returnNumber != -100){
            resolve(returnNumber);
          }else{
            reject(Error("发生错误"));
          }
        },{appCurrentVersion: version});
      });
    });
    //检查版本
  
    
  }

  download() {
    let fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.onProgress(progressEvent => {
      let present = new Number((progressEvent.loaded / progressEvent.total) * 100);
      let presentInt = present.toFixed(0);
      if (presentInt == "5" || presentInt == "20" || presentInt == "50" || presentInt == "98") {
        this.presentProgress(presentInt);
      }
    });
    let savePath = cordova.file.externalDataDirectory + 'zjapp.apk';
    let url = "https://appnew.zhongjianmall.com/apk/zjapp.apk";
    fileTransfer.download(encodeURI(url), savePath).then((entry) => {
      entry.file(data => {
        cordova.plugins.fileOpener2.open(savePath, data.type, {

          error: function (e) { alert('失败status:' + JSON.stringify(e) + " 路径：" + entry.toURL()) },
          success: function () { }

        });
      }, (error) => {
        this.noticeSer.showToast('操作提醒', '将存储权限打开后再进行升级，由此给您带来的不便，敬请谅解。');
      });
    });
  }
}
