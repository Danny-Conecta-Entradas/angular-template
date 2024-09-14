// https://stackoverflow.com/a/49670389/18241830

type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

export function deepFreeze<T extends {[idx: string]: Readonly<U | null | undefined | object>}, U extends string | bigint | number | boolean | symbol>(object: T): DeepReadonly<T> {
  Object.freeze(object)

  for (const value of Object.values(object)) {
    if (value != null && (typeof value === 'object' || typeof value === 'function')) {
      //@ts-ignore
      deepFreeze(value)
    }
  }

  // @ts-ignore
  return object
}



export function createObjectWithGetterAccessors<T>(objectAccesorDefinition: {readonly [key in keyof T]: () => T[key]})  {
  type Arg = typeof objectAccesorDefinition

  const object = {} as {readonly [key in keyof Arg]: ReturnType<Arg[key]>}

  for (const [key, value] of Object.entries(objectAccesorDefinition)) {
    Object.defineProperty(object, key, {
      get: value as () => unknown,
      enumerable: true,
    })
  }

  return object
}


export async function assignAsync(target: {[key: PropertyKey]: unknown}, ...asyncSources: {[key: PropertyKey]: unknown | Promise<unknown>}[]) {

  const propertyIsEnumerable = (target: {[key: PropertyKey]: unknown}, property: PropertyKey) => {
    return Object.prototype.propertyIsEnumerable.call(target, property)
  }

  const sources = await Promise.all(
    asyncSources
    .filter(asyncSource => asyncSource != null)
    .map(async asyncSource => {

      const asyncSourceOwnEnumerableProperties = (
        Reflect.ownKeys(asyncSource)
        .filter(property => propertyIsEnumerable(asyncSource, property))
      )

      /**
       * @type {{[key: PropertyKey]: unknown}}
       */
      const source: {[key: PropertyKey]: unknown} = {}

      await Promise.all(
        asyncSourceOwnEnumerableProperties.map(property => {
          const valueOrPromise = asyncSource[property]

          if (valueOrPromise instanceof Promise) {
            return valueOrPromise.then(value => {
              source[property] = value
            })
          }

          source[property] = valueOrPromise

          return
        })
      )

      return source

    })
  )

  Object.assign(target, ...sources)

  return target

}
