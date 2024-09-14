import { Directive, OnInit, inject } from '@angular/core';
import { RouterLinkActive } from '@angular/router'

// https://timdeschryver.dev/blog/use-angular-directives-to-extend-components-that-you-dont-own#override-the-default-implementation

// Extend functionality of `RouterLinkActive` with a directive to add default value for `routerLinkActiveOptions` property
// to avoid repetition when we want to match 'exact' route path and not a 'subset'

@Directive({
  standalone: true,
  selector: 'a[routerLink][exact-active-path]'
})
export class ExactActiveRouterLinkDirective implements OnInit {

  constructor() {}

  #routerLinkActive = inject(RouterLinkActive)

  ngOnInit() {
    this.#routerLinkActive.routerLinkActiveOptions = {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    }
  }

}
