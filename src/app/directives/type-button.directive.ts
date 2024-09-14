import { Directive, ElementRef, inject } from '@angular/core'

/*
  Directive to add `type="button" to <button> elements that don't have one specified`.

  The goal of this is to avoid the implicit `submit` type of buttons inside `<form>`.
*/

@Directive({
  standalone: true,
  selector: 'button',
})
export class TypeButtonDirective {

  readonly #elementRef = inject(ElementRef) as ElementRef<HTMLButtonElement>

  constructor() {
    const button = this.#elementRef.nativeElement

    if (button.getAttribute('type') === '' || button.getAttribute('type') === null) {
      this.#elementRef.nativeElement.type = 'button'
    }
  }

}
