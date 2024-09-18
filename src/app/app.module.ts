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
import { InputAutofillDirective } from 'src/app/directives/input-autofill.directive'
import { TypeButtonDirective } from 'src/app/directives/type-button.directive'

// Pages
import { TemplateReferenceMainPage } from './pages/template-reference/main/main.page'
import { MaterialModule } from 'src/app/modules/material.module'
import { ElementRefDirective } from 'src/app/directives/element-ref.directive'


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
    InputAutofillDirective,
    TypeButtonDirective,
    ElementRefDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
