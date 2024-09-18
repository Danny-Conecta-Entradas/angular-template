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

  ngAfterContentChecked(){
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

}

/**
 * Class to handle lyfecycle hooks of components as events.
 * Docs: https://v16.angular.io/guide/lifecycle-hooks
 */
class LifeCycleEvents {

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

}


const templateUtils = new class TemplateUtils {

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

}


const materialTemplateUtils = new class MaterialTemplateUtils {

  /**
   * 
   */
  matchMatMenuWidthToMenuTriggerWidth(menu: MatMenu, event: MouseEvent) {
    const animationSubscription = menu._animationDone.subscribe((animationEvent) => {
      if (animationEvent.toState === 'enter') {
        animationSubscription.unsubscribe()
        return
      }

      const menuElement = animationEvent.element as HTMLElement

      const menuTrigger = event.currentTarget as HTMLElement

      const resizeObserver = new ResizeObserver((entries) => {
        menuElement.style.width = `${menuTrigger.offsetWidth}px`
      })

      resizeObserver.observe(menuTrigger)

      const innerAnimationSubscription = menu._animationDone.subscribe((innerAnimationEvent) => {
        if (innerAnimationEvent.toState === 'void') {
          innerAnimationSubscription.unsubscribe()

          resizeObserver.unobserve(menuTrigger)
        }
      })
    })
  }

}
