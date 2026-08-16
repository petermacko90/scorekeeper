import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorage {
  getLocalStorage(): Storage {
    return localStorage;
  }
}
