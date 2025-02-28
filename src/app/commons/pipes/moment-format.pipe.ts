import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'momentFormat',
  standalone: true,
})
export class MomentFormatPipe implements PipeTransform {
  transform(value: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment.unix(value).format(format);
  }
}
