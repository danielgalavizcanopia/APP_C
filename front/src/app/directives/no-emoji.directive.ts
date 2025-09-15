import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoEmoji]'
})
export class NoEmojiDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement.value;
    const sanitizedInput = input.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Rango de emojis comunes

    if (input !== sanitizedInput) {
      this.el.nativeElement.value = sanitizedInput;
      event.stopPropagation();
    }
  }
}