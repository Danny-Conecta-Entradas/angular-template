import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core'

// https://v16.angular.io/guide/structural-directives

// ngIf implementation
// https://github.com/angular/angular/blob/main/packages/common/src/directives/ng_if.ts

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
  exportAs: 'delayedIf',
})
export class DelayedIfDirective<T = unknown> {

  constructor() {}

  readonly #templateRef = inject(TemplateRef)

  readonly #viewContainerRef = inject(ViewContainerRef)

  #embeddedViewRef!: EmbeddedViewRef<any>

  @Input()
  set delayedIf(condition: T) {
    if (condition) {
      window.clearTimeout(this.#exitDelayTimeoutId)

      if (this.#viewContainerRef.length > 0) {
        return
      }

      if (typeof this.entryTimeout === 'number') {
        this.#entryDelayTimeoutId = window.setTimeout(
          () => {
            this.#embeddedViewRef = this.#viewContainerRef.createEmbeddedView(this.#templateRef)
          },
          this.entryTimeout,
        )
      }
      else {
        this.#embeddedViewRef = this.#viewContainerRef.createEmbeddedView(this.#templateRef)
      }

      return
    }

    window.clearTimeout(this.#entryDelayTimeoutId)

    if (typeof this.exitTimeout === 'number') {
      if (this.cloneContentsBeforeExit) {
        const containerElement = this.#embeddedViewRef.rootNodes[0] as HTMLElement

        const children = containerElement.cloneNode(true).childNodes

        containerElement.replaceChildren(...children)

        const nodeIterator = document.createNodeIterator(containerElement, NodeFilter.SHOW_ELEMENT)

        let element: HTMLElement

        // Skip root node
        nodeIterator.nextNode()

        while (element = nodeIterator.nextNode() as HTMLElement) {
          element.style.setProperty('animation', 'none', 'important')
          element.style.setProperty('transition', 'none', 'important')
        }
      }

      this.#exitDelayTimeoutId = window.setTimeout(
        () => {
          this.#viewContainerRef.clear()
        },
        this.exitTimeout,
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

  @Input('delayedIfCloneContentsBeforeExit')
  cloneContentsBeforeExit: boolean = false

}
