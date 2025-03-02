import { RestService } from './rest.service';
import { Injectable } from "@angular/core";

@Injectable()
export class HeroService {

  constructor(
    private restService: RestService,
  ) { }

  async get(id?: number): Promise<HeroModelDTO[] | HeroModelDTO> {
    try {
      const endpoint = id ? `heroes/${id}` : 'heroes';
      const collection = await this.restService.get<HeroModelDTO[] | HeroModelDTO>(endpoint);
      return Promise.resolve(collection);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async push(data: HeroModelDTO): Promise<HeroModelDTO> {
    try {
      const response = await this.restService.post<HeroModelDTO>('heroes', data);
      return Promise.resolve(response);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async update(id: number, data: HeroModelDTO): Promise<HeroModelDTO> {
    try {
      const response = await this.restService.put<HeroModelDTO>( `heroes/${id}`, data);
      return Promise.resolve(response);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

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
