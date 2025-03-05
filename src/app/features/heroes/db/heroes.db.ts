import { Injectable, signal, Signal, WritableSignal } from "@angular/core";
import moment from "moment";
import { CoreErrors } from "src/app/core/constants/errors.constants";
import { LocalStorageWrapper } from "src/app/core/wrappers/local-storage.wrapper";
import { HeroesErrors } from "../constants/errors.constants";


@Injectable({
  providedIn: 'root',
})
export class HeroesDataBase {

  private static LAST_ID = 0;
  readonly HEROES_DB: string = 'HEROES';
  readonly HEROES_DB_LAST_ID: string = 'HEROES_LAST_ID';

  private readonly _collectionSignal: WritableSignal<HeroModel[]> = signal([]);
  get heroesCollection(): Signal<HeroModel[]> {
    return this._collectionSignal.asReadonly();
  }

  constructor(
    private localStorageWrapper: LocalStorageWrapper,
  ) { this.init(); }

  private init() {
    this._collectionSignal.update(value => (this.get() as HeroModel[]));
    HeroesDataBase.LAST_ID = this.fetchLastID(this.heroesCollection().length);
  }

  get(id?: number): HeroModel[] | HeroModel {
    try {
      let collection: any = [];
      try {
        collection = this.localStorageWrapper.get(this.HEROES_DB) || [];
      } catch { }

      if (!id) {
        return collection;
      }

      const index = this.getLocalIndex(id, collection);
      return collection[index];
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = CoreErrors.GENERIC_ERROR;
      }
      throw error;
    }
  }

  push(data: HeroModel): HeroModel {
    try {
      const collection = [...this.heroesCollection()];
      const index = collection.push({
        ...data,
        id: ++HeroesDataBase.LAST_ID,
        createdAt: moment().unix(),
      });
      this._collectionSignal.update(value => collection);

      this.localStorageWrapper.set(this.HEROES_DB, collection);
      this.updateLastID(HeroesDataBase.LAST_ID);
      return collection[index-1] as HeroModel;
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_ADD_HERO;
      }
      throw error;
    }
  }

  update(id: number, data: HeroModel): HeroModel {
    try {
      const collection = [...this.heroesCollection()];
      const index = this.getLocalIndex(id, collection);
      collection[index] = {
        ...data,
        id,
        createdAt: collection[index].createdAt,
      } as HeroModel;
      this._collectionSignal.update(value => collection);

      this.localStorageWrapper.set(this.HEROES_DB, collection);
      return collection[index];
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_UPDATE_HERO(id);
      }
      throw error;
    }
  }

  delete(id: number): void {
    try {
      const collection = [...this.heroesCollection()];
      const index = this.getLocalIndex(id, collection);
      collection.splice(index, 1);
      this._collectionSignal.update(value => collection);

      this.localStorageWrapper.set(this.HEROES_DB, collection);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_DELETE_HERO(id);
      }
      throw error;
    }
  }

  private fetchLastID(length: number): number {
    try {
      return this.localStorageWrapper.get(this.HEROES_DB_LAST_ID) || 0;
    } catch (error: any) {
      return length;
    }
  }

  private getLocalIndex(id: number, collection: HeroModel[]): number {
    const index = collection.findIndex((element: HeroModel) => element.id === id);
    if (index === -1) {
      throw HeroesErrors.HERO_NOT_FOUND;
    }
    return index;
  }

  private updateLastID(id: number): void {
    this.localStorageWrapper.set(this.HEROES_DB_LAST_ID, id);
  }

}

export interface HeroModel {
  id: number;
  name: string;
  power: string;
  weakness: string;
  birth: number;
  createdAt: number;
}
