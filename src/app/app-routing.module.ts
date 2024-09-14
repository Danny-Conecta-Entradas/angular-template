import { inject, NgModule } from '@angular/core'
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router'
import { TemplateReferenceMainPage } from 'src/app/pages/template-reference/main/main.page'

import AuthService from 'src/app/services/auth.service'


// Guard used to handle redirect logic in root path: '/'
const redirectGuard: CanActivateFn = async (route, state) => {
  if (state.url !== '/') {
    throw new Error(`Redirect guard must be used in root path: '/'`)
  }

  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isUserLogged()) {
    await router.navigateByUrl('/home', {replaceUrl: true})
  }
  else {
    await router.navigateByUrl('/login', {replaceUrl: true})
  }

  const canActivate = true
  return canActivate
}

const routes: Routes = [
  /* Template Routes for reference */
  {
    path: 'template-reference/main',
    component: TemplateReferenceMainPage,
  },


  /* App Routes */
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   canActivate: [publicGuard],
  // },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   canActivate: [redirectGuard],
  //   children: [],
  // },
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
