import { of, throwError } from "rxjs";
import { RestService } from "./rest.service";

describe('RestService', () => {
  let service: RestService;
  let httpClientSpy: any;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new RestService(httpClientSpy);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should resolve', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(
        of({
          status: 200,
        })
      );

      service.get('heroes').then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject with error when trying to parse data as T', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(of(null));

      service.get('heroes').catch((error: any) => {
        expect(error).toBeInstanceOf(Error);
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(
        throwError(() => {
          return {
            status: 404,
          }
        })
      );

      service.get('heroes').catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('post()', () => {
    it('should resolve', (done: DoneFn) => {
      httpClientSpy.post.and.returnValue(
        of({
          status: 200,
        })
      );

      service.post('heroes', {}).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      httpClientSpy.post.and.returnValue(
        throwError(() => {
          return {
            status: 404,
          }
        })
      );

      service.post('heroes', {}).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('put()', () => {
    it('should resolve', (done: DoneFn) => {
      httpClientSpy.put.and.returnValue(
        of({
          status: 200,
        })
      );

      service.put('heroes/1', {}).then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      httpClientSpy.put.and.returnValue(
        throwError(() => {
          return {
            status: 404,
          }
        })
      );

      service.put('heroes/X', {}).catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should resolve', (done: DoneFn) => {
      httpClientSpy.delete.and.returnValue(
        of({
          status: 200,
        })
      );

      service.delete('heroes/1').then((response: any) => {
        expect(response).toBeTruthy();
        done();
      });
    });

    it('should reject', (done: DoneFn) => {
      httpClientSpy.delete.and.returnValue(
        throwError(() => {
          return {
            status: 404,
          }
        })
      );

      service.delete('heroes/X').catch((error: any) => {
        expect(error).toBeTruthy();
        done();
      });
    });
  });
});
