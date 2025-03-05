export default class Patterns {
  static readonly TEXT_WITH_SPACES_DOTS_DASH: RegExp = new RegExp(/^(?!\d)(?!\s)(?!.*\s$)[-.a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/);
  static readonly TEXT_UPPERCASE_WITH_SPACES_DOTS_DASH: RegExp = new RegExp(/^(?!\d)(?!\s)(?!.*\s$)[-.A-ZÁÉÍÓÚÑ ]+$/);
}
