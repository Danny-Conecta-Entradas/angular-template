import { AfterViewInit, Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core'
import { FirebaseError } from 'firebase/app'
import { UserCredential } from 'firebase/auth'
import { MatButtonModule } from '@angular/material/button'

import AuthService from 'src/app/services/auth.service'

@Component({
  standalone: true,

  selector: 'google-sign-in-btn',
  templateUrl: './google-sign-in-btn.component.html',
  styleUrls: ['./google-sign-in-btn.component.css'],

  imports: [
    MatButtonModule,
  ],
})
export class GoogleSignInBtnComponent implements AfterViewInit {

  // @Input({alias: 'with-redirect'})
  // withRedirect = false

  // @Output()
  // readonly onRedirectSuccess = new EventEmitter<UserCredential>()

  // @Output()
  // readonly onRedirectFailure = new EventEmitter<FirebaseError>()

  @Output()
  readonly onSignInSuccess = new EventEmitter<UserCredential>()

  @Output()
  readonly onSignInFailure = new EventEmitter<FirebaseError>()

  readonly #authService = inject(AuthService)

  @HostListener('click')
  async onSelfClick() {
    // if (this.withRedirect) {
    //   await this.#authService.signInWithGoogleWithRedirect()

    //   return
    // }

    const result = await this.#authService.signInWithGoogle().catch(reason => reason as FirebaseError)

    console.log({result})

    if (result instanceof FirebaseError) {
      this.onSignInFailure.emit(result)
      return
    }

    if (result === null) {
      return
    }

    this.onSignInSuccess.emit(result)
  }

  async ngAfterViewInit() {
    // if (!this.withRedirect) {
    //   return
    // }

    // const result = await this.#authService.getRedirectResult().catch(reason => reason as FirebaseError)

    // console.log({result})

    // if (result instanceof FirebaseError) {
    //   this.onRedirectFailure.emit(result)
    //   return
    // }

    // if (!result) {
    //   return
    // }

    // this.onRedirectSuccess.emit(result)
  }

}
