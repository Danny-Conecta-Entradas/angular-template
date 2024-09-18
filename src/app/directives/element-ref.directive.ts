import { Directive, ElementRef, inject } from '@angular/core';


@Directive({
  standalone: true,
  selector: ':not()',
  exportAs: 'elementRef',
})
export class ElementRefDirective {

  readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>

  get element() {
    return this.elementRef.nativeElement
  }

}
