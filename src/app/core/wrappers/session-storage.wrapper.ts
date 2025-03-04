import { Injectable } from '@angular/core';
import { StorageAdapter } from '../adapters/storage.adapter';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageWrapper extends StorageAdapter {

  constructor () {
    super(sessionStorage);
  }
}
