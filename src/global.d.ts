// Add type definitions for APIs that are available in the browser
// but not in the workspace TypeScript version or in TypeScrip in general.

interface PromiseConstructor {

  withResolvers<T>(): {

    promise: Promise<T>

    resolve(value?: T): void

    reject(reason?: unknown): void

  }

}

interface ArrayConstructor {

  fromAsync<T>(arrayLike: ArrayLike<T>): Promise<Array<T>>

  fromAsync<T, R>(arrayLike: ArrayLike<T>, mapFn: (item: T, index: number) => R): Promise<Array<R>>

  fromAsync<T, R, ThisArg>(arrayLike: ArrayLike<T>, mapFn: (item: T, index: number) => R, thisArg: ThisArg): Promise<Array<R>>

}

interface Array<T> {

  toReversed(): Array<T>

  toSorted(compareFn: (itemA: T, itemB: T) => number): Array<T>

  toSpliced(start: number): Array<T>

  toSpliced(start: number, deleteCount: number): Array<T>

  toSpliced(start: number, deleteCount: number, ...items: T[]): Array<T>

  with(index: number, value: T): Array<T>

  findLast<ThisArg>(callbackFn: (item: T, index: number, array: this) => void): T

  findLast<ThisArg>(callbackFn: (item: T, index: number, array: this) => void, thisArg: ThisArg): T

  findLastIndex<ThisArg>(callbackFn: (item: T, index: number, array: this) => void): number

  findLastIndex<ThisArg>(callbackFn: (item: T, index: number, array: this) => void, thisArg: ThisArg): number

}

type HighEntrotyHints = (
  | 'architecture'
  | 'bitness'
  | 'formFactor'
  | 'fullVersionList'
  | 'model'
  | 'platformVersion'
  | 'uaFullVersion'
  | 'wow64'
)

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
 */
type UserAgentData = {

  get platform(): string

  get mobile(): boolean

  get brands(): Array<{brand: string, version: string}>

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/getHighEntropyValues}
   */
  getHighEntropyValues(hints: Array<HighEntrotyHints>): Promise<
    & UserAgentDataJSON
    & Partial<{
      architecture: string
      bitness: string
      fullVersionList: Array<{brand: string, version: string}>
      model: string
      platformVersion: string
      uaFullVersion: string
      wow64: boolean
    }>
  >

  toJSON(): UserAgentDataJSON
}

type UserAgentDataJSON = import('src/utils/types.utils').NonFunctionProperties<UserAgentData>

interface Navigator {

  /**
   * Experimental. Check browser support.  
   * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
   */
  readonly userAgentData?: UserAgentData

}

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator}
 */
interface Iterator<T, TReturn = any, TNext = undefined> {

  drop(limit: number): Iterator<T, TReturn, TNext>

  every(callbackFn: (item: T, index: number) => boolean): boolean

  find(callbackFn: (item: T, index: number) => boolean): Iterator<T, TReturn, TNext>

  flatMap(callbackFn: (item: T, index: number) => Iterable<T>): Iterator<T, TReturn, TNext>

  forEach(callbackFn: (item: T, index: number) => void): Iterator<T, TReturn, TNext>

  map<R>(callbackFn: (item: T, index: number) => R): Iterator<R, TReturn, TNext>

  reduce<R>(callbackFn: (accumulator: R, currentValue: T, currentIndex: number) => R): Iterator<R, TReturn, TNext>

  reduce<R>(callbackFn: (accumulator: R, currentValue: T, currentIndex: number) => R, initialValue: R): Iterator<R, TReturn, TNext>

  some(callbackFn: (item: T, index: number) => boolean): boolean
  
  [Symbol.iterator](): Iterator<T, TReturn, TNext>

  take(limit: number): Iterator<T, TReturn, TNext>

  toArray(): Array<T>

}


interface Set<T> {

  difference(other: Set<T>): Set<T>

  intersection(other: Set<T>): Set<T>

  isDisjointFrom(other: Set<T>): Set<T>

  isSubsetOf(other: Set<T>): Set<T>

  isSupersetOf(other: Set<T>): Set<T>

  symmetricDifference(other: Set<T>): Set<T>

  union(other: Set<T>): Set<T>

}
