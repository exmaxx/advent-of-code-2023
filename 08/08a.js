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

function applyInstructions(instructions, nodes) {
  let current = 'AAA'
  let steps = 0
  const instructionsIter = endlessInstructions(instructions)

  while (current !== 'ZZZ') {
    const instruction = instructionsIter.next().value
    current = nodes[current][instruction]
    steps++
  }

  return steps
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
  const steps = applyInstructions(instructions, nodes)

  console.log('steps:', steps)
}

// 🚀
main()
