import { Injectable } from '@angular/core';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  //localStorage

  set(key,value){

    localStorage.setItem(key,JSON.stringify(value));  /*对象转换成字符串*/
  }

  get(key){
    return JSON.parse(localStorage.getItem(key));   /*字符串转换成对象*/
  }
  remove(key){

    localStorage.removeItem(key);
  }

  setSessionStorage(key,value){

    sessionStorage.setItem(key,JSON.stringify(value));  /*对象转换成字符串*/

  }

  getSessionStorage(key){

    return JSON.parse(sessionStorage.getItem(key));   /*字符串转换成对象*/

  }
  removeSessionStorage(key){

    sessionStorage.removeItem(key);
    
  }

}
