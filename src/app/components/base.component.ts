import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { MatMenu } from '@angular/material/menu'

@Component({
  host: {},

  selector: '',
  template: '',
})
export abstract class BaseComponent implements OnDestroy, AfterViewInit, OnInit {

  constructor() {
    if (new.target === BaseComponent) {
      throw new Error(`Cannot instantiate abstract class`)
    }
  }

  ngOnInit() {
    this.lifeCycleEvents.onInit.emit()
  }

  ngAfterViewInit() {
    this.lifeCycleEvents.afterViewInit.emit()
  }

  ngOnDestroy() {
    this.lifeCycleEvents.onDestroy.emit()
  }

  readonly lifeCycleEvents = new LifeCycleEvents()

  readonly templateUtils = new class TemplateUtils {

    preventLinkNavigationFromInnerElement(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
    }

    /**
     * Prevent dragging on inner buttons of links
     */
    preventDragOnInnerElementOfLink(anchor: HTMLAnchorElement, event: MouseEvent) {
      anchor.draggable = false

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

      anchor.addEventListener('click', preventNavigationListener, {capture: true})

      const cleanUpClickListener = (event: MouseEvent) => {
        if (!event.isTrusted) {
          return
        }

        window.removeEventListener('click', cleanUpClickListener, {capture: true})

        window.setTimeout(() => {
          anchor.removeEventListener('click', preventNavigationListener, {capture: true})
        })
      }

      window.addEventListener('click', cleanUpClickListener, {capture: true})

      const cleanUpPointerUpListener = (event: MouseEvent) => {
        if (!event.isTrusted) {
          return
        }

        anchor.removeAttribute('draggable')

        window.removeEventListener('pointerup', cleanUpPointerUpListener, {capture: true})
      }

      window.addEventListener('pointerup', cleanUpPointerUpListener, {capture: true})
    }

  }

  readonly materialTemplateUtils = new class MaterialTemplateUtils {

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

}


class LifeCycleEvents {

  readonly onInit = new EventEmitter<void>()

  readonly afterViewInit = new EventEmitter<void>()

  readonly onDestroy = new EventEmitter<void>()

}
