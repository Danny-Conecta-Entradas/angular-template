/**
  @example
  ```js
  const Types = createEnum(class TypesEnum {
    readonly ACTIVE = 'ACTIVE'
    readonly INACTIVE = 'INACTIVE'
  })

  console.log('Iterable (values)', [...Types])

  console.log('Keys', [...Types.keys()])
  console.log('Values', [...Types.values()])
  console.log('Entries', [...Types.entries()])

  console.log('Has', Types.has(Types.ACTIVE))
  console.log('Not Has', Types.has('not a value in enum'))
  ```
 */
export function createEnum<T extends new () => InstanceType<T>>(enumClass: T): Readonly<{[key in keyof InstanceType<T>]: InstanceType<T>[key]}> & EnumClass {
  const enumInstance = new EnumClass(new enumClass())

  Object.setPrototypeOf(enumInstance, EnumClass.prototype)
  Object.freeze(enumInstance)

  // @ts-ignore
  return enumInstance
}


// Test

// const Types = createEnum(class TypesEnum {
//   readonly ACTIVE = 'ACTIVE'
//   readonly INACTIVE = 'INACTIVE'
// })

// console.log(Types)

// console.log('Iterable (values)', [...Types])

// console.log('Keys', [...Types.keys()])
// console.log('Values', [...Types.values()])
// console.log('Entries', [...Types.entries()])

// console.log('Has', Types.has(Types.ACTIVE))
// console.log('Not Has', Types.has('not a value in enum'))





class EnumClass extends class {

  constructor(target) {
    return target
  }

} {

  static {
    Object.defineProperty(this.prototype, Symbol.toStringTag, {value: `${this.name}Prototype`})
    Object.setPrototypeOf(this.prototype, null)
  }

  constructor(target) {
    super(target)

    for (const [key, value] of Object.entries(this)) {
      this.#enumKeyValuePairs.set(key, value)
      this.#enumValues.add(value)
    }
  }

  readonly #enumKeyValuePairs = new Map()

  readonly #enumValues = new Set()

  has(value: unknown) {
    return this.#enumValues.has(value)
  }

  keys() {
    return this.#enumKeyValuePairs.keys()
  }

  values() {
    return this.#enumKeyValuePairs.values()
  }

  entries() {
    return this.#enumKeyValuePairs.entries()
  }

  ;*[Symbol.iterator]() {
    yield* this.values()
  }

  static {
    Object.freeze(this)
  }

}
