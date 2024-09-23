function createPromiseResolver() {
  const promiseResolvers = Promise.withResolvers<void>()

  const resolver = {
    promise: promiseResolvers.promise,
    resolve: promiseResolvers.resolve,
  }

  return resolver
}


/**
 * This class cannot be an Injectable because of the private static properties.
 */
export default class LoaderService {

  static #instancesWithLoadingState = new Set<LoaderService>()

  hasGlobalLoadingState() {
    return LoaderService.#instancesWithLoadingState.size > 0
  }

  static #globalLoaderResolver: ReturnType<typeof createPromiseResolver>

  #loaderResolver!: ReturnType<typeof createPromiseResolver>

  #loadingState = false

  setLoadingState(state: boolean) {
    this.#loadingState = state

    if (state) {
      this.#loaderResolver = createPromiseResolver()
      LoaderService.#instancesWithLoadingState.add(this)

      if (LoaderService.#instancesWithLoadingState.size === 1) {
        LoaderService.#globalLoaderResolver = createPromiseResolver()
      }
    }
    else {
      this.#loaderResolver.resolve()
      LoaderService.#instancesWithLoadingState.delete(this)

      if (LoaderService.#instancesWithLoadingState.size === 0) {
        LoaderService.#globalLoaderResolver.resolve()
      }
    }
  }

  toggleLoadingState() {
    this.setLoadingState(!this.#loadingState)

    return this.#loadingState
  }

  async runLoadingProcess(callback: () => Promise<void>) {
    this.setLoadingState(true)

    try {
      await callback()
    }
    finally {
      this.setLoadingState(false)
    }
  }

  isLoading() {
    return this.#loadingState
  }

  async waitForLoadFinish() {
    if (!this.isLoading()) {
      return
    }

    await this.#loaderResolver.promise
  }

  async waitForGlobalLoadFinish() {
    if (!this.hasGlobalLoadingState()) {
      return
    }

    await LoaderService.#globalLoaderResolver.promise
  }

}
