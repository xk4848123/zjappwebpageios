import { Injectable } from '@angular/core';

import { Http, Jsonp, Headers} from "@angular/http";

import 'rxjs/add/operator/map';

//配置文件
import { ConfigProvider } from '../../providers/config/config';
import { ToastProvider } from '../../providers/toast/toast';


@Injectable()
export class HttpServicesProvider {

  //设置post的格式
  private josonHeaders = new Headers({ 'Content-Type': 'application/json' });


  constructor(public http: Http, public jsonp: Jsonp, public config: ConfigProvider, public noticeSer: ToastProvider) {
    console.log('Hello HttpServicesProvider Provider');
  }

  //get请求数据
  requestData(apiUrl, callback, json?) {
    let api = '';
    if (json) {
      let params = Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
      }).join("&");
      api = this.config.apiUrl + apiUrl + '?' + params;
    } else {
      api = this.config.apiUrl + apiUrl;
    }
    this.http.get(api).subscribe(
      data => {
        callback(data.json());        /*回调函数*/
      },
      err => {
        this.noticeSer.showToast('服务器异常');
      });
  }

  //post 提交数据
  doPost(apiUrl, json, callback) {
    let api = this.config.apiUrl + apiUrl;
    this.http.post(api, JSON.stringify(json), { headers: this.josonHeaders }).subscribe(
      res => {
        callback(res.json());
      },
      err => {
        this.noticeSer.showToast('服务器异常');
      });
  }

  doFormPost(apiUrl, json, callback) {
    let params = Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    }).join("&");
    let api = this.config.apiUrl + apiUrl + '?' + params;
    console.log(api);
    this.http.post(api, null).subscribe(
      res => {
        callback(res.json());
      },
      err => {
        this.noticeSer.showToast('服务器异常');
      });
  }
}
