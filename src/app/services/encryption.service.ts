import { Injectable } from '@angular/core';
import CryptoES from 'crypto-es';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  private encryptionKey = environment.encryptionKey; 

  encrypt(data: any): string {
    const encryptedData = CryptoES.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    return encodeURIComponent(encryptedData);
  }

  decrypt(encryptedData: string): any {
    const decryptedData = CryptoES.AES.decrypt(encryptedData, this.encryptionKey).toString(CryptoES.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}
