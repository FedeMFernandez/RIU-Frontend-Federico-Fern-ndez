import { SessionStorageWrapper } from "./session-storage.wrapper";

describe('SessionStorageWrapper', () => {

  let wrapper!: SessionStorageWrapper;
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

      try {
        expect(wrapper.get('null'))
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
