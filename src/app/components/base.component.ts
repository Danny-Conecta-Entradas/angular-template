import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'

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

  readonly templateUtils

  readonly materialTemplateUtils

}


class LifeCycleEvents {

  readonly onInit = new EventEmitter<void>()

  readonly afterViewInit = new EventEmitter<void>()

  readonly onDestroy = new EventEmitter<void>()

}
