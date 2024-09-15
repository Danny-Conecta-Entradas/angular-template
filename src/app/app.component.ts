import { OverlayContainer } from '@angular/cdk/overlay'
import { AfterViewInit, Component, ElementRef, inject } from '@angular/core'
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
export class AppComponent implements AfterViewInit {

  constructor() {
    // TODO: Uncomment when Firebase config is set up
    // this.#initAuth()

    this.#restoreScrollOnNavigation()

    this.#moveGlobalStylesToTheBottom()
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
   * Move global stylesheet to the bottom to have priority from styles from other components.
   */
  #moveGlobalStylesToTheBottom() {
    const globalStyleSheet = document.head.querySelector(`:scope > link[rel="stylesheet"][href="styles.css"]`)

    if (globalStyleSheet == null) {
      console.warn(`Couln't find global stylesheet`)
      return
    }

    document.body.prepend(globalStyleSheet)
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
      (rule) => {
        if (
          rule.selectorText !== '.mdc-button'
          && rule.selectorText !== '.mat-mdc-button'
          && rule.selectorText !== '.mdc-icon-button'
        ) {
          return
        }

        rule.styleMap.delete('cursor')
        rule.styleMap.delete('outline')
        rule.styleMap.delete('border')
        rule.styleMap.delete('min-width')
        rule.styleMap.delete('background')
        // rule.styleMap.delete('height')
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

    this.#router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return
      }

      window.setTimeout(() => removeStyles(), 500)
    })

    const overlayWrapper = this.overlayContainer.getContainerElement()

    // @ts-ignore
    const observer = new MutationObserver.__zone_symbol__OriginalDelegate((recordList) => {
      removeStyles()
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
