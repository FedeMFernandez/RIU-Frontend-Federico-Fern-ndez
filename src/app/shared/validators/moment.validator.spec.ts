import { FormControl } from '@angular/forms';
import { MomentValidators } from './moment.validator';

describe('MomentValidators', () => {

  describe('validDate()', () => {

    it('should return null when control is empty', () => {
      const control = new FormControl('');
      const validator = MomentValidators.validDate('DD/MM/YYYY');
      const result = validator(control);
      expect(result).toBeNull()
    });

    it('should return null for a valid date with default format DD/MM/YYYY', () => {
      const control = new FormControl('02/03/2025');
      const validator = MomentValidators.validDate();
      const result = validator(control);
      expect(result).toBeNull()
    });

    it('should return an error for an invalid date DD/MM/YYYY', () => {
      const control = new FormControl('31/02/2025');
      const validator = MomentValidators.validDate('DD/MM/YYYY');
      const result = validator(control);
      expect(result).toEqual({ 'invalidDate': true });
    });

    it('should return null for a valid date in a different format YYYY-MM-DD', () => {
      const control = new FormControl('2025-03-02');
      const validator = MomentValidators.validDate('YYYY-MM-DD');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return an error for an invalid date in a different format (YYYY-MM-DD)', () => {
      const control = new FormControl('2025-02-31');
      const validator = MomentValidators.validDate('YYYY-MM-DD');
      const result = validator(control);
      expect(result).toEqual({ 'invalidDate': true });
    });
  });
});
