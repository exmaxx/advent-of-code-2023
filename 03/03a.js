import { readFromFile } from '../utils.js'

/**
 * Iterates over all symbols. Meaning characters that are not a number (0-9),
 * nor dot (.)
 *
 * IMPORTANT: Even if the original array gets mutated, the iterator still iterates
 * through the original array.
 *
 * @param {string[][]} lines - array of character arrays
 * @returns {Generator<{char: string, x: number, y: number}>}
 */
function* allSymbols(lines) {
  for (const [i, line] of lines.entries()) {
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (!char.match(/[0-9.]/)) {
        yield { char, x: j, y: i }
      }
    }
  }
}

/**
 * Iterates over coordinates around x, y.
 * @param {number} x - char number on the line
 * @param {number} y - line number
 * @param {string[]} lines
 * @returns {Generator<*, void, *>}
 */
function* coordsAround(x, y, lines) {
  for (let i = y - 1; i <= y + 1 && i < lines.length; i++) {
    for (let j = x - 1; j <= x + 1 && j < lines[i].length; j++) {
      if (lines[i][j]) {
        yield { x: j, y: i }
      }
    }
  }
}

/**
 * The part is a number on the line. The already processed number is overwritten
 * with dot symbols (`.`).
 * @param x
 * @param y
 * @param mutableLines - the array will be mutated
 */
function removePartOnCoords(x, y, mutableLines) {
  let char = mutableLines[y][x]

  if (isNumber(char)) {
    mutableLines[y][x] = '.'
    const before = removePartOnCoords(x - 1, y, mutableLines) || ''
    const after = removePartOnCoords(x + 1, y, mutableLines) || ''

    return before + char + after
  }

  return null
}

const isNumber = (char) => typeof char !== 'object' && !isNaN(char)

const main = () => {
  const lines = readFromFile('03-input.txt')
    // const lines = readFromFile('03-example.txt')
    .map((line) => [...line]) // convert string to array

  let sum = 0

  for (const symbol of allSymbols(lines)) {
    const { x, y } = symbol

    for (const coords of coordsAround(x, y, lines)) {
      const { x: xAround, y: yAround } = coords

      const partId = removePartOnCoords(xAround, yAround, lines)

      if (partId) {
        sum += Number(partId)
      }
    }
  }

  console.log('sum:', sum)
}

main()
