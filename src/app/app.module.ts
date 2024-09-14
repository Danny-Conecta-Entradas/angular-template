import { inject, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

// Components
import { BackButtonComponent } from 'src/app/components/back-button/back-button.component'
import { FilePickerComponent } from 'src/app/components/file-picker/file-picker.component'
import { GoogleSignInBtnComponent } from 'src/app/components/google-sign-in-btn/google-sign-in-btn.component'

// Directives
import { DelayedIfDirective } from 'src/app/directives/delayed-if.directive'
import { ExactActiveRouterLinkDirective } from 'src/app/directives/exact-active-router-link.directive'
import { InputDragoverFocusDirective } from 'src/app/directives/input-dragover-focus.directive'
import { TypeButtonDirective } from 'src/app/directives/type-button.directive'

// Material
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatBadgeModule } from '@angular/material/badge'
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatButtonModule } from '@angular/material/button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
// import { MatCommonModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field'
// import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatRippleModule } from '@angular/material/core'
import { MAT_SELECT_CONFIG, MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSortModule } from '@angular/material/sort'
import { MatStepperModule } from '@angular/material/stepper'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatTreeModule } from '@angular/material/tree'

// Pages
import { TemplateReferenceMainPage } from './pages/template-reference/main/main.page'


@NgModule({
  declarations: [
    AppComponent,

    // Pages
    TemplateReferenceMainPage,

    // Components

    // Directives
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    // Standalone Components
    BackButtonComponent,
    FilePickerComponent,
    GoogleSignInBtnComponent,

    // Standalone Directives
    DelayedIfDirective,
    ExactActiveRouterLinkDirective,
    InputDragoverFocusDirective,
    TypeButtonDirective,

    // Material
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    // MatCommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    // MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  providers: [
    // https://stackoverflow.com/questions/53684763/how-to-remove-space-bottom-mat-form-field
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
        appearance: 'outline',
      },
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: {
        // panelWidth: null,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  static readonly dialog: MatDialog

  static readonly bottomSheet: MatBottomSheet

  static readonly snackBar: MatSnackBar

  constructor() {
    // @ts-ignore
    AppModule.dialog = inject(MatDialog)

    // @ts-ignore
    AppModule.bottomSheet = inject(MatBottomSheet)

    // @ts-ignore
    AppModule.snackBar = inject(MatSnackBar)
  }

}
