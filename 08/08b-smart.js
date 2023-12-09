import { readFromFile } from '../utils.js'

function readNodes(lines) {
  const nodes = {}

  for (const line of lines) {
    const [id, left, right] = line.match(/[A-Z]{3}/g)

    nodes[id] = {
      L: left,
      R: right,
    }
  }

  return nodes
}

function* endlessInstructions(instructions) {
  while (true) {
    for (const instruction of instructions) {
      yield instruction
    }
  }
}

function applyInstructions(startKey, instructions, nodes) {
  let current = startKey
  let steps = 0
  const instructionsIter = endlessInstructions(instructions)

  while (current[2] !== 'Z') {
    const instruction = instructionsIter.next().value
    current = nodes[current][instruction]
    steps++
  }

  return steps
}

function getStartKeys(nodes) {
  return Object.keys(nodes).filter((key) => key[2] === 'A')
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} - The greatest common divisor of a and b.
 */
function gcd(a, b) {
  return !b ? a : gcd(b, a % b);
}

/**
 * Calculates the least common multiple (LCM) of two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} - The least common multiple of a and b.
 */
function lcm(a, b) {
  return a * b / gcd(a, b)
}

/**
 * Calculates the least common multiple (LCM) of an array of numbers.
 *
 * @param {number[]} numbers - An array of numbers.
 * @returns {number} - The least common multiple of the input numbers.
 */
function multiLcm(numbers) {
  let multiple = 1

  for (const number of numbers) {
    multiple = lcm(multiple, number)
  }

  return multiple
}

/**
 * Start here.
 */
function main() {
  const lines = readFromFile('08-input.txt')
  // const lines = readFromFile('08-example.txt')

  const instructions = lines.shift()
  lines.shift()

  const nodes = readNodes(lines)
  const startKeys = getStartKeys(nodes)
  const steps = startKeys.map(key => applyInstructions(key, instructions, nodes))

  console.log('result:', multiLcm(steps))
}

// 🚀
main()
