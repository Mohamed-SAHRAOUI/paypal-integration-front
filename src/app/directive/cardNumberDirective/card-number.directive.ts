import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appCardNumber]'
})
export class CardNumberDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target;
    const trimmed = input.value.replace(/\s+/g, '');
    if (trimmed.length > 16) {
      input.value = trimmed.slice(0, 16);
    } else {
      const spaced = trimmed.replace(/(\d{4})/g, '$1 ');
      input.value = spaced.trim();
    }
    this.setValueAndCursor(input);
  }

  private setValueAndCursor(input: HTMLInputElement) {
    input.setSelectionRange(input.value.length, input.value.length);
  }

}
