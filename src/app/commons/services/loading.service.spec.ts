import { LoadingService } from "./loading.service";

describe('LoadingService', () => {

  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to loading', (done: DoneFn) => {
    let loading = false;
    const subscription = service.loading.subscribe((value: boolean) => {
      loading = value;
      expect(loading).toBeTrue();
      subscription.unsubscribe();
      done();
    })
    service.loading = true;
  });

});
