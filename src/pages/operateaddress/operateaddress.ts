import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { AddressmodelComponent } from '../../components/addressmodel/addressmodel';
import { StorageProvider } from '../../providers/storage/storage';
import { ToastProvider } from '../../providers/toast/toast';
import { AlertProvider } from '../../providers/alert/alert';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { RloginprocessProvider } from '../../providers/rloginprocess/rloginprocess';


/**
 * Generated class for the OperateaddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-operateaddress',
  templateUrl: 'operateaddress.html',
})
export class OperateaddressPage {

  title: string;
  type: number;

  name: string;
  phoneNum: string;
  addressDetail: string;
  address: string;
  isDefault: boolean = false;

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


  modal: Modal;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private noticeSer: ToastProvider,
    private storage: StorageProvider, private httpService: HttpServicesProvider, private rlogin: RloginprocessProvider, private alert: AlertProvider) {

  }

  ionViewWillEnter() {
    if (this.navParams.get('id')) {
      this.title = '编辑地址';
      this.type = 1;
      this.initData(this.navParams.get('id'));
    } else {
      this.title = '添加新地址';
      this.type = 2;
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
  initData(id) {
    let token = this.storage.get('token');
    if (token) {
      let api = 'v1/AddressManager/getAddressOfUserById/' + token + '/' + id;
      this.httpService.requestData(api, (data) => {
        if (data.error_code == 0) {//请求成功
          let tempData = data.data;
          this.name = tempData.Name;
          this.phoneNum = tempData.Phone;
          this.addressDetail = tempData.DetailAddress;
          this.address = tempData.ProvinceName + ' ' + tempData.CityName + ' ' + tempData.RegionName;
          //
          this.addressModal.provinceId = tempData.ProvinceId;
          this.addressModal.cityId = tempData.CityId;
          this.addressModal.regionId = tempData.RegionId;
          this.addressModal.provinceName = tempData.ProvinceName;
          this.addressModal.cityName = tempData.CityName;
          this.addressModal.regionName = tempData.RegionName;
          this.isDefault = tempData.IsDefault;
        } else if (data.error_code == 3) {//token过期
          this.rlogin.rLoginProcessWithHistory(this.navCtrl);
        }
        else {
          this.noticeSer.showToast(data.error_message);
        }
      });
    }
  }

  save() {
    if (!this.name) {
      this.noticeSer.showToast('姓名不可为空');
      return;
    }
    if (!this.phoneNum) {
      this.noticeSer.showToast('手机号不可为空');
      return;
    }
    if (!this.addressModal.provinceId) {
      this.noticeSer.showToast('地区请选择完整');
      return;
    }
    if (!this.addressModal.cityId) {
      this.noticeSer.showToast('地区请选择完整');
      return;
    }
    if (!this.addressModal.regionId) {
      this.noticeSer.showToast('地区请选择完整');
      return;
    }
    if (!this.addressDetail) {
      this.noticeSer.showToast('请输入详细地址');
      return;
    }
    let token = this.storage.get('token');
    let isDefault = 0;
    if (this.isDefault) {
      isDefault = 1;
    }
    if (token) {

      if (this.type == 2) {
        let api = 'v1/AddressManager/addAddressByUser';
        this.httpService.doPost(api, {
          token: token,
          ProvinceId: this.addressModal.provinceId,
          CityId: this.addressModal.cityId,
          RegionId: this.addressModal.regionId,
          DetailAddress: this.addressDetail,
          Name: this.name,
          Phone: this.phoneNum,
          IsDefault: isDefault
        }, (data) => {
          if (data.error_code == 0) {//请求成功
            this.noticeSer.showToast('保存成功');
            this.navCtrl.pop();
          } else if (data.error_code == 3) {
            this.rlogin.rLoginProcessWithHistory(this.navCtrl);
          } else {
            this.noticeSer.showToast(data.error_message);
          }
        });
      } else {

        let api = 'v1/AddressManager/updateAddressById';
        this.httpService.doPost(api, {
          token: token,
          Id: this.navParams.get('id'),
          ProvinceId: this.addressModal.provinceId,
          CityId: this.addressModal.cityId,
          RegionId: this.addressModal.regionId,
          DetailAddress: this.addressDetail,
          Name: this.name,
          Phone: this.phoneNum,
          IsDefault: isDefault
        }, (data) => {
          if (data.error_code == 0) {//请求成功
            this.noticeSer.showToast('保存成功');
            this.navCtrl.pop();
          } else if (data.error_code == 3) {
            this.rlogin.rLoginProcessWithHistory(this.navCtrl);
          } else {
            this.noticeSer.showToast(data.error_message);
          }
        });


      }

    }
  }

  delAddress() {

    if (this.type == 1) {

      let token = this.storage.get('token');
      if (token) {
        this.alert.showAlert('你确定要删除该地址吗', '', [
          {
            text: '关闭',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {

              let api = 'v1/AddressManager/deleteAddressById';
              this.httpService.doPost(api, {
                token: token,
                id: this.navParams.get('id')
              }, (data) => {
                if (data.error_code == 0) {//请求成功
                  this.noticeSer.showToast('删除成功');
                  this.navCtrl.pop();
                } else if (data.error_code == 3) {
                  this.rlogin.rLoginProcessWithHistory(this.navCtrl);
                } else {
                  this.noticeSer.showToast(data.error_message);
                }
              });
            }
          }
        ]);

      }
    }
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