import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { lastValueFrom } from 'rxjs'

import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MaterialModule } from 'src/app/modules/material.module'


type DialogComponent = ConfirmDialog
type DialogArg = ConfirmDialogOptions
type DialogResult = boolean

@Component({
  standalone: true,

  host: {
    'data-apply-material-overrides': '',
  },

  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.css'],

  imports: [
    FormsModule,
    CommonModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ConfirmDialog implements AfterViewInit {

  readonly hostRef = inject(ElementRef) as ElementRef<HTMLElement>

  constructor() {
    if (this.data.showAsWarning) {
      this.hostRef.nativeElement.classList.add('-has-warning')
    }
  }

  readonly dialogRef = inject(MatDialogRef) as MatDialogRef<DialogComponent, DialogResult>

  readonly data: DialogArg = inject(MAT_DIALOG_DATA)

  @ViewChild('message')
  readonly message!: ElementRef<HTMLElement>

  ngAfterViewInit() {
    this.message.nativeElement.innerText = this.data.message?.trim() ?? ''
  }

}

type ConfirmDialogOptions = {
  title: string
  message?: string
  okText?: string
  cancelText?: string

  okBgColor?: string
  okColor?: string
  cancelBgColor?: string
  cancelColor?: string

  /**
   * Whether the user can use escape or clicking on the backdrop to close the modal.
   */
  disableClose?: boolean

  showAsWarning?: boolean
}

export async function openConfirmDialog(options: ConfirmDialogOptions): Promise<DialogResult> {
  const dialog = MaterialModule.dialog

  const dialogRef = dialog.open<DialogComponent, DialogArg, DialogResult>(ConfirmDialog, {
    data: options,

    // Whether the user can use escape or clicking on the backdrop to close the modal.
    disableClose: options.disableClose ?? false,
  })

  const dialogResult = await lastValueFrom(dialogRef.afterClosed()) as DialogResult

  return dialogResult
}
