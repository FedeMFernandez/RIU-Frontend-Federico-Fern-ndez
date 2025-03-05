import { fakeAsync } from "@angular/core/testing";
import { StorageAdapter } from "./storage.adapter";

describe('StorageAdapter', () => {

  let adapter!: StorageAdapter;
  let mockStorage: {
    [key: string]: string,
  } = {
    'not-null': 'true',
  };

  beforeEach(() => {
    adapter = new StorageAdapter(localStorage);
  });

  it('should create', () => {
    expect(adapter).toBeTruthy();
  });

  describe('get()', () => {
    it('should return value', () => {
      spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      const response = adapter.get('not-null');
      expect(response).toBeTruthy();
    });

    it('should throw key error', () => {
      try {
        adapter.get('')
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should throw parse error', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('|');
      try {
        adapter.get('null')
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return null', () => {
      spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      try {
        adapter.get('null')
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('set()', () => {
    it('should set value on storage', () => {
      const spy = spyOn(Storage.prototype, 'setItem').and.callFake((key, value) =>
        mockStorage[key] = value
      );

      adapter.set('not-null', 'true');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove value of storage', () => {
      const spy = spyOn(Storage.prototype, 'removeItem').and.callFake((key) => { });

      adapter.remove('not-null');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clear()', () => {
    it('should remove value of storage', () => {
      const spy = spyOn(Storage.prototype, 'clear').and.returnValue();

      adapter.clear();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('length()', () => {
    it('should remove value of storage', () => {
      const spy = spyOnProperty(Storage.prototype, 'length', 'get').and.callThrough();

      adapter.length();
      expect(spy).toHaveBeenCalled();
    });
  });
});
