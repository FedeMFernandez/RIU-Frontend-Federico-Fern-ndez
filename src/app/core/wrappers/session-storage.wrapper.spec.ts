import { SessionStorageWrapper } from "./session-storage.wrapper";
import { StorageAdapter } from "../adapters/storage.adapter";

describe('SessionStorageWrapper', () => {

  let wrapper!: StorageAdapter;
  let mockStorage: {
    [key: string]: string,
  } = {
    'not-null': 'true',
  };

  beforeEach(() => {
    wrapper = new SessionStorageWrapper();
  });

  it('should create', () => {
    expect(wrapper).toBeTruthy();
  });

  describe('get()', () => {
    it('should return value', () => {
      spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      expect(wrapper.get('not-null')).toBe('true');
    });

    it('should return error', () => {
      spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      expect(wrapper.get).toThrowError();
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
});
