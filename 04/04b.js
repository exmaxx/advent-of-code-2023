import { readFromFile } from '../utils.js'

/**
 * Count how many number from the left part (winning numbers part) can we find on the
 * right side (the game part).
 *
 * @param line
 * @returns {number}
 */
function getStrikes(line) {
  const winningPart = line.match(/: (.*)\|/)[1]
  const winningNumbersIterator = winningPart.matchAll(/(.{2}) /g)
  const winningNumbers = [...winningNumbersIterator].map((match) => match[1])

  const gamePart = line.match(/\|( .*)/)[1]
  const strikesRegex = new RegExp(
    `${winningNumbers.map((num) => ' ' + num).join('|')}`,
    'g'
  )
  const strikes = gamePart.match(strikesRegex) || []

  return strikes.length
}

/**
 * Count how many cards (self + copies) does the card produce.
 *
 * @param cardId
 * @param cards
 * @returns {number}
 */
function countCards(cardId, cards) {
  const strikes = cards[cardId]

  let sum = 1

  for (let i = 1; i <= strikes; i++) {
    sum += countCards(cardId + i, cards)
  }

  return sum
}

/**
 * Start here.
 */
const main = () => {
  const lines = readFromFile('04-input.txt')
  // const lines = readFromFile('04-example.txt')

  let total = 0
  const cards = []

  for (const line of lines) {
    cards.push(getStrikes(line))
  }

  for (let i = 0; i < cards.length; i++) {
    const count = countCards(i, cards)
    total += count
  }

  console.log('total:', total)
}

// 🚀
main()
