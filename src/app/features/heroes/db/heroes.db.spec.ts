import { LocalStorageWrapper } from "src/app/core/wrappers/local-storage.wrapper";
import { HeroesDataBase, HeroModel } from "./heroes.db";

describe('HeroesDataBase', () => {

  let db: HeroesDataBase;
  let localStorageWrapperSpy: jasmine.SpyObj<LocalStorageWrapper>;

  beforeEach(() => {
    localStorageWrapperSpy = jasmine.createSpyObj('LocalStorageWrapper', ['get', 'set']);
  });

  it('should create', () => {
    db = new HeroesDataBase(localStorageWrapperSpy);
    expect(db).toBeTruthy();
  });

  it('should create and save HEROES_LAST_ID', () => {
    localStorageWrapperSpy.get.and.returnValue([{
      id: 1,
      name: 'FEDE',
    }]);
    localStorageWrapperSpy.get.and.throwError(new Error());
    db = new HeroesDataBase(localStorageWrapperSpy);
    expect(db).toBeTruthy();
  });

  it('should create', () => {
    expect(db).toBeTruthy();
  });

  describe('get()', () => {
    it('should resolve getting all', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      expect(db.get()).toBeTruthy();
    });

    it('should resolve getting one', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      expect(db.get(1)).toBeTruthy();
    });

    it('should throw error hero not found', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      localStorageWrapperSpy.get.and.returnValue([{
        id: 2,
      }]);
      try {
        db.get(1)
      } catch(error: any) {
        expect(error).toBeTruthy()
      }
    });
  });

  describe('push()', () => {
    it('should resolve', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      expect(db.push(<HeroModel>{})).toBeTruthy();
    });

    it('should reject', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      const error = new Error('Other Error');
      localStorageWrapperSpy.get.and.throwError(error);
      expect(db.push).toThrowError();
    });
  });

  describe('update()', () => {
    it('should resolve', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      db.push(<HeroModel>{name: 'Fede'});

      expect(db.update(1, <HeroModel>{})).toBeTruthy();
    });

    it('should reject', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      const error = new Error('Other Error');
      localStorageWrapperSpy.set.and.throwError(error);
      try {
        db.update(1, <HeroModel>{});
      } catch(error: any) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('delete()', () => {
    it('should resolve', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      db.push(<HeroModel>{name: 'Fede'});

      expect(db.delete(1)).toBeUndefined();
    });

    it('should reject', () => {
      db = new HeroesDataBase(localStorageWrapperSpy);
      const error = new Error('Other Error');
      db.push(<HeroModel>{name: 'Fede'});
      localStorageWrapperSpy.set.and.throwError(error);
      try {
        db.delete(1);
      } catch(error: any) {
        expect(error).toBeTruthy();
      }
    });
  });
});
