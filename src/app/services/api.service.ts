import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import environment from 'src/environments/environment'
import AuthService from 'src/app/services/auth.service'


type URLParams = {
  [key: string]: unknown
}

type RequestOptions = {

  params?: URLParams

  signal?: AbortSignal

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

  async #getEntity<T = unknown>(entityPath: string, options?: RequestOptions) {
    options ??= {}
    options.params ??= {}

    if (options.signal != null && options.signal.aborted) {
      throw new Error(`Cannot use an already aborted AbortSignal to abort the request.`)
    }

    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    for (const [key, value] of Object.entries(options.params)) {
      // Dont't add nullable values
      if (value == null) {
        continue
      }

      url.searchParams.set(key, String(value))
    }

    // Create request
    const requestObservable = this.#http.get(url.toString(), {
      // headers: {
      //   'Authorization': `Bearer ${idToken}`,
      // },
    }) as Observable<T>

    return new Promise<T>((resolve, reject) => {
      // Send request
      const subscription = requestObservable.subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (reason) => {
          reject(reason)
        },
      })

      if (options!.signal) {
        options!.signal.addEventListener('abort', event => {
          if (!event.isTrusted) {
            return
          }

          // Cancel request
          subscription.unsubscribe()

          reject(options!.signal!.reason)
        })
      }
    })
  }

  async #getAllEntities<T = unknown>(entityPath: string, options?: RequestOptions) {
    options ??= {}
    options.params ??= {}

    if (!Object.hasOwn(options.params, 'limit')) {
      options.params['limit'] = 5000
    }

    const response = await this.#getEntity<API_GET_Collection_Response<T>>(entityPath, options)

    return response
  }

  async #postEntity(entityPath: string, body: unknown, options?: RequestOptions) {
    options ??= {}
    options.params ??= {}

    if (options.signal != null && options.signal.aborted) {
      throw new Error(`Cannot use an already aborted AbortSignal to abort the request.`)
    }
    
    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    for (const [key, value] of Object.entries(options.params)) {
      // Dont't add nullable values
      if (value == null) {
        continue
      }

      url.searchParams.set(key, String(value))
    }

    // Create request
    const requestObservable = this.#http.post(url.toString(), body, {
      // headers: {
      //   'Authorization': `Bearer ${idToken}`,
      // },
    })

    return new Promise<Object>((resolve, reject) => {
      // Send request
      const subscription = requestObservable.subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (reason) => {
          reject(reason)
        },
      })

      if (options!.signal) {
        options!.signal.addEventListener('abort', event => {
          if (!event.isTrusted) {
            return
          }

          // Cancel request
          subscription.unsubscribe()

          reject(options!.signal!.reason)
        })
      }
    })
  }

  async #putEntity(entityPath: string, body: unknown, options?: RequestOptions) {
    options ??= {}
    options.params ??= {}

    if (options.signal != null && options.signal.aborted) {
      throw new Error(`Cannot use an already aborted AbortSignal to abort the request.`)
    }

    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    for (const [key, value] of Object.entries(options.params)) {
      // Dont't add nullable values
      if (value == null) {
        continue
      }

      url.searchParams.set(key, String(value))
    }

    // Create request
    const requestObservable = this.#http.put(url.toString(), body, {
      // headers: {
      //   'Authorization': `Bearer ${idToken}`,
      // },
    })

    return new Promise<Object>((resolve, reject) => {
      // Send request
      const subscription = requestObservable.subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (reason) => {
          reject(reason)
        },
      })

      if (options!.signal) {
        options!.signal.addEventListener('abort', event => {
          if (!event.isTrusted) {
            return
          }

          // Cancel request
          subscription.unsubscribe()

          reject(options!.signal!.reason)
        })
      }
    })
  }

  async #deleteEntity(entityPath: string, options?: RequestOptions) {
    options ??= {}
    options.params ??= {}

    if (options.signal != null && options.signal.aborted) {
      throw new Error(`Cannot use an already aborted AbortSignal to abort the request.`)
    }

    // const idToken = await this.#authService.getIdToken()

    // if (idToken == null) {
    //   throw new Error(`Cannot do requests with a null IdToken`)
    // }

    const url = new URL(`/${this.#apiPrefix}/${entityPath}`, this.apiURL)

    for (const [key, value] of Object.entries(options.params)) {
      // Dont't add nullable values
      if (value == null) {
        continue
      }

      url.searchParams.set(key, String(value))
    }

    // Create request
    const requestObservable = this.#http.delete(url.toString(), {
      // headers: {
      //   'Authorization': `Bearer ${idToken}`,
      // },
    })

    return new Promise<Object>((resolve, reject) => {
      // Send request
      const subscription = requestObservable.subscribe({
        next: (data) => {
          resolve(data)
        },
        error: (reason) => {
          reject(reason)
        },
      })

      if (options!.signal) {
        options!.signal.addEventListener('abort', event => {
          if (!event.isTrusted) {
            return
          }

          // Cancel request
          subscription.unsubscribe()

          reject(options!.signal!.reason)
        })
      }
    })
  }

}
