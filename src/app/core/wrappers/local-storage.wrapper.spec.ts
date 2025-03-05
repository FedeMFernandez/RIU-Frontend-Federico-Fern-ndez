import { StorageAdapter } from "../adapters/storage.adapter";
import { LocalStorageWrapper } from "./local-storage.wrapper";

describe('StorageAdapter', () => {

  let wrapper!: StorageAdapter;
  let mockStorage: {
    [key: string]: string,
  } = {
    'not-null': 'true',
  };

  beforeEach(() => {
    wrapper = new LocalStorageWrapper();
  });

  it('should create', () => {
    expect(wrapper).toBeTruthy();
  });

  describe('get()', () => {
    it('should return value', () => {
      spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      const response = wrapper.get('not-null');
      expect(response).toBeTruthy();
    });

    it('should throw key error', () => {
      try {
        wrapper.get('')
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should throw parse error', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('|');
      try {
        wrapper.get('null')
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return null', () => {
      spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      try {
        wrapper.get('null')
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

      wrapper.set('not-null', 'true');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove value of storage', () => {
      const spy = spyOn(Storage.prototype, 'removeItem').and.callFake((key) => { });

      wrapper.remove('not-null');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clear()', () => {
    it('should remove value of storage', () => {
      const spy = spyOn(Storage.prototype, 'clear').and.returnValue();

      wrapper.clear();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('length()', () => {
    it('should remove value of storage', () => {
      const spy = spyOnProperty(Storage.prototype, 'length', 'get').and.callThrough();

      wrapper.length();
      expect(spy).toHaveBeenCalled();
    });
  });
});
