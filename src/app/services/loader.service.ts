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

      this.#runListeners()

      if (LoaderService.#instancesWithLoadingState.size === 1) {
        LoaderService.#globalLoaderResolver = createPromiseResolver()
        this.#runGlobalListeners()
      }
    }
    else {
      LoaderService.#instancesWithLoadingState.delete(this)
      this.#runListeners()

      this.#loaderResolver.resolve()

      if (LoaderService.#instancesWithLoadingState.size === 0) {
        this.#runGlobalListeners()
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

  // Listeners

  readonly #listenersCollection = new Set<LoaderService.LoaderListener>()

  addListener<T extends LoaderService.LoaderListenerOptions>(listener: LoaderService.LoaderListener, options?: T)
  : T extends LoaderService.LoaderListenerOptions
      ? T['signal'] extends AbortSignal
        ? void
        : LoaderService.LoaderRemoveListenerFunc
      : LoaderService.LoaderRemoveListenerFunc
  {
    // @ts-ignore
    options ??= {}

    this.#listenersCollection.add(listener)

    // @ts-ignore
    if (options.signal != null) {
      // @ts-ignore
      options.signal.addEventListener('abort', event => {
        if (!event.isTrusted) {
          return
        }

        this.removeListener(listener)
      })
      // @ts-ignore
      return
    }

    // @ts-ignore
    return () => {
      this.removeListener(listener)
    }
  }

  removeListener(listener: LoaderService.LoaderListener) {
    this.#listenersCollection.delete(listener)
  }

  #runListeners() {
    for (const listener of this.#listenersCollection) {
      try {
        listener(this.#loadingState)
      }
      catch (reason) {
        console.error(reason)
      }
    }
  }


  // Global Listeners

  readonly #globalListenersCollection = new Set<LoaderService.GlobalLoaderListener>()

  addGlobalListener<T extends LoaderService.GlobalLoaderListenerOptions>(listener: LoaderService.GlobalLoaderListener, options?: T)
  : T extends LoaderService.GlobalLoaderListenerOptions
      ? T['signal'] extends AbortSignal
        ? void
        : LoaderService.GlobalLoaderRemoveListenerFunc
      : LoaderService.GlobalLoaderRemoveListenerFunc
  {
    // @ts-ignore
    options ??= {}

    this.#globalListenersCollection.add(listener)

    // @ts-ignore
    if (options.signal != null) {
      // @ts-ignore
      options.signal.addEventListener('abort', event => {
        if (!event.isTrusted) {
          return
        }

        this.removeGlobalListener(listener)
      })
      // @ts-ignore
      return
    }

    // @ts-ignore
    return () => {
      this.removeGlobalListener(listener)
    }
  }

  removeGlobalListener(listener: LoaderService.GlobalLoaderListener) {
    this.#globalListenersCollection.delete(listener)
  }

  #runGlobalListeners() {
    for (const listener of this.#globalListenersCollection) {
      try {
        listener(this.hasGlobalLoadingState())
      }
      catch (reason) {
        console.error(reason)
      }
    }
  }

}

module LoaderService {

  export type LoaderListener = (state: boolean) => void

  export type LoaderRemoveListenerFunc = () => void

  export type LoaderListenerOptions = {

    signal?: AbortSignal

  }

  export type GlobalLoaderListener = (state: boolean) => void

  export type GlobalLoaderRemoveListenerFunc = () => void

  export type GlobalLoaderListenerOptions = {

    signal?: AbortSignal

  }

}
