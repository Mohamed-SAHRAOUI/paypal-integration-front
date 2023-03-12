import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appExpiryDate]'
})
export class ExpiryDateDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    let trimmed = input.value.replace(/\s+/g, ''); // remove any spaces
    if (trimmed.length > 4) {
      trimmed = trimmed.substr(0, 4); // limit to 4 characters
    }
    const numbers = [];
    for (let i = 0; i < trimmed.length; i += 2) {
      const segment = trimmed.substr(i, 2);
      if (/^\d+$/.test(segment)) {
        numbers.push(segment);
      }
    }
    input.value = numbers.join('/');
  }

}
