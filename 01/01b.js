import { readFromFile } from '../utils.js'

const lines = readFromFile('01b-input.txt')
// const lines = readFromFile('01b-example.txt')
// const lines = readFromFile('01b-test.txt')

const numberStrings = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

const map = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

function toDigits(str) {
  let result = str

  for (const [text, digit] of Object.entries(map)) {
    result = result.replaceAll(text, digit)
  }

  return result
}

let sum = 0

for (const line of lines) {
  const numbers = numberStrings.join('|')
  const regex = new RegExp(`.*?(${numbers}).*(${numbers}).*|${numbers}`)
  const [match, first, last] = line.match(regex)

  const number = first
    ? Number(toDigits(first + last))
    : Number(toDigits(match + match))

  sum += number
}

console.log('sum:', sum)
