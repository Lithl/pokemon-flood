export function assertUnreachable(_: never): never {
  throw new Error('This function should not be called');
}

export type Optional<T> = T | undefined;

export type Nullable<T> = T | null;
