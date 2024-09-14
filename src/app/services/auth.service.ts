import { Injectable } from '@angular/core'

import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,
  sendPasswordResetEmail, confirmPasswordReset, onAuthStateChanged, updateProfile, sendEmailVerification, User,
  Auth,
} from 'firebase/auth'

import environment from 'src/environments/environment'


@Injectable({providedIn: 'root'})
export default class AuthService {

  constructor() {
    this.waitForAuthStateReady().finally(() => {
      this.#isAuthStateReady = true
    })
  }

  // TODO: Uncomment when Firebase config is set up
  // readonly auth = getAuth(environment.firebaseApp)

  // TODO: Remove when Firebase config is set up
  readonly auth = {} as Auth

  async logIn(options: {email: string, password: string}) {
    const userCredentials = await signInWithEmailAndPassword(this.auth, options.email, options.password)

    return userCredentials
  }

  async logOut() {
    await this.auth.signOut()
  }

  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email)
  }

  async signInWithGoogle() {
    // https://firebase.google.com/docs/auth/web/google-signin
    const provider = new GoogleAuthProvider()

    const credentials = await signInWithPopup(this.auth, provider)

    return credentials
  }

  /**
   * Docs: https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
   * 
   * Modify verfication email template: https://console.firebase.google.com/u/0/project/acreditados-dev/authentication/emails
   */
  async sendEmailVerification(user: User) {
    await sendEmailVerification(user)
  }

  getCurrentUser() {
    return this.auth.currentUser
  }

  isUserLogged() {
    return Boolean(this.getCurrentUser())
  }

  async waitForAuthStateReady() {
    await this.auth.authStateReady()
  }

  #isAuthStateReady = false

  get isAuthStateReady() {
    return this.#isAuthStateReady
  }

  async getIdToken() {
    await this.waitForAuthStateReady()

    const user = this.getCurrentUser()

    if (user == null) {
      return null
    }

    return user.getIdToken()
  }

  async getIdTokenResult() {
    await this.waitForAuthStateReady()

    const user = this.getCurrentUser()

    if (user == null) {
      return null
    }

    const idTokenResult = await user.getIdTokenResult()

    return idTokenResult
  }

  async getCustomClaims() {
    const idTokenResult = await this.getIdTokenResult()

    if (idTokenResult == null) {
      return null
    }

    const customClaims = idTokenResult.claims

    return customClaims
  }

}
