import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { MatAnchor } from '@angular/material/button'
import { MatMenu } from '@angular/material/menu'

@Component({
  host: {},

  selector: '',
  template: '',
})
export abstract class BaseComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  constructor() {
    if (new.target === BaseComponent) {
      throw new Error(`Cannot instantiate abstract class`)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lifeCycleEvents.onChanges.emit(changes)
  }

  ngOnInit() {
    this.lifeCycleEvents.onInit.emit()
  }

  ngDoCheck() {
    this.lifeCycleEvents.onDoCheck.emit()
  }

  ngAfterContentInit() {
    this.lifeCycleEvents.afterContentInit.emit()
  }

  ngAfterContentChecked() {
    this.lifeCycleEvents.afterContentChecked.emit()
  }

  ngAfterViewInit() {
    this.lifeCycleEvents.afterViewInit.emit()
  }

  ngAfterViewChecked() {
    this.lifeCycleEvents.afterViewChecked.emit()
  }

  ngOnDestroy() {
    this.lifeCycleEvents.onDestroy.emit()
  }

  /**
   * Handle lyfecycle hooks of the component as events
   */
  readonly lifeCycleEvents = new LifeCycleEvents()

  readonly templateUtils = templateUtils

  readonly materialTemplateUtils = materialTemplateUtils

  readonly userAgentData = userAgentData

}

/**
 * Class to handle lyfecycle hooks of components as events.
 * Docs: https://v16.angular.io/guide/lifecycle-hooks
 */
class LifeCycleEvents {

  static {
    Object.defineProperty(this.prototype, Symbol.toStringTag, {value: `${this.name}Prototype`})
    Object.setPrototypeOf(this.prototype, null)
  }

  readonly onChanges = new EventEmitter<SimpleChanges>()

  readonly onInit = new EventEmitter<void>()

  readonly onDoCheck = new EventEmitter<void>()

  readonly afterContentInit = new EventEmitter<void>()

  readonly afterContentChecked = new EventEmitter<void>()

  readonly afterViewInit = new EventEmitter<void>()

  readonly afterViewChecked = new EventEmitter<void>()

  /**
   * There is an alternative to ngOnDestroy() to perform clean up.
   * DestroyRef: https://v16.angular.io/guide/lifecycle-hooks#destroyref
   */
  readonly onDestroy = new EventEmitter<void>()

  static {
    Object.freeze(this)
  }

}


const templateUtils = new class TemplateUtils {

  static {
    Object.defineProperty(this.prototype, Symbol.toStringTag, {value: `${this.name}Prototype`})
    Object.setPrototypeOf(this.prototype, null)
  }

  isScrollEnd(element: HTMLElement) {
    const scrollHeight = element.scrollHeight
    const scrollBottom = element.offsetHeight + element.scrollTop

    return (
      scrollHeight - (scrollBottom) < 1
      && scrollHeight - (scrollBottom) > -1
    )
  }

  preventLinkNavigationFromInnerElement(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  /**
   * Prevent dragging on inner buttons of links
   */
  preventDragOnInnerElementOfLink(anchor: HTMLAnchorElement | MatAnchor, event: MouseEvent) {
    const anchorElement = anchor instanceof HTMLAnchorElement ? anchor : (anchor._elementRef.nativeElement as HTMLAnchorElement)
    anchorElement.draggable = false

    if (anchor instanceof MatAnchor) {
      anchor.disableRipple = true
    }

    const button = event.currentTarget as HTMLElement

    // Prevent navigation when initiating click on innerButton
    // but ending the click inside the anchor but outside the innerButton
    const preventNavigationListener = (event: MouseEvent) => {
      if (!event.isTrusted) {
        return
      }

      if (event.composedPath().includes(button)) {
        return
      }

      event.stopPropagation()
      event.preventDefault()
    }

    anchorElement.addEventListener('click', preventNavigationListener, {capture: true})

    const cleanUpClickListener = (event: MouseEvent) => {
      if (!event.isTrusted) {
        return
      }

      window.removeEventListener('click', cleanUpClickListener, {capture: true})

      if (anchor instanceof MatAnchor) {
        anchor.disableRipple = false
      }

      window.setTimeout(() => {
        anchorElement.removeEventListener('click', preventNavigationListener, {capture: true})
      })
    }

    window.addEventListener('click', cleanUpClickListener, {capture: true})

    const cleanUpPointerUpListener = (event: MouseEvent) => {
      if (!event.isTrusted) {
        return
      }

      anchorElement.removeAttribute('draggable')

      window.removeEventListener('pointerup', cleanUpPointerUpListener, {capture: true})
    }

    window.addEventListener('pointerup', cleanUpPointerUpListener, {capture: true})
  }

  static {
    Object.freeze(this)
  }

}


const materialTemplateUtils = new class MaterialTemplateUtils {

  static {
    Object.defineProperty(this.prototype, Symbol.toStringTag, {value: `${this.name}Prototype`})
    Object.setPrototypeOf(this.prototype, null)
  }

  /**
   * 
   */
  matchMatMenuWidthToMenuTriggerWidth(matMenu: MatMenu, event: MouseEvent) {
    const menuTrigger = event.currentTarget as HTMLElement

    const animationSubscription = matMenu._animationDone.subscribe((animationEvent) => {
      if (animationEvent.toState === 'enter') {
        animationSubscription.unsubscribe()
        return
      }

      // In the rare case the button that opens the menu
      // is clicked too fast several times,
      // it sometimes appears miss aligned from the button.
      // This can be solved by dispatching a 'resize' event on `window`
      window.dispatchEvent(new Event('resize'))

      const menuElement = animationEvent.element as HTMLElement

      const resizeObserver = new ResizeObserver((entries) => {
        menuElement.style.width = `${menuTrigger.offsetWidth}px`
      })

      resizeObserver.observe(menuTrigger)

      const closedSubscription = matMenu.closed.subscribe(() => {
        closedSubscription.unsubscribe()

        resizeObserver.unobserve(menuTrigger)
      })
    })
  }

  static {
    Object.freeze(this)
  }

}


const userAgentData = new class UserAgentData {

  get mobile() {
    if (navigator.userAgentData) {
      if (navigator.userAgentData.platform !== '') {
        return navigator.userAgentData.mobile
      }
    }

    const isMobile = (
      navigator.userAgent.includes('Mobile')
      || navigator.userAgent.includes('Android')
      || navigator.userAgent.includes('iPhone OS')
      || navigator.userAgent.includes('iPad OS')
    )

    return isMobile
  }

  get platform() {
    if (navigator.userAgentData) {
      if (navigator.userAgentData.platform !== '') {
        return navigator.userAgentData.platform
      }
    }

    const platform = (() => {
      if (navigator.userAgent.includes('Windows')) {
        return 'Windows'
      }

      if (navigator.userAgent.includes('CrOS')) {
        return 'Chrome OS'
      }

      if (navigator.userAgent.includes('Macintosh')) {
        return 'macOS'
      }

      if (navigator.userAgent.includes('Android')) {
        return 'Android'
      }

      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        return 'iOS'
      }

      return ''
    })()

    return platform
  }

}
