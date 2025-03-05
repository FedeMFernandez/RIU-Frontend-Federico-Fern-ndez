import { RestMock } from "src/app/mocks/rest.mock";
import { LoadingSignal } from "../core/signals/loading.signal";

describe('RestMock', () => {

  let mock: RestMock;
  let loadingSignalSpy: LoadingSignal;

  beforeEach(() => {
    loadingSignalSpy = new LoadingSignal();
    mock = new RestMock(loadingSignalSpy);
  });

  it('should create', () => {
    expect(mock).toBeTruthy();
  });

  it('should resolve', async () => {
    const func = () => {
      return Promise.resolve(true);
    }
    const response = await mock.fakeQuery(func, 300);
    expect(response).toEqual(true);
  });

  it('should reject to thrown error', async () => {
    const error = new Error('Error on fakeQuery');
    const func = () => {
      throw error;
    }
    try {
      await mock.fakeQuery(func, 300);
    } catch(error: any) {
      expect(error).toEqual(error);
    }
  });
});
