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
    if (trimmed.length > 5) {
      trimmed = trimmed.substr(0, 5); // limit to 5 characters
    }
    const numbers = [];
    trimmed = trimmed.replace('/','');
    for (let i = 0; i < trimmed.length; i += 2) {
      const segment = trimmed.substr(i, 2);
      if (/^\d+$/.test(segment)) {
        const num = parseInt(segment, 10);
        if (i === 0 && (num < 0 || num > 12)) { // validate month to not exceed 12
          continue;
        }
        numbers.push(segment);
      }
    }
    input.value = numbers.join('/');
  }

}
