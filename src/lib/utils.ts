/**
 * forEach wrapper for async/await use.
 * @see https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
 * @author Sebastien Chopin
 */
export async function asyncForEach<T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => any
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/**
 * sleep for async/await use.
 * @param {number} ms Sleep time in milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}