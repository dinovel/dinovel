/**
 * Inserts an element into an array at a specified index.
 *
 * @param array source array
 * @param index insert postion
 * @param value value to insert
 * @returns new array
 */
export function insertAt<T>(array: T[], index: number, value: T): T[] {
  return [...array.slice(0, index), value, ...array.slice(index)];
}

/**
 * Remove duplicate values from array
 *
 * @param array source array
 * @returns new array
 */
export function uniqueValues<T>(array: T[]): T[] {
  return [...new Set(array)];
}
