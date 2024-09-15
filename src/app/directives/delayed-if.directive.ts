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
  <div *delayedIf="true; entryTimeout: 500; exitTimeout: 1000">
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

  @Input()
  set delayedIf(condition: boolean) {
    if (condition) {
      window.clearTimeout(this.#exitDelayTimeoutId)

      if (this.#viewContainerRef.length > 0) {
        return
      }

      if (typeof this.entryTimeout === 'number') {
        this.#entryDelayTimeoutId = window.setTimeout(
          () => {
            this.#viewContainerRef.createEmbeddedView(this.#templateRef)
          },
          this.#entryDelayTimeoutId
        )
      }
      else {
        this.#viewContainerRef.createEmbeddedView(this.#templateRef)
      }

      return
    }

    window.clearTimeout(this.#entryDelayTimeoutId)

    if (typeof this.exitTimeout === 'number') {
      this.#exitDelayTimeoutId = window.setTimeout(
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

  @Input('delayedIfEntryTimeout')
  entryTimeout: null | number = null

  #entryDelayTimeoutId = -1

  @Input('delayedIfExitTimeout')
  exitTimeout: null | number = null

  #exitDelayTimeoutId = -1

}
