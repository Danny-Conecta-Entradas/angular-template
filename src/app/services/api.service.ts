import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { lastValueFrom } from 'rxjs'

import environment from 'src/environments/environment'
import AuthService from 'src/app/services/auth.service'


type URLParams = {
  [key: string]: unknown
}

type API_GET_Collection_Response<T = unknown> = Readonly<{

  items: null | T[]

  limit: number

  offset: number

  next_offset: number | null

  previous_offset: number | null

}>



@Injectable({providedIn: 'root'})
export default class APIService {

  readonly #http = inject(HttpClient)

  readonly apiURL = environment.apiURL

  readonly #authService = inject(AuthService)


  readonly #apiPrefix = 'api'

  async #getEntity<T = unknown>(entityPath: string, params?: URLParams) {
    params ??= {}

    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }

    const data = await lastValueFrom(
      this.#http.get(url.toString(), {
        // headers: {
        //   'Authorization': `Bearer ${idToken}`,
        // },
      })
    ) as T

    return data
  }

  async #getAllEntities<T = unknown>(entityPath: string, params?: URLParams) {
    params ??= {}

    const response = await this.#getEntity<API_GET_Collection_Response<T>>(entityPath, params)

    return response
  }

  async #postEntity<T = never>(entityPath: string, body: T) {
    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    return await lastValueFrom(
      this.#http.post(url.toString(), body, {
        // headers: {
        //   'Authorization': `Bearer ${idToken}`,
        // },
      })
    )
  }

  async #putEntity<T = never>(entityPath: string, id: string, body: T) {
    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}/${id}`, this.apiURL)

    return await lastValueFrom(
      this.#http.put(url.toString(), body, {
        // headers: {
        //   'Authorization': `Bearer ${idToken}`,
        // },
      })
    )
  }

  async #deleteEntity(entityPath: string, params?: URLParams) {
    params ??= {}

    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }

    const data = await lastValueFrom(
      this.#http.delete(url.toString(), {
        // headers: {
        //   'Authorization': `Bearer ${idToken}`,
        // },
      })
    )

    return data
  }

}
