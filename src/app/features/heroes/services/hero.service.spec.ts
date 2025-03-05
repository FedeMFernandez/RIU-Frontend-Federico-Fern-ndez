import { HeroesErrors } from './../constants/errors.constants';
import { RestMock } from "src/app/mocks/rest.mock";
import { HeroModelDTO, HeroService } from "./hero.service";
import { LocalStorageWrapper } from "src/app/core/wrappers/local-storage.wrapper";
import { fakeAsync } from "@angular/core/testing";

describe('HeroService', () => {

  let service: HeroService;
  let restMockSpy: jasmine.SpyObj<RestMock>;
  let localStorageWrapperSpy: jasmine.SpyObj<LocalStorageWrapper>;

  beforeEach(() => {
    restMockSpy = jasmine.createSpyObj('RestMock', ['fakeQuery']);
    localStorageWrapperSpy = jasmine.createSpyObj('LocalStorageWrapper', ['get', 'set', 'remove']);
    localStorageWrapperSpy.get.and.throwError(new Error());
    service = new HeroService(restMockSpy, localStorageWrapperSpy);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should resolve getting all', (done: DoneFn) => {
      localStorageWrapperSpy.get.and.returnValue([]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.get().then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should resolve getting one', (done: DoneFn) => {
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.get(1).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should throw error hero not found', async () => {
      localStorageWrapperSpy.get.and.returnValue([{
        id: 2,
      }]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      await expectAsync(service.get(1)).toBeRejected();
    });

    it('should reject', async () => {
      const expectedError = HeroesErrors.HERO_NOT_FOUND;
      localStorageWrapperSpy.get.and.returnValue([]);
      restMockSpy.fakeQuery.and.throwError(expectedError(1));
      await expectAsync(service.get(1)).toBeRejected();
    });
  });

  describe('push()', () => {
    it('should resolve', (done: DoneFn) => {
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.push(<HeroModelDTO>{}).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      const expectedError = new Error('Other Error');
      localStorageWrapperSpy.get.and.returnValue([]);
      restMockSpy.fakeQuery.and.throwError(expectedError);

      service.push(<any>{}).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('update()', () => {
    it('should resolve', (done: DoneFn) => {
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.update(1, <HeroModelDTO>{}).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      const expectedError = new Error('Other Error');
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
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
      const expectedError = HeroesErrors.HERO_NOT_FOUND;
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());

      service.delete(1).then((response: any) => {
        expect(restMockSpy.fakeQuery).toHaveBeenCalled();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      const expectedError = new Error('Other Error');
      localStorageWrapperSpy.get.and.returnValue([{
        id: 1,
      }]);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      restMockSpy.fakeQuery.and.throwError(expectedError);

      service.delete(1).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });
});
