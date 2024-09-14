import { Component, Input, inject } from '@angular/core'
import { Router } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  standalone: true,

  selector: 'back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],

  imports: [
    MatButtonModule,
    MatIconModule,
  ],
})
export class BackButtonComponent {

  readonly #router = inject(Router)

  @Input()
  route: string | null = null

  goBack() {
    if (typeof this.route === 'string') {
      this.#router.navigateByUrl(this.route)
      return
    }

    const goBackPath = location.href.endsWith('/') ? '../' : './'
    const defaultRoute = (
      new URL(goBackPath, location.href)
      .toString()
      .replace(location.origin, '')
      .slice(0, -1)
    )

    this.#router.navigateByUrl(defaultRoute)
  }

}
