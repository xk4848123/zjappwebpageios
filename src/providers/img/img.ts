import { Injectable } from "@angular/core";
import { ActionSheetController } from "ionic-angular";

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { ToastProvider } from "../toast/toast";

@Injectable()
export class ImgProvider {

    // 调用相机时传入的参数
    private cameraOpt = {
        quality: 50,
        destinationType: 1, // Camera.DestinationType.FILE_URI,
        sourceType: 1, // Camera.PictureSourceType.CAMERA,
        encodingType: 0, // Camera.EncodingType.JPEG,
        mediaType: 0, // Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    };

    // 调用相册时传入的参数
    private imagePickerOpt = {
        maximumImagesCount: 1,//选择一张图片
        width: 800,
        height: 800,
        quality: 80
    };

    // 图片上传的的api
    public uploadApi: string;

    public upload: any = {
        fileKey: 'file',//接收图片时的key
        fileName: 'imageName.jpg',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'//不加入 发生错误！！
        },
        params: {}, //需要额外上传的参数
        success: (data) => { },//图片上传成功后的回调
        error: (err) => { },//图片上传失败后的回调
        listen: () => { }//监听上传过程
    };

    constructor(private actionSheetCtrl: ActionSheetController,
        private noticeSer: ToastProvider,
        private camera: Camera,
        private imagePicker: ImagePicker,
        private transfer: FileTransfer,
        private fileTransfer: FileTransferObject) {

        this.fileTransfer = this.transfer.create();
    }


    showPicActionSheet() {
        this.useASComponent();
    }

    // 使用ionic中的ActionSheet组件
    private useASComponent() {
        let actionSheet = this.actionSheetCtrl.create({
            title: '上传图片',
            cssClass: 'global-action-sheet',
            buttons: [
              {
                text: '拍照',
                role: 'destructive',
                cssClass: 'global-zm-action-button',
                handler: () => {
                    this.startCamera();
                }
              },{
                text: '从相册中选择',
                cssClass: 'global-zm-action-button',
                handler: () => {
                    this.openImgPicker();
                }
              },{
                text: '取消',
                role: 'cancel',
                cssClass: 'global-zm-action-button',
                handler: () => {
                }
              }
            ]
        });
        actionSheet.present();
    }
    // 启动拍照功能
    private startCamera() {
        this.camera.getPicture(this.cameraOpt).then((imageData) => {
            this.uploadImg(imageData);
        }, (err) => {
            this.noticeSer.showToast('无法使用拍照功能');//错误：无法使用拍照功能！
        });
    }

    // 打开手机相册
    private openImgPicker() {
        let temp = '';
        this.imagePicker.getPictures(this.imagePickerOpt)
            .then((results) => {
                for (var i = 0; i < results.length; i++) {
                    temp = results[i];
                }

                this.uploadImg(temp);

            }, (err) => {
                this.noticeSer.showToast('无法选择图片');//错误：无法从手机相册中选择图片！
            });
    }


    // 上传图片
    private uploadImg(path: string) {
        if (!path) {
            return;
        }

        let options: any;
        options = {
            fileKey: this.upload.fileKey,
            headers: this.upload.headers,
            params: this.upload.params
        };
        this.fileTransfer.upload(path, this.uploadApi, options)
            .then((data) => {

                if (this.upload.success) {
                    this.upload.success(JSON.parse(data.response));
                }

            }, (err) => {
                if (this.upload.error) {
                    this.upload.error(err);
                } else {
                    this.noticeSer.showToast('错误：上传失败！');
                }
            });
    }

    // 停止上传
    stopUpload() {
        if (this.fileTransfer) {
            this.fileTransfer.abort();
        }
    }
}