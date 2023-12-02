import { readFromFile } from '../utils.js'

const getMaxCubes = (line) => {
  let redMax = 0
  let blueMax = 0
  let greenMax = 0

  const matches = line.matchAll(
    /(?<green>\d+) green|(?<red>\d+) red|(?<blue>\d+) blue/g
  )

  for (const { groups } of matches) {
    const { red, green, blue } = groups

    if (Number(red) > redMax) redMax = red
    if (Number(blue) > blueMax) blueMax = blue
    if (Number(green) > greenMax) greenMax = green
  }

  return { red: redMax, green: greenMax, blue: blueMax }
}

const main = () => {
  const lines = readFromFile('02-input.txt')
  // const lines = readFromFile('02-example.txt')

  let sum = 0

  for (const line of lines) {
    const { red, green, blue } = getMaxCubes(line)

    sum += red * green * blue
  }

  console.log('sum:', sum)
}

main()
