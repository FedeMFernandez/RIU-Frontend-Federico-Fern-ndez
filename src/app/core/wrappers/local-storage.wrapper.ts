import { Injectable } from '@angular/core';
import { StorageAdapter } from '../adapters/storage.adapter';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageWrapper extends StorageAdapter {

  constructor () {
    super(localStorage);
  }
}
