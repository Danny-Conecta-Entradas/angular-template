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
import { MaterialModule } from 'src/app/modules/material.module'


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

    MaterialModule,

    // Standalone Components
    BackButtonComponent,
    FilePickerComponent,
    GoogleSignInBtnComponent,

    // Standalone Directives
    DelayedIfDirective,
    ExactActiveRouterLinkDirective,
    InputDragoverFocusDirective,
    TypeButtonDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
