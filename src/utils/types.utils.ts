// https://stackoverflow.com/a/61132308/18241830
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]+?: DeepPartial<T[P]>
} : T

export type ExtractKeys<T, K> = Extract<keyof T, K>

export type ExtractValues<T, K = any> = Extract<T[keyof T], K>


/**
 * {@link https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609}
 * {@link https://github.com/microsoft/TypeScript/issues/29729#issuecomment-2150929138}
 * {@link https://github.com/sindresorhus/type-fest/blob/cabce984e5c19558f2f0061c3cd9488a945f60e6/source/literal-union.d.ts}
 */
export type UnionOrType<T extends U, U> = T | (U & Record<never, never>)


/**
 * {@link https://stackoverflow.com/a/70643986/18241830}
 */
export function enumObject<T extends Readonly<Record<PropertyKey, PropertyKey>>>(obj: T, ..._lockParams: T extends { [K in keyof T]: K } ? [] : [never]): T {
  return obj as any
}


/**
 * {@link https://github.com/sindresorhus/type-fest}
 */
export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint

/**
 * {@link https://github.com/sindresorhus/type-fest}
 */
type BuiltIns = Primitive | void | Date | RegExp

/**
 * {@link https://github.com/sindresorhus/type-fest}
 */
type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
	T extends {(...arguments_: infer A): unknown; (...arguments_: infer B): unknown}
		? B extends A
			? A extends B
				? false
				: true
			: true
		: false

/**
 * {@link https://github.com/sindresorhus/type-fest}
 */
export type DeepReadonly<T> = T extends BuiltIns
	? T
	: T extends new (...arguments_: any[]) => unknown
		? T // Skip class constructors
		: T extends (...arguments_: any[]) => unknown
			? {} extends ReadonlyObjectDeep<T>
				? T
				: HasMultipleCallSignatures<T> extends true
					? T
					: ((...arguments_: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T>
			: T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
				? ReadonlyMapDeep<KeyType, ValueType>
				: T extends Readonly<ReadonlySet<infer ItemType>>
					? ReadonlySetDeep<ItemType>
					: // Identify tuples to avoid converting them to arrays inadvertently; special case `readonly [...never[]]`, as it emerges undesirably from recursive invocations of ReadonlyDeep below.
					T extends readonly [] | readonly [...never[]]
						? readonly []
						: T extends readonly [infer U, ...infer V]
							? readonly [DeepReadonly<U>, ...DeepReadonly<V>]
							: T extends readonly [...infer U, infer V]
								? readonly [...DeepReadonly<U>, DeepReadonly<V>]
								: T extends ReadonlyArray<infer ItemType>
									? ReadonlyArray<DeepReadonly<ItemType>>
									: T extends object
										? ReadonlyObjectDeep<T>
										: unknown

/**
 * Same as `ReadonlyDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `ReadonlyDeep`.
 */
type ReadonlyMapDeep<KeyType, ValueType> = {} & Readonly<ReadonlyMap<DeepReadonly<KeyType>, DeepReadonly<ValueType>>>

/**
 * Same as `ReadonlyDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `ReadonlyDeep`.
 */
type ReadonlySetDeep<ItemType> = {} & Readonly<ReadonlySet<DeepReadonly<ItemType>>>

/**
 * Same as `ReadonlyDeep`, but accepts only `object`s as inputs. Internal helper for `ReadonlyDeep`.
 */
type ReadonlyObjectDeep<ObjectType extends object> = {
	readonly [KeyType in keyof ObjectType]: DeepReadonly<ObjectType[KeyType]>
}


// https://stackoverflow.com/a/43001581/18241830
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };



export type NonFunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
