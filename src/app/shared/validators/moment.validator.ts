import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import moment from "moment";

export class MomentValidators {
  static validDate(format: string = 'DD/MM/YYYY'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      const date = moment(control.value, format, true);
      return date.isValid() ? null : { 'invalidDate': true }
    }
  }
}
