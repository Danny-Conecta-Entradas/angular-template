import { OverlayContainer } from '@angular/cdk/overlay'
import { AfterViewInit, ApplicationRef, Component, ElementRef, inject, OnInit, ProviderToken, runInInjectionContext, ViewContainerRef } from '@angular/core'
import { MatAnchor } from '@angular/material/button'
import { NavigationEnd, Router } from '@angular/router'

import AuthService from 'src/app/services/auth.service'

@Component({
  host: {
    'data-apply-material-overrides': '',
  },

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnInit {

  constructor() {
    // TODO: Uncomment when Firebase config is set up
    // this.#initAuth()

    this.#restoreScrollOnNavigation()

    this.#moveGlobalStylesToTheBottom()

    // @ts-ignore
    AppComponent.applicationRef = inject(ApplicationRef)
  }

  static readonly applicationRef: ApplicationRef

  /**
   * Method to inject dependencies outside of a dependency injection context.  
   * Docs: https://v17.angular.io/guide/dependency-injection-context#run-within-an-injection-context
   */
  static injectWithContext<T>(token: ProviderToken<T>) {
    let injectionValue!: T

    runInInjectionContext(this.applicationRef.injector, () => {
      injectionValue = inject(token)
    })

    return injectionValue
  }

  readonly #authService = inject(AuthService)

  readonly #router = inject(Router)

  readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>

  get isAuthStateReady() {
    return this.#authService.isAuthStateReady
  }

  #isUserLogged = this.#authService.isUserLogged()

  get isUserLogged() {
    return this.#isUserLogged
  }

  readonly #viewContainerRef = inject(ViewContainerRef)

  ngOnInit() {
    this.#fixMatAnchorInteractionOnMobile()
  }

  ngAfterViewInit() {
    this.#removeRouterOutlet()

    this.#modifyBackdropStructureToBeAbleToHaveOwnScrollingForEachModal()

    this.#removeAnnoyingMaterialCSS()
  }


  #initAuth() {
    this.#authService.auth.onAuthStateChanged(user => {
      this.#isUserLogged = Boolean(user)
    })
  }

  #restoreScrollOnNavigation() {
    this.#router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return
      }

      this.elementRef.nativeElement.scroll({top: 0, left: 0, behavior: 'instant'})
    })
  }

  /**
   * Remove `<router-outlet />` element from the document.  
   * Doing this does not affect navigation at all.
   */
  #removeRouterOutlet() {
    this.elementRef.nativeElement.querySelector('router-outlet')?.replaceWith(
      document.createComment('router-outlet')
    )
  }

  /**
   * Create and add a hidden MatAnchor to the document
   * to avoid bug on mobile that prevents the ripple effect to work in the 1st interaction.
   */
  #fixMatAnchorInteractionOnMobile() {
    const matAnchor = this.#viewContainerRef.createComponent(MatAnchor)
    const element = matAnchor.instance._elementRef.nativeElement as HTMLAnchorElement
    element.hidden = true

    element.click()
  }

  /**
   * Move global stylesheet to the bottom to have priority from styles from other components.
   */
  #moveGlobalStylesToTheBottom() {
    const globalStyleSheets = document.head.querySelectorAll(`:scope > link[rel="stylesheet"][href^="styles."]`)

    document.body.prepend(...globalStyleSheets)
  }

  #removeAnnoyingMaterialCSS() {
    const targetSelectors: (string | ((rule: CSSStyleRule) => void))[] = [
      // MatButton
      `.mat-mdc-button:not(:disabled)`,
      `.mdc-button:hover`,
      `.mdc-button:active`,
      `.mat-mdc-button.mat-mdc-button-base, .mat-mdc-raised-button.mat-mdc-button-base, .mat-mdc-unelevated-button.mat-mdc-button-base, .mat-mdc-outlined-button.mat-mdc-button-base`,
      `.mat-mdc-button > .mat-icon`,
      `.mat-mdc-button .mdc-button__label + .mat-icon`,
      `.mat-mdc-icon-button.mat-mdc-button-base`,
      `.mat-mdc-raised-button:not(:disabled)`,
      `.mat-mdc-raised-button.mdc-ripple-upgraded--background-focused, .mat-mdc-raised-button:not(.mdc-ripple-upgraded):focus`,
      `.mdc-fab:hover`,
      (rule) => {
        if (
          rule.selectorText !== '.mdc-button'
          && rule.selectorText !== '.mat-mdc-button'
          && rule.selectorText !== '.mdc-icon-button'
          && rule.selectorText !== '.mdc-fab'
          && rule.selectorText !== '.mdc-fab:active, .mdc-fab:focus'
        ) {
          return
        }

        // StyleMap is not supported by Firefox
        // rule.styleMap.delete('cursor')

        rule.style.removeProperty('cursor')
        rule.style.removeProperty('outline')
        rule.style.removeProperty('border')
        rule.style.removeProperty('min-width')
        rule.style.removeProperty('background')
        // rule.style.removeProperty('height')
      },

      // MatIcon
      // `.mat-mdc-form-field-icon-prefix > .mat-icon, .mat-mdc-form-field-icon-suffix > .mat-icon`,

      // MatExpansionPanel
      `.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled="true"]):hover`,
      `.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing)`,
      `.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled="true"]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled="true"]).cdk-program-focused`,
      `.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover`,

      // MatFormField
      // `.mat-mdc-form-field:hover .mat-mdc-form-field-focus-overlay`,
      // `.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay`,
      `.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper`,

      // `.mat-mdc-checkbox-ripple .mat-ripple-element`,
    ]

    const removeStyles = () => {
      for (const styleSheet of document.styleSheets) {
        this.#deleteSelectorsFromStyleSheetOrRule(targetSelectors, styleSheet)
      }
    }

    const overlayWrapper = this.overlayContainer.getContainerElement()

    function isSafariMac() {
      return /Version\/\d+\.\d+ Safari\/\d+\.\d+\.\d+/.test(navigator.userAgent)
    }

    // On Mac Safari `document.styleSheets` does not immediatly
    // reflects stylesheets that were re-appended to the document (which happens when calling the method `#moveGlobalStylesToTheBottom()` at the start)
    // So we need to wait and remove the styles after that.
    if (isSafariMac()) {
      window.setTimeout(() => removeStyles(), 0)
    }

    // @ts-ignore
    const observer = new MutationObserver.__zone_symbol__OriginalDelegate((recordList) => {
      removeStyles()
    })

    observer.observe(document.head, {
      childList: true,
    })

    observer.observe(overlayWrapper, {
      childList: true,
    })
  }

  #deleteSelectorsFromStyleSheetOrRule(selectorList: (string | ((rule: CSSStyleRule) => void))[], styleSheetOrRule: CSSStyleSheet | CSSMediaRule) {
    function canAccessStyleSheet(styleSheet: CSSStyleSheet) {
      try {
        styleSheet.cssRules
        return true
      }
      catch {
        return false
      }
    }

    if (styleSheetOrRule instanceof CSSStyleSheet) {
      if (!canAccessStyleSheet(styleSheetOrRule)) {
        return
      }
    }

    for (const rule of [...styleSheetOrRule.cssRules]) {
      if (rule instanceof CSSStyleRule) {

        for (const selector of selectorList) {

          switch (typeof selector) {

            case 'string': {
              if (selector === rule.selectorText) {
                const ruleIndex = [...styleSheetOrRule.cssRules].indexOf(rule)
                styleSheetOrRule.deleteRule(ruleIndex)
              }
            }
            break

            case 'function': {
              selector(rule)
            }
            break

            default: {
              throw new Error(`Couldnt handle value to filter CSS rule`)
            }

          }

        }
      }
      else
      if (rule instanceof CSSMediaRule) {
        this.#deleteSelectorsFromStyleSheetOrRule(selectorList, rule)
      }
    }
  }

  readonly overlayContainer = inject(OverlayContainer)

  async #modifyBackdropStructureToBeAbleToHaveOwnScrollingForEachModal() {
    const overlayBackdropSelector = '.cdk-overlay-backdrop'
    const globalOverlayWrapperSelector = '.cdk-global-overlay-wrapper'

    const overlayWrapper = this.overlayContainer.getContainerElement()

    function reorganizeBackdropStructure(node) {
      if (node.matches(overlayBackdropSelector) && node.nextElementSibling.matches(globalOverlayWrapperSelector)) {
        node.nextElementSibling.prepend(node)
      }
    }

    for (const node of overlayWrapper.children) {
      reorganizeBackdropStructure(node)
    }


    // @ts-ignore
    const observer = new MutationObserver.__zone_symbol__OriginalDelegate((recordList) => {
      for (const record of recordList) {
        for (const node of record.addedNodes) {
          reorganizeBackdropStructure(node)
        }
      }
    })

    observer.observe(overlayWrapper, {
      childList: true,
    })
  }

}
