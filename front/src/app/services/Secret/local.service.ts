import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  // Secure storage using sessionStorage
  private secureStorage: Storage = sessionStorage;

  // Set the json data to local 
  setJsonValue(key: string, value: any) {
    this.secureStorage.setItem(key, JSON.stringify(value));
  }

  // Get the json value from local 
  getJsonValue(key: string) {
    const storedValue = this.secureStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }

  // Clear the local 
  clearToken() {
    this.secureStorage.clear();
  }
}
