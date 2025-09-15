import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private ENCRYPTION_KEY = CryptoJS.enc.Utf8.parse(CryptoJS.SHA256(environment.secretPWD).toString(CryptoJS.enc.Base64).substr(0, 32)); // Clave de 32 bytes
  private IV = CryptoJS.enc.Utf8.parse('1234567890123456'); // IV de 16 bytes

  constructor() { }

  // Método para encriptar un objeto
  encryptObject(obj: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), this.ENCRYPTION_KEY, {
      iv: this.IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    
    return encrypted;
  }

  // Método para desencriptar un objeto
  decryptObject(encryptedObj: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedObj, this.ENCRYPTION_KEY, {
      iv: this.IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  }
}
