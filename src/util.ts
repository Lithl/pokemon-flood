export function assertUnreachable(_: never): never {
  throw new Error('This function should not be called');
}

export function lerpPct(a: number, b: number, p: number) {
  if (p < 0 || p > 1) {
    throw new TypeError('p must be in the range [0,1]');
  }
  return a + p * (b - a);
}

export function lerpVal(a: number, b: number, p: number) {
  if (p < Math.min(a, b) || p > Math.max(a, b)) {
    throw new TypeError('p must be between a and b');
  }
  p = (p - a) / (b - a);
  return a + p * (b - a);
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export type Optional<T> = T | undefined;

export type Nullable<T> = T | null;

export type Constructor<T> = new (...args: any[]) => T;
