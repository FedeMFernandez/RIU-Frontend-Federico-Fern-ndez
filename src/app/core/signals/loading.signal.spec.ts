import { LoadingSignal } from "./loading.signal";


describe('LoadingSignal', () => {

  let signal: LoadingSignal;

  beforeEach(() => {
    signal = new LoadingSignal();
  });

  it('should create', () => {
    expect(signal).toBeTruthy();
  });
});
