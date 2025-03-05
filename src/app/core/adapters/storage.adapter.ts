export class StorageAdapter {

  constructor(
    private storage: Storage,
  ) { }

  get(key: string): any | null {
    try {
      if (!key.trim().length) {
        throw new Error('key must not be empty');
      }
      const data = this.storage.getItem(key);
      return this.successCallback(data);
    } catch(error: any) {
      throw error;
    }
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

  private successCallback(data: string | null): any | null {
    try {
      if (!data) {
        throw new Error('Error getting data from storage');
      }
      return JSON.parse(data);
    } catch (error: any) {
      throw error;
    }
  }
}
