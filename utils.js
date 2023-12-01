import { readFileSync, writeFileSync } from 'node:fs'

/**
 * @param {string} path
 * @returns {Array}
 */
export const readFromFile = (path) => {
  const lines = readFileSync(path).toString().split('\n')

  if (lines[lines.length - 1] === '') lines.pop()

  return lines
}

/**
 * Write text to file. Use '\n' to add lines.
 * @param {string} path
 * @param {string} text
 */
export const writeToFile = (path, text) => {
  writeFileSync(path, text)
}

