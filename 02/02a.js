import { readFromFile } from '../utils.js'

const RED_MAX = 12
const GREEN_MAX = 13
const BLUE_MAX = 14

const checkGamePossibility = (line) => {
  const matches = line.matchAll(
    /(?<green>\d+) green|(?<red>\d+) red|(?<blue>\d+) blue/g
  )

  for (const { groups } of matches) {
    const { red, green, blue } = groups

    if (
      Number(red) > RED_MAX ||
      Number(green) > GREEN_MAX ||
      Number(blue) > BLUE_MAX
    ) {
      return false
    }
  }

  return true
}

const getGameId = (line) => Number(line.match(/Game (\d+)/)[1])

const main = () => {
  const lines = readFromFile('02-input.txt')
  // const lines = readFromFile('02-example.txt')

  let sum = 0

  for (const line of lines) {
    const isPossible = checkGamePossibility(line)

    if (isPossible) {
      sum += getGameId(line)
    }
  }

  console.log('sum:', sum)
}

main()
