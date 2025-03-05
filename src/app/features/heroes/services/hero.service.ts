import { HeroesDataBase, HeroModel } from '../db/heroes.db';
import { Injectable } from "@angular/core";
import { RestMock } from "src/app/mocks/rest.mock";
import { HeroesErrors } from '../constants/errors.constants';
import { CoreErrors } from 'src/app/core/constants/errors.constants';

@Injectable()
export class HeroService {

  constructor(
    private restMock: RestMock,
    private heroesDataBase: HeroesDataBase,
  ) { }

  get(id?: number): HeroModel[] | HeroModel {
    try {
      return this.heroesDataBase.get(id);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = CoreErrors.GENERIC_ERROR;
      }
      throw error;
    }
  }

  push(data: HeroModel): HeroModel {
    try {
      const element = this.heroesDataBase.push(data);
      return element;
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_ADD_HERO;
      }
      throw error;
    }
  }

  async update(id: number, data: HeroModel): Promise<HeroModel> {
    try {
      return this.restMock.fakeQuery(async () => {
        const element = this.heroesDataBase.update(id, data);
        return Promise.resolve(element);
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
      return this.restMock.fakeQuery(async () => {
        this.heroesDataBase.delete(id);
        return Promise.resolve();
      }, 300);
    } catch (error: any) {
      if (!(error instanceof HeroesErrors)) {
        error = HeroesErrors.CANNOT_DELETE_HERO(id);
      }
      return Promise.reject(error);
    }
  }
}
