import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ConfigProvider } from '../../providers/config/config';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the CertificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-certification',
  templateUrl: 'certification.html',
})
export class CertificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private rlogin: RloginprocessProvider, private config: ConfigProvider,
    private el: ElementRef, private sanitizer: DomSanitizer, private re: Renderer2) {
  }

  tip: string;
  name: string;
  phoneNum: string;
  cardNo: string;
  photoOne: string;
  photoTwo: string;
  photoThree: string;
  type: number;

  strHTML: string = '';
  //限制上传
  canUpload: boolean = true;

  //预览
  tempPhoto1:string='';
  tempPhoto2:string='';
  tempPhoto3:string='';
  ionViewWillEnter() {
    this.initData();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.bindEvent();
    }, 200);
  }

  initData() {
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/PersonalCenter/GetCertificationInfo/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          if (tempData.IsAuth == 2) {
            this.type = 1;
            this.tip = "已通过实名认证";
            this.name = tempData.TrueName;
            this.phoneNum = tempData.Phone;
            this.cardNo = tempData.IDCardNo;
            this.photoOne = tempData.IDCardPhoto;
            this.photoTwo = tempData.IDCardPhoto2;
            this.photoThree = tempData.IDCardPhoto3;
          } else if (tempData.IsAuth == 0) {
            this.type = 2;
            this.tip = "请填写真实有效信息";
          } else if (tempData.IsAuth == -1) {
            this.type = 2;
            this.tip = "认证未通过，请重新填写";
          } else {
            this.type = 1;
            this.tip = "审核中，请耐心等待";
            this.name = tempData.TrueName;
            this.phoneNum = tempData.Phone;
            this.cardNo = tempData.IDCardNo;
            this.photoOne = tempData.IDCardPhoto;
            this.photoTwo = tempData.IDCardPhoto2;
            this.photoThree = tempData.IDCardPhoto3;
          }
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast(data.error_message);
        }
      });
    }
  }
  assembleHTML() {
    return this.sanitizer.bypassSecurityTrustHtml(this.strHTML);
  }


  upload() {
    if (this.canUpload) {
      let oFiles = this.el.nativeElement.querySelectorAll(".fileCss");
      let formData = new FormData();
      for (let i = 0, file; file = oFiles[i]; i++) {
        // 文件名称，文件对象   
        if (file.files[0] == null) {
          this.noticeSer.showToast('请三张一起上传，谢谢');
          return;
        }
        formData.append(file.name, file.files[0]);

      }
      //加上token
      let token = this.storage.get('token');
      formData.append('token', token);
      // 实例化一个AJAX对象
      var xhr = new XMLHttpRequest();
      xhr.onload = (data) => {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            let responseObj = JSON.parse(xhr.responseText);
            let i = 0;
            for (let item of responseObj.data) {
              if (i == 0) {
                this.photoOne = item;
              }
              if (i == 1) {
                this.photoTwo = item;
              }
              if (i == 2) {
                this.photoThree = item;
              }
              i++;
            }
            this.noticeSer.showToast("已上传，请进行申请");
            this.canUpload = false;
            //上传成功后显示图片
            this.strHTML = "<img src='" + this.config.domain + this.photoOne + "'/>" +
              "<img src='" + this.config.domain + this.photoTwo + "'/>" +
              "<img src='" + this.config.domain + this.photoThree + "'/>";
            //隐藏上传
            this.hideLabel();
            //清除预览
            let tempImg = this.el.nativeElement.querySelector("#tempImg");
            this.re.setStyle(tempImg,'display','none');
            this.tempPhoto1 = '';
            this.tempPhoto2 = '';
            this.tempPhoto3 = '';
            //展示重新上传按钮
            let reuploadButton = this.el.nativeElement.querySelector('.reupload');
            this.re.setStyle(reuploadButton, 'display', 'block');
            let loadButton = this.el.nativeElement.querySelector('.upload');
            this.re.setStyle(loadButton, 'display', 'none');
            setTimeout(() => {
              this.canUpload = true;
              this.el.nativeElement.querySelector('#progress').value = 0;
            }, 10000);

          }
        }
      }
      xhr.open("POST", this.config.apiUrl + "/v1/upload/batch", true);
      //进度条部分
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          var percentComplete = Math.round(evt.loaded * 100 / evt.total);
          this.el.nativeElement.querySelector('#progress').value = percentComplete;
        }
      }
      // 发送表单数据
      xhr.send(formData);
    } else {
      this.noticeSer.showToast('您刚刚传过一次，请稍后上传');
    }

  }

  hideLabel() {
    let labels = this.el.nativeElement.querySelectorAll('.btn-upload');
    for (let item of labels) {
      this.re.setStyle(item, 'display', 'none');
    }


  }
  showLabel() {
    let labels = this.el.nativeElement.querySelectorAll('.btn-upload');
    for (let item of labels) {
      this.re.setStyle(item, 'display', 'block');
    }
  }

  bindEvent() {
    let oFiles = this.el.nativeElement.querySelectorAll(".fileCss");
    for (let item of oFiles) {
      item.onchange = (e) => {
        let tempImg = this.el.nativeElement.querySelector("#tempImg");
        this.re.setStyle(tempImg,'display','block');
        console.log(e.target);
        let read = new FileReader();
        read.readAsDataURL(e.target.files[0]);
        read.onload=()=>{
          let url = read.result;
          if(e.target.id == 'fileOne'){
            this.tempPhoto1 = url.toString();
          }
          if(e.target.id == 'fileTwo'){
            this.tempPhoto2 = url.toString();
          }
          if(e.target.id == 'fileThree'){
            this.tempPhoto3 = url.toString();
          }
        }
        
      }
    }


  }
  reupload() {
    this.showLabel();
    this.strHTML = '';
    let reuploadButton = this.el.nativeElement.querySelector('.reupload');
    this.re.setStyle(reuploadButton, 'display', 'none');
    let loadButton = this.el.nativeElement.querySelector('.upload');
    this.re.setStyle(loadButton, 'display', 'block');

  }
  confirm() {
    if (!this.name) {
      this.noticeSer.showToast('姓名不可为空');
      return;
    }
    if (!this.phoneNum) {
      this.noticeSer.showToast('手机号不可为空');
      return;
    }
    if (!this.cardNo) {
      this.noticeSer.showToast('身份证号不可为空');
      return;
    }
    if (!this.photoOne) {
      this.noticeSer.showToast('请上传身份证，若已上传请耐心等待');
      return;
    }
    if (!this.photoTwo) {
      this.noticeSer.showToast('请上传身份证，若已上传请耐心等待');
      return;
    }
    if (!this.photoThree) {
      this.noticeSer.showToast('请上传身份证，若已上传请耐心等待');
      return;
    }
    let token = this.storage.get('token');
    let api = 'v1/PersonalCenter/PostCertificationInfo/' + token;
    this.httpService.doPost(api, {
      truename: this.name,
      phone: this.phoneNum,
      idcardno: this.cardNo,
      idcardphoto: this.photoOne,
      idcardphoto2: this.photoTwo,
      idcardphoto3: this.photoThree
    }, (data) => {
      if (data.error_code == 0) {//请求成功
        this.noticeSer.showToast('申请已提交，请耐心等待结果');
        this.navCtrl.pop();

      } else if (data.error_code == 3) {
        this.rlogin.rLoginProcessWithHistory(this.navCtrl);
      } else {
        this.noticeSer.showToast(data.error_message);
      }
    });
  }

}
