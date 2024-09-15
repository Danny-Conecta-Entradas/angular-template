import { Component } from '@angular/core'

import { BaseComponent } from 'src/app/components/base.component'
import { openAlertDialog } from 'src/app/dialogs/alert-dialog/alert-dialog.component'
import { openConfirmDialog } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component'
import { openSnackBar } from 'src/app/dialogs/snackbar/snackbar.component'
import { openModalTemplate } from 'src/app/templates/modal-template/modal-template'

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

  readonly global = window

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

  async openAlert() {
    await openAlertDialog({
      title: 'Alert Dialog',
      message: 'Message that you can see',
    })
  }

  async openAlertError() {
    await openAlertDialog({
      showAsError: true,
      title: 'Alert Dialog Error',
      message: 'Message that you can see',
    })
  }

  async openConfirm() {
    await openConfirmDialog({
      title: 'Confirm Dialog',
      message: 'Message for you to see',
    })
  }

  async openConfirmWarning() {
    await openConfirmDialog({
      showAsWarning: true,
      title: 'Confirm Dialog Warning',
      message: 'Message for you to see',
    })
  }

  async openModalTemplateAsDialog() {
    await openModalTemplate()
  }

  async openModalTemplateAsBottomSheet() {
    await openModalTemplate({
      asBottomSheet: true,
    })
  }

}
