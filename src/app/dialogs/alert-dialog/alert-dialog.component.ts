import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { lastValueFrom } from 'rxjs'

import { AppModule } from 'src/app/app.module'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,

  host: {
    'data-apply-material-overrides': '',
  },

  selector: 'alert-dialog',
  templateUrl: 'alert-dialog.component.html',
  styleUrls: ['alert-dialog.component.css'],

  imports: [
    FormsModule,
    CommonModule,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AlertDialogComponent implements AfterViewInit {

  readonly hostRef = inject(ElementRef) as ElementRef<HTMLElement>

  constructor() {
    if (this.data.showAsError) {
      this.hostRef.nativeElement.classList.add('-is-error')
    }
  }

  readonly dialogRef = inject(MatDialogRef) as MatDialogRef<AlertDialogComponent, void>

  readonly data: AlertDialogOptions = inject(MAT_DIALOG_DATA)

  @ViewChild('message')
  readonly message!: ElementRef<HTMLElement>

  ngAfterViewInit() {
    this.message.nativeElement.innerText = this.data.message?.trim() ?? ''
  }

}

type AlertDialogOptions = {
  title: string
  message?: string

  acceptText?: string
  acceptBgColor?: string
  acceptColor?: string

  /**
   * Whether the user can use escape or clicking on the backdrop to close the modal.
   */
  disableClose?: boolean

  showAsError?: boolean
}

export async function openAlertDialog(options: AlertDialogOptions) {
  type DialogArg = typeof options
  type DialogResult = Awaited<ReturnType<typeof openAlertDialog>>

  const dialog = AppModule.dialog

  const dialogRef = dialog.open<AlertDialogComponent, DialogArg, DialogResult>(AlertDialogComponent, {
    data: options,

    // Whether the user can use escape or clicking on the backdrop to close the modal.
    disableClose: options.disableClose ?? true,
  })

  dialogRef

  await lastValueFrom(dialogRef.afterClosed())
}
