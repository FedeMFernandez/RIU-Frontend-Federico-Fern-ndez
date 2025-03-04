export class StorageAdapter {

  constructor(
    private storage: Storage,
  ) { }

  get<T>(key: string): T | null | Error {
    const data = this.storage.getItem(key);
    return this.successCallback<T>(data);
  }

  set(key: string, value: any): void {
    return this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    return this.storage.removeItem(key);
  }

  clear(): void {
    return this.storage.clear();
  }

  length(): number {
    return this.storage.length;
  }

  private successCallback<T>(data: string | null): T | null | Error {
    try {
      if (!data) {
        return data as T;
      }
      return JSON.parse(data) as T;
    } catch (error: any) {
      throw error;
    }
  }
}
