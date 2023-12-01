import { readFromFile } from '../utils.js'

const lines = readFromFile('input.txt')
// const lines = readFromFile('example.txt')

let sum = 0

for (const line of lines) {
  const regex = /.*?(\d).*(\d).*|\d/
  const [match, first, last] = line.match(regex)

  const number = first ? Number(first + last) : Number(match + match)

  sum += number
}

console.log('sum:', sum)
