import { RestService } from './rest.service';
import { Injectable } from "@angular/core";

@Injectable()
export class HeroService {

  constructor(
    private restService: RestService,
  ) { }

  async get(): Promise<HeroModelDTO[]> {
    try {
      const collection = await this.restService.get<HeroModelDTO[]>('heroes');
      return Promise.resolve(collection);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async post(data: any): Promise<void> {
    try {
      await this.restService.post<void>('heroes', data);
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  // async update(): Promise<HeroModelDTO[]> {
  //   try {
  //     const collection = await this.restService.get<HeroModelDTO[]>('products');
  //     return Promise.resolve(collection);
  //   } catch (error: any) {
  //     return Promise.reject(error);
  //   }
  // }

  async delete(id: number): Promise<void> {
    try {
      await this.restService.delete<void>(`heroes/${id}`);
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error);
    }
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
