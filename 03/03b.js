import { readFromFile } from '../utils.js'

/**
 * Iterates over all symbols. Meaning characters that are not a number (0-9),
 * nor dot (.)
 * @param {string[][]} lines - array of character arrays
 * @returns {Generator<{char: string, x: number, y: number}>}
 */
function* allStarSymbols(lines) {
  for (const [i, line] of lines.entries()) {
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char.match(/\*/)) {
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

/**
 * Simple number checker.
 * @param char
 * @returns {boolean}
 */
const isNumber = (char) => typeof char !== 'object' && !isNaN(char)

/**
 * Gather all part ids.
 *
 * Does not mutate the big lines array. Instead, we create a cutout of three lines around
 * the coordinates.
 * @param lines
 * @param y
 * @param x
 * @returns {string[]}
 */
function findPartsAroundCoords(lines, y, x) {
  const prevLineCopy = [...lines[y - 1]]
  const curLineCopy = [...lines[y]]
  const nextLineCopy = [...lines[y + 1]]

  // We copy lines around original coordinates so that we do not mutate the big lines array
  const linesToExamine = [prevLineCopy, curLineCopy, nextLineCopy]
  const partIds = []

  for (const coords of coordsAround(x, 1, linesToExamine)) {
    const { x: xAround, y: yAround } = coords

    const partId = removePartOnCoords(xAround, yAround, linesToExamine)

    if (partId) {
      partIds.push(partId)
    }
  }
  return partIds
}

/**
 * Start here.
 */
const main = () => {
  const lines = readFromFile('03-input.txt')
  // const lines = readFromFile('03-example.txt')

  let sum = 0

  for (const symbol of allStarSymbols(lines)) {
    const { x, y } = symbol
    const partIds = findPartsAroundCoords(lines, y, x)

    if (partIds.length === 2) {
      sum += Number(partIds[0] * partIds[1])
    }
  }

  console.log('sum:', sum)
}

// 🚀
main()
