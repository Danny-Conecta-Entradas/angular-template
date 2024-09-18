import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import environment from 'src/environments/environment'


@Injectable({providedIn: 'root'})
export default class APIService {

  readonly #http = inject(HttpClient)

  readonly apiURL = environment.apiURL

}
