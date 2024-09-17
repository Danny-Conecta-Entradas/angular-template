import { Directive, ElementRef, OnInit, inject } from '@angular/core'

// Add focus to <input> and <textarea> when they are dragged over
// and remove focus on `dragleave` to improve experience in that scenario

// Get original reference to `EventTarget.prototype.addEventListener`
// to properly handle events
// since Zone.js overrides the native implementation
const nativeAddEventListener: EventTarget['addEventListener'] = EventTarget.prototype['__zone_symbol__addEventListener']

@Directive({
  standalone: true,
  selector: 'input, textarea'
})
export class InputDragoverFocusDirective implements OnInit {

  constructor() {}

  readonly #inputRef = inject(ElementRef) as ElementRef<HTMLInputElement | HTMLTextAreaElement>

  ngOnInit() {
    const target = this.#inputRef.nativeElement

    nativeAddEventListener.call(target, 'dragenter', event => {
      target.focus()
    })

    nativeAddEventListener.call(target, 'dragleave', event => {
      target.blur()
    })
  }

}
