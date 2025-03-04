export class StorageAdapter {

  constructor(
    private storage: Storage,
  ) { }

  get<T>(key: string): T | Error {
    const data = this.storage.getItem(key);
    return this.successCallback(data);
  }

  set<T>(key: string, value: string): T | Error {
    this.storage.setItem(key, value);
    return this.successCallback<T>(this.storage);
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

  private successCallback<T>(data: any): T | Error {
    try {
      if (!data) {
        throw new Error("data is invalid or can't be converted to generic type");
      }
      return data as T;
    } catch (error: any) {
      throw error;
    }
  }
}
