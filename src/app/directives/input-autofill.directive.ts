import { Directive, ElementRef, OnInit, inject } from '@angular/core'

// Detect when <input> or <textarea> autofill to remove the autofill
// state to avoid ths User Agent forced styles and be able to add our own.
// This is done by replacing the content with a different value and then with the old one.
// To be able to style detect the autofill state, a `data attribute` [data-autofill]="true" is added.

// Get original reference to `EventTarget.prototype.addEventListener`
// to properly handle events
// since Zone.js overrides the native implementation
const nativeAddEventListener: EventTarget['addEventListener'] = EventTarget.prototype['__zone_symbol__addEventListener']

@Directive({
  standalone: true,
  selector: 'input, textarea'
})
export class InputAutofillDirective implements OnInit {

  constructor() {}

  readonly #inputRef = inject(ElementRef) as ElementRef<HTMLInputElement | HTMLTextAreaElement>

  ngOnInit() {
    const target = this.#inputRef.nativeElement

    nativeAddEventListener.call(target, 'input', event => {
      if (!target.matches(':autofill')) {
        delete target.dataset['autofill']
        return
      }

      // We need to wait a bit before doing the change
      // after the 'input' event
      window.setTimeout(() => {
        target.value = target.value + '_'
        target.value = target.value.slice(0, -1)

        target.dataset['autofill'] = String(true)
      })
    })
  }

}
