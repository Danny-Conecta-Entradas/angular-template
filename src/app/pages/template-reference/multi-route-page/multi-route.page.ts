import { Component, inject } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BaseComponent } from 'src/app/components/base.component'


@Component({
  host: {},

  selector: 'multi-route-page',
  templateUrl: 'multi-route.page.html',
  styleUrls: ['multi-route.page.css'],
})
export default class MultiRoutePage extends BaseComponent {

  constructor() {
    super()

    console.log(`MultiRoutePage constructor`, this.router.url)

    this.router.events.subscribe((navigateEvent) => {
      if (!(navigateEvent instanceof NavigationEnd)) {
        return
      }

      console.log(`MultiRoutePage Navigation to`, this.router.url)
    })
  }

  readonly router = inject(Router)

  isPage1() {
    return this.router.url === '/template-reference/multi-route-one'
  }

  isPage2() {
    return this.router.url === '/template-reference/multi-route-two'
  }

}
