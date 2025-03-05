import { threadSleep } from "./thread-sleep.function";

describe('threadSleep', () => {
  it('debe esperar el tiempo especificado antes de resolverse', async () => {
    const start = Date.now();
    const delay = 500;

    await threadSleep(delay);

    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(delay);
  });

  it('debe devolver una Promise que se resuelve', async () => {
    await expectAsync(threadSleep(300)).toBeResolved();
  });
});
