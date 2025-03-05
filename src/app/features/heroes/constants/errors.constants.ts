export class HeroesErrors extends Error {
  static readonly CANNOT_ADD_HERO = new this('No se pudo guardar el héroe.');
  static readonly HERO_NOT_FOUND = (id: number): Error => new HeroesErrors(`Héroe id ${id} no encontrado.`);
  static readonly CANNOT_UPDATE_HERO = (id: number): Error => new HeroesErrors(`No se pudo actualizar al héroe id ${id}.`);
  static readonly CANNOT_DELETE_HERO = (id: number): Error => new HeroesErrors(`No se pudo borrar al héroe id ${id}.`);

  constructor(message: string) {
    super(message);
  }
}
