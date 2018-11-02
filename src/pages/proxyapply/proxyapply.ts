import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';
import { ConfigProvider } from '../../providers/config/config';
import { DomSanitizer } from '@angular/platform-browser';
import { AddressmodelComponent } from '../../components/addressmodel/addressmodel';
/**
 * Generated class for the CertificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-proxyapply',
  templateUrl: 'proxyapply.html',
})
export class ProxyapplyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpServicesProvider,
    private storage: StorageProvider, private noticeSer: ToastProvider, private rlogin: RloginprocessProvider, private config: ConfigProvider,
    private el: ElementRef, private sanitizer: DomSanitizer, private re: Renderer2, private modalCtrl: ModalController) {
  }



  tip: string;
  name: string;
  phoneNum: string;
  photoOne: string;
  photoTwo: string;
  photoThree: string;
  addressDetail: string;
  address: string;
  type: number;

  modal: Modal;
  //传到modal的已填地址
  addressModal: {
    provinceId: number,
    cityId: number,
    regionId: number,
    provinceName: string,
    cityName: string,
    regionName: string
  } = {
      provinceId: 0,
      cityId: 0,
      regionId: 0,
      provinceName: '',
      cityName: '',
      regionName: ''
    };

  strHTML: string = '';
  //限制上传
  canUpload: boolean = true;

  //预览
  tempPhoto1: string = '';
  tempPhoto2: string = '';
  tempPhoto3: string = '';
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
      let api = 'v1/MemberShip/initProxyApply/' + token;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          if (tempData.CurStatus == 0) {
            this.type = 1;
            this.tip = "代理申请审核中";
            this.name = tempData.Name;
            this.phoneNum = tempData.Phone;
            this.photoOne = tempData.Photo1;
            this.photoTwo = tempData.Photo2;
            this.photoThree = tempData.Photo3;
            this.address = tempData.ProvinceName + ' ' + tempData.CityName + ' ' + tempData.RegionName;
            this.addressDetail = tempData.Address;
          } else if (tempData.CurStatus == 1) {
            this.type = 1;
            this.tip = "代理申请审核通过";
            this.name = tempData.Name;
            this.phoneNum = tempData.Phone;
            this.photoOne = tempData.Photo1;
            this.photoTwo = tempData.Photo2;
            this.photoThree = tempData.Photo3;
            this.address = tempData.ProvinceName + ' ' + tempData.CityName + ' ' + tempData.RegionName;
            this.addressDetail = tempData.Address;
          } else if (tempData.CurStatus == -1) {
            this.type = 2;
            this.tip = "审核未通过,理由:" + tempData.RefuseReason;
          }
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else if (data.error_code == -1) {
          this.type = 3;
          this.tip = "填写真实代理申请资料";
        } else {
          this.noticeSer.showToast(data.error_message);
        }
      });
    }
  }
  chooseAddress() {
    this.modal = this.modalCtrl.create(AddressmodelComponent, {
      addressModal: this.addressModal
    }, {
        showBackdrop: true,
        enableBackdropDismiss: true
      });
    this.modal.onDidDismiss(data => {
      if (data.type == 1) {

      } else {
        this.addressModal = data.callbackData;
        this.address = this.addressModal.provinceName + ' ' + this.addressModal.cityName + ' ' + this.addressModal.regionName;
      }

    })
    this.modal.present();

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
            this.re.setStyle(tempImg, 'display', 'none');
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
        this.re.setStyle(tempImg, 'display', 'block');
        console.log(e.target);
        let read = new FileReader();
        read.readAsDataURL(e.target.files[0]);
        read.onload = () => {
          let url = read.result;
          if (e.target.id == 'fileOne') {
            this.tempPhoto1 = url.toString();
          }
          if (e.target.id == 'fileTwo') {
            this.tempPhoto2 = url.toString();
          }
          if (e.target.id == 'fileThree') {
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
    if (!this.addressModal.provinceId) {
      this.noticeSer.showToast('请选择省');
      return;
    }
    if (!this.addressModal.cityId) {
      this.noticeSer.showToast('请选择市');
      return;
    }
    if (!this.addressModal.regionId) {
      this.noticeSer.showToast('请选择区');
      return;
    }
    if (!this.addressDetail) {
      this.noticeSer.showToast('详细地址不可为空');
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
    let api = '';
    if (this.type == 3) {
       api = 'v1/MemberShip/addProxyApply/' + token;
    }else if(this.type == 2){
      api = 'v1/MemberShip/updateProxyApply/' + token;
    }else{
      this.noticeSer.showToast('非法提交');
      return;
    }
      this.httpService.doPost(api, {
        name: this.name,
        phone: this.phoneNum,
        provinceid: this.addressModal.provinceId,
        cityid: this.addressModal.cityId,
        regionid: this.addressModal.regionId,
        address: this.addressDetail,
        photo1: this.photoOne,
        photo2: this.photoTwo,
        photo3: this.photoThree
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

  ionViewWillLeave() {
    if (this.modal) {
      this.modal.dismiss({ type: 1 });
    } else {
      setTimeout(() => {
        if (this.modal) {
          this.modal.dismiss({ type: 1 });
        }
      }, 1000);
    }
  }
}
