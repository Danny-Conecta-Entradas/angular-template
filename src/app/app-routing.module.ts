import { inject, NgModule } from '@angular/core'
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router'
import { TemplateReferenceMainPage } from 'src/app/pages/template-reference/main/template-reference-main.page'
import MultiRoutePage from 'src/app/pages/template-reference/multi-route-page/multi-route.page'

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

  /*
    Use same component for multiple routes
    without recreating the component when navigating
  */
  {
    matcher: (segments, group, route) => {
      const path = '/' + segments.map(segment => segment.path).join('/')

      if (path === '/template-reference/multi-route-one' || path === '/template-reference/multi-route-two') {
        return {consumed: segments}
      }

      // Not match found
      return null
    },
    component: MultiRoutePage,
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
