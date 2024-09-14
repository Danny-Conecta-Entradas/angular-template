import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core'

// https://v16.angular.io/guide/structural-directives

/**
  Custom structural directive similar to `*ngIf` to be able to add a delay
  before removing the element, which allows to add.

  @example
  ```html
  <!--
    This `<div>` will hide if value changes to `false` after 1000 miliseconds
  -->
  <div *delayedIf="true; exitTimeout: 1000">
  ```
*/

@Directive({
  standalone: true,
  selector: '[delayedIf]',
})
export class DelayedIfDirective {

  constructor() {}

  readonly #templateRef = inject(TemplateRef)

  readonly #viewContainerRef = inject(ViewContainerRef)

  delayTimeoutId = -1

  @Input()
  set delayedIf(condition: boolean) {
    if (condition) {
      window.clearTimeout(this.delayTimeoutId)

      if (this.#viewContainerRef.length > 0) {
        return
      }

      this.#viewContainerRef.createEmbeddedView(this.#templateRef)

      return
    }

    if (typeof this.exitTimeout === 'number') {
      this.delayTimeoutId = window.setTimeout(
        () => {
          this.#viewContainerRef.clear()
        },
        this.exitTimeout
      )
    }
    else {
      this.#viewContainerRef.clear()
    }
  }

  @Input('delayedIfExitTimeout')
  exitTimeout: null | number = null

}
