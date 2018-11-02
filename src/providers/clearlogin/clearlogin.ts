import { Injectable } from '@angular/core';
import { StorageProvider } from '../../providers/storage/storage';
import { JpushProvider } from '../../providers/jpush/jpush';

/*
  Generated class for the ClearloginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClearloginProvider {

  constructor(public storage: StorageProvider,public jpush:JpushProvider) {
  }

  public release() {
    //清除极光alias
    this.jpush.deleteAlias();
    this.storage.remove('token');
    this.storage.remove('userInfo');
  }
}
