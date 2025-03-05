
export async function threadSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(); }, ms);
  });
}
