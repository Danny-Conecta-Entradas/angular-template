import { ApplicationRef, Component, createComponent, EnvironmentInjector, inject, ViewContainerRef } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BaseComponent } from 'src/app/components/base.component'
import { TemplateReferenceMainPage } from 'src/app/pages/template-reference/main/template-reference-main.page'


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

    /*
      Code to create component programatically
    */

    // const applicationRef = inject(ApplicationRef)

    // const componentRef = createComponent(TemplateReferenceMainPage, {
    //   environmentInjector: applicationRef.injector,
    // })

    // console.log(componentRef, componentRef.location.nativeElement)

    // applicationRef.attachView(componentRef.hostView)

    // const appRoot = document.body.querySelector('app-root')
    // appRoot!.append(componentRef.location.nativeElement)
  }

  readonly router = inject(Router)

  isPage1() {
    return this.router.url === '/template-reference/multi-route-one'
  }

  isPage2() {
    return this.router.url === '/template-reference/multi-route-two'
  }

}
