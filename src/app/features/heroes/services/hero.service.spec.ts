import { RestService } from "src/app/core/services/rest.service";
import { HeroModelDTO, HeroService } from "./hero.service";

describe('HeroService', () => {

  let service: HeroService;
  let restServiceSpy: jasmine.SpyObj<RestService>;

  beforeEach(() => {
    restServiceSpy = jasmine.createSpyObj('RestService', ['get', 'post', 'put', 'delete']);
    service = new HeroService(restServiceSpy);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should resolve getting all', (done: DoneFn) => {
      restServiceSpy.get.and.returnValue(Promise.resolve([]));

      service.get().then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should resolve getting one', (done: DoneFn) => {
      restServiceSpy.get.and.returnValue(Promise.resolve([]));

      service.get(1).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      restServiceSpy.get.and.returnValue(Promise.reject(new Error));

      service.get().catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('push()', () => {
    it('should resolve', (done: DoneFn) => {
      restServiceSpy.post.and.returnValue(Promise.resolve([]));

      service.push(<HeroModelDTO>{}).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      restServiceSpy.post.and.returnValue(Promise.reject(new Error));

      service.push(<any>{}).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('update()', () => {
    it('should resolve', (done: DoneFn) => {
      restServiceSpy.put.and.returnValue(Promise.resolve());

      service.update(1, <HeroModelDTO>{}).then((response: any) => {
        expect(restServiceSpy.put).toHaveBeenCalled();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      restServiceSpy.put.and.returnValue(Promise.reject(new Error));

      service.update(1, <any>{}).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should resolve', (done: DoneFn) => {
      restServiceSpy.delete.and.returnValue(Promise.resolve());

      service.delete(1).then((response: any) => {
        expect(restServiceSpy.delete).toHaveBeenCalled();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      restServiceSpy.delete.and.returnValue(Promise.reject(new Error));

      service.delete(1).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });
});
