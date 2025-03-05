import { RestMock } from "src/app/mocks/rest.mock";
import { HeroService } from './hero.service';
import { HeroesDataBase, HeroModel } from '../db/heroes.db';
import { HeroesErrors } from "../constants/errors.constants";

describe('HeroService', () => {

  let service: HeroService;
  let restMockSpy: jasmine.SpyObj<RestMock>;
  let heroDataBase: jasmine.SpyObj<HeroesDataBase>;

  beforeEach(() => {
    restMockSpy = jasmine.createSpyObj('RestMock', ['fakeQuery']);
    heroDataBase = jasmine.createSpyObj('HeroesDataBase', ['get', 'push', 'update', 'delete']);
    heroDataBase.get.and.throwError(new Error());
    service = new HeroService(restMockSpy, heroDataBase);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should resolve getting all', () => {
      heroDataBase.get.and.returnValue([]);
      expect(service.get()).toBeTruthy();
    });

    it('should throw error hero not found', () => {
      heroDataBase.get.and.returnValue([{
        id: 2,
      } as any]);
      expect(service.get).toThrowError();
    });
  });

  describe('push()', () => {
    it('should resolve', () => {
      heroDataBase.get.and.returnValue([{
        id: 1,
      } as any]);
      heroDataBase.push.and.returnValue({
        id: 1,
      } as any);

      expect(service.push(<HeroModel>{})).toBeTruthy();
    });

    it('should reject', () => {
      heroDataBase.get.and.returnValue([]);
      heroDataBase.push.and.throwError(new Error());
      expect(service.push).toThrowError();
    });
  });

  describe('update()', () => {
    it('should resolve', (done: DoneFn) => {
      heroDataBase.get.and.returnValue([{
        id: 1,
      } as any]);
      heroDataBase.update.and.returnValue({
        id: 1,
      } as any);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.update(1, <HeroModel>{}).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      const expectedError = new Error('Other Error');
      heroDataBase.get.and.returnValue([{
        id: 1,
      } as any]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      restMockSpy.fakeQuery.and.throwError(expectedError);

      service.update(1, <any>{}).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should resolve', (done: DoneFn) => {
      heroDataBase.get.and.returnValue([{
        id: 1,
      } as any]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.delete(1).then((response: any) => {
        expect(response).toBeUndefined();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      const expectedError = new Error('Other Error');
      heroDataBase.get.and.returnValue([{
        id: 1,
      } as any]);
      restMockSpy.fakeQuery.and.throwError(expectedError);

      service.delete(1).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });
});
