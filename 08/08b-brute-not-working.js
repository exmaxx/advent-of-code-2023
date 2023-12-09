// Nice solution but running too long. Brute force is not the way.

import { readFromFile } from '../utils.js'

function readNodes(lines) {
  const nodes = {}

  for (const line of lines) {
    const [id, left, right] = line.match(/[A-Z0-9]{3}/g)

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

function getStartKeys(nodes) {
  return Object.keys(nodes).filter((key) => key[2] === 'A')
}

function areEndKeys(keys) {
  return keys.every((key) => key[2] === 'Z')
}

function applyInstructions(instructions, nodes) {
  let currentKeys = getStartKeys(nodes)
  let steps = 0

  const instructionsIter = endlessInstructions(instructions)

  while (!areEndKeys(currentKeys)) {
    const instruction = instructionsIter.next().value
    currentKeys = currentKeys.map(key => nodes[key][instruction])
    steps++
  }

  return steps
}

/**
 * Start here.
 */
function main() {
  const lines = readFromFile('08-input.txt')
  // const lines = readFromFile('08-example-b.txt')

  const instructions = lines.shift()
  lines.shift()

  const nodes = readNodes(lines)
  const steps = applyInstructions(instructions, nodes)

  console.log('steps:', steps)
}

// 🚀
main()
