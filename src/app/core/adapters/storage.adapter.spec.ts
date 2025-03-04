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

      expect(adapter.get<boolean>('not-null')).toBe(true);
    });

    it('should return error', () => {
      const spy = spyOn(Storage.prototype, 'getItem').and.callFake((key) =>
        key in mockStorage ? mockStorage[key] : null
      );

      try {
        expect(adapter.get('null'))
      } catch (error) {
        expect(error).toEqual(new Error("data is invalid or can't be converted to generic type"))
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
