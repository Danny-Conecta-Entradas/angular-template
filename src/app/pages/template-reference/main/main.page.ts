import { Component } from '@angular/core'

import { BaseComponent } from 'src/app/components/base.component'
import { openSnackBar } from 'src/app/dialogs/snackbar/snackbar.component'

@Component({
  host: {
    'data-page-component': '',
  },

  selector: 'page-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.css'],
})
export class TemplateReferenceMainPage extends BaseComponent {

  constructor() {
    super()

    this.lifeCycleEvents.afterViewInit.subscribe(() => {
      window.setTimeout(() => this.init(), 0)
    })
  }

  async init() {

  }

  async openSnackbar() {
    await openSnackBar({
      message: 'This is a snackbar',
      duration: Infinity,
    })
  }

  async openSnackbarError() {
    await openSnackBar({
      showAsError: true,
      message: 'This is a snackbar error',
      duration: Infinity,
    })
  }

}
