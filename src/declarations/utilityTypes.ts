// Utility type to strip generic properties added to Mongoose document,
// leaving a type of only data properties specified in the model's schema

type DiffPropNames<T, K> = {[P in keyof T]: P extends keyof K ? never: P} [keyof T];

export type TDiffTypeProps<T, K> = Pick<T, DiffPropNames<T, K>>





