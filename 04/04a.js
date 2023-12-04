import { readFromFile } from '../utils.js'

/**
 * Start here.
 */
const main = () => {
  const lines = readFromFile('04-input.txt')
  // const lines = readFromFile('04-example.txt')

  let total = 0

  for (const line of lines) {
    const winningPart = line.match(/: (.*)\|/)[1]
    const winningNumbersIterator = winningPart.matchAll(/(.{2}) /g)
    const winningNumbers = [...winningNumbersIterator].map(match => match[1])

    const gamePart = line.match(/\|( .*)/)[1]
    const strikesRegex = new RegExp(`${winningNumbers.map(num => ' ' + num).join('|')}`, 'g')
    const strikes = gamePart.match(strikesRegex) || []

    if (strikes.length > 0) {
      let subTotal = 1

      for (let i = 0; i < strikes.length - 1; i++) {
        subTotal *= 2
      }

      total += subTotal
    }
  }

  console.log('total:', total)
}

// 🚀
main()
