import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, inject, Optional } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { lastValueFrom } from 'rxjs'

import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { AppComponent } from 'src/app/app.component'


/*********************************************************/
/* Generic Template for building ready to use Modals */
/*********************************************************/


type ModalComponent = ModalTemplate

type ModalData = void

type ModalResult = void

@Component({
  standalone: true,

  host: {
    'data-apply-material-overrides': '',
  },

  selector: 'modal-template',
  templateUrl: 'modal-template.html',
  styleUrls: ['modal-template.css'],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
})
export class ModalTemplate implements AfterViewInit {

  /* Modal Logic */

  // MatDialog

  readonly dialogRef = inject(MatDialogRef, {optional: true}) as null | MatDialogRef<ModalComponent, ModalResult>

  readonly dialogData: null | ModalData = inject(MAT_DIALOG_DATA, {optional: true})


  // MatBottomSheet

  readonly bottomSheetRef = inject(MatBottomSheetRef, {optional: true}) as null | MatBottomSheetRef<ModalComponent, ModalResult>

  readonly bottomSheetData: null | ModalData = inject(MAT_BOTTOM_SHEET_DATA, {optional: true})


  readonly modalRef: MatDialogRef<ModalComponent, ModalResult> | MatBottomSheetRef<ModalComponent, ModalResult>

  readonly modalData: ModalData


  readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>

  constructor() {
    this.modalRef = this.dialogRef != null ? this.dialogRef : this.bottomSheetRef!
    this.modalData = this.dialogData != null ? this.dialogData : this.bottomSheetData!

    if (this.modalRef instanceof MatBottomSheetRef) {
      this.elementRef.nativeElement.classList.add('-is-bottom-sheet')
    }
    else {
      this.elementRef.nativeElement.classList.add('-is-dialog')
    }
  }

  get isDialog() {
    return this.modalRef instanceof MatDialogRef
  }

  get isBottomSheet() {
    return this.modalRef instanceof MatBottomSheetRef
  }

  /**
   * Close Modal without passing result data.
   */
  closeModal() {
    if (this.modalRef instanceof MatDialogRef) {
      this.modalRef.close()
    }
    else {
      this.modalRef!.dismiss()
    }
  }

  /**
   * Close Modal and set Modal result data.
   */
  submitModal(data: ModalResult) {
    if (this.modalRef instanceof MatDialogRef) {
      this.modalRef.close(data)
    }
    else {
      this.modalRef!.dismiss(data)
    }
  }

  /* Component Logic */

  ngAfterViewInit() {
    window.setTimeout(() => this.init(), 0)
  }

  async init() {

  }

}


type ModalOptions = {

  /**
   * Display the Component as a MatBottomSheet.  
   * By default it displays as a MatDialog.
   * 
   * Default value `false`
   */
  asBottomSheet?: boolean

  /**
   * Whether the user can use escape or clicking on the backdrop to close the modal.
   * 
   * Default value `false`
   */
  disableClose?: boolean

}


export async function openModalTemplate(options?: ModalOptions) {
  if (options?.asBottomSheet) {
    const bottomSheet = AppComponent.injectWithContext(MatBottomSheet)

    const bottomSheetRef = bottomSheet.open<ModalComponent, ModalOptions, ModalResult>(ModalTemplate, {
      data: options,
  
      disableClose: options.disableClose ?? false,
    })
  
    const bottomSheetResult = await lastValueFrom(bottomSheetRef.afterDismissed())
  
    return bottomSheetResult
  }

  const dialog = AppComponent.injectWithContext(MatDialog)

  const dialogRef = dialog.open<ModalComponent, ModalOptions, ModalResult>(ModalTemplate, {
    data: options,

    disableClose: options?.disableClose ?? false,
  })

  const dialogResult = await lastValueFrom(dialogRef.afterClosed())

  return dialogResult
}
