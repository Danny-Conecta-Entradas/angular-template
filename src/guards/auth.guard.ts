import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import AuthService from 'src/services/auth.service'

const getAuthService = () => inject(AuthService)

export const publicGuard: CanActivateFn = async () => {
  const authService = getAuthService()
  const router = inject(Router)

  await authService.auth.authStateReady()

  const user = authService.auth.currentUser

  if (user) {
    router.navigateByUrl('/home', {replaceUrl: true})
  }

  const canAccess = user === null

  return canAccess
}

export const authGuard: CanActivateFn = async () => {
  const authService = getAuthService()
  const router = inject(Router)

  await authService.auth.authStateReady()

  const user = authService.auth.currentUser

  if (!user) {
    router.navigateByUrl('/login', {replaceUrl: true})
  }

  const canAccess = user !== null

  return canAccess
}
