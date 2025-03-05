import { LocalStorageWrapper } from './../../../core/wrappers/local-storage.wrapper';
import { Injectable } from "@angular/core";
import moment from 'moment';
import { RestMock } from "src/app/mocks/rest.mock";
import { HeroesErrors } from '../constants/errors.constants';
import { CoreErrors } from 'src/app/core/constants/errors.constants';

@Injectable()
export class HeroService {

  private static LAST_ID = 0;

  readonly HEROES_DB: string = 'HEROES';
  readonly HEROES_DB_LAST_ID: string = 'HEROES_LAST_ID';

  constructor(
    private restMock: RestMock,
    private localStorageWrapper: LocalStorageWrapper,
  ) {
    HeroService.LAST_ID = this.fetchLastID();
  }

  async get(id?: number): Promise<HeroModelDTO[] | HeroModelDTO> {
    try {
      return this.restMock.fakeQuery(() => {
        let collection: any = [];
        try {
          collection = this.localStorageWrapper.get(this.HEROES_DB);
        } catch { }

        if (!id) { return Promise.resolve(collection); }

        const index = this.getHeroIndex(id, collection);
        return Promise.resolve(collection[index]);
      }, 300);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = CoreErrors.GENERIC_ERROR;
      }
      return Promise.reject(error);
    }
  }

  async push(data: HeroModelDTO): Promise<HeroModelDTO> {
    try {
      return this.restMock.fakeQuery(async () => {
        const collection: HeroModelDTO[] = await this.get() as HeroModelDTO[];
        HeroService.LAST_ID++;
        collection.push({
          ...data,
          id: HeroService.LAST_ID,
          createdAt: moment().unix(),
        });

        this.localStorageWrapper.set(this.HEROES_DB, collection);
        this.updateLastID(HeroService.LAST_ID);
        return Promise.resolve(data);
      }, 300);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_ADD_HERO;
      }
      return Promise.reject(error);
    }
  }

  async update(id: number, data: HeroModelDTO): Promise<HeroModelDTO> {
    try {
      const collection: HeroModelDTO[] = await this.get() as HeroModelDTO[];
      return this.restMock.fakeQuery(async () => {
        const index = this.getHeroIndex(id, collection);
        const actual = {
          ...data,
          id,
          createdAt: collection[index].createdAt,
        } as HeroModelDTO;
        collection[index] = actual;

        this.localStorageWrapper.set(this.HEROES_DB, collection);
        return Promise.resolve(actual);
      }, 300);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_UPDATE_HERO(id);
      }
      return Promise.reject(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const collection: HeroModelDTO[] = await this.get() as HeroModelDTO[];
      return this.restMock.fakeQuery(async () => {
        const index = this.getHeroIndex(id, collection);
        collection.splice(index, 1);

        this.localStorageWrapper.set(this.HEROES_DB, collection);
        return Promise.resolve();
      }, 300);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_DELETE_HERO(id);
      }
      return Promise.reject(error);
    }
  }

  private fetchLastID(): number {
    try {
      return this.localStorageWrapper.get(this.HEROES_DB_LAST_ID);
    } catch (error: any) {
      return 1;
    }
  }

  private getHeroIndex(id: number, collection: HeroModelDTO[]): number {
    const index = collection.findIndex((element: HeroModelDTO) => element.id === id);
    if (index === -1) {
      throw HeroesErrors.HERO_NOT_FOUND;
    }
    return index;
  }

  private updateLastID(id: number): void {
    this.localStorageWrapper.set(this.HEROES_DB_LAST_ID, id);
  }

}

export interface HeroModelDTO {
  id: number;
  name: string;
  power: string;
  weakness: string;
  birth: number;
  createdAt: number;
}
