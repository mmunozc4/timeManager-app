import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SecureStorage {
  private key = environment.cryptoKey;

  set<T>(k: string, value: T): void {
    const json = JSON.stringify(value);
    const ciphertext = CryptoJS.AES.encrypt(json, this.key).toString();
    localStorage.setItem(k, ciphertext);
  }

  get<T>(k: string): T | null {
    const ciphertext = localStorage.getItem(k);
    if (!ciphertext) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.key);
      const json = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  remove(k: string): void {
    localStorage.removeItem(k);
  }

  clear(): void {
    localStorage.clear();
  }

}
