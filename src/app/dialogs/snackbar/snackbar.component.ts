import { Component, ElementRef, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { lastValueFrom } from 'rxjs'

import { MaterialModule } from 'src/app/modules/material.module'
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { AppComponent } from 'src/app/app.component'


@Component({
  standalone: true,

  host: {
    'data-apply-material-overrides': '',
  },

  selector: 'snackbar-component',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],

  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
  ],
})
export class SnackBarComponent {

  readonly snackBarRef = inject(MatSnackBarRef)

  readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>

  readonly data: OpenSnackBarOptions = inject(MAT_SNACK_BAR_DATA)

  constructor() {
    if (this.data.showAsError) {
      this.elementRef.nativeElement.classList.add('-error')
    }
  }

}


type OpenSnackBarOptions = {

  message: string

  showAsError?: boolean

}

export function openSnackBar(options: OpenSnackBarOptions & Pick<MatSnackBarConfig, 'duration' | 'horizontalPosition' | 'verticalPosition'>) {
  const snackBar = AppComponent.injectWithContext(MatSnackBar)

  const snackBarRef = snackBar.openFromComponent(SnackBarComponent, {

    data: {
      message: options.message,
      showAsError: options.showAsError,
    },

    duration: (
      options.duration ?? (
        options.showAsError ? 8000 : 4000
      )
    ),
    horizontalPosition: options.horizontalPosition ?? 'center',
    verticalPosition: options.verticalPosition ?? 'bottom',

  })

  return lastValueFrom(snackBarRef.afterDismissed()).then(() => {})
}
