import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setStorage(key: any, value: any, expireInSec: any = '') {
    let expirationTime = expireInSec
      ? new Date().getTime() + 1000 * expireInSec
      : '';
    let newValue = {
      value: value,
      expirationTime: expirationTime,
    };
    sessionStorage.setItem(key, JSON.stringify(newValue));
  }

  getStorage(key: any) {
    let stringValue = sessionStorage.getItem(key);
    if (stringValue !== null) {
      let value = JSON.parse(stringValue);
      if (
        value.expirationTime > new Date().getTime() ||
        value.expirationTime == ''
      ) {
        return value.value;
      } else {
        sessionStorage.removeItem(key);
      }
    }
    return null;
  }

  getStorageWithoutExpire(key: any) {
    let stringValue = sessionStorage.getItem(key);
    if (stringValue !== null) {
      let value = JSON.parse(stringValue);
        return value;
    }
    return null;
  }
}
