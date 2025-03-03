import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type=text][textUppercase]',
  standalone: true,
})
export class TextUppercaseDirective {

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }

  constructor() { }
}
