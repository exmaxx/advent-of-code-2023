import { readFromFile } from '../utils.js'

const Strength = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
}

function compareCards(cardsA, cardsZ) {
  for (let i = 0; i < cardsA.length; i++) {
    if (Strength[cardsA[i]] < Strength[cardsZ[i]]) return -1
    if (Strength[cardsA[i]] > Strength[cardsZ[i]]) return 1
  }

  return 0
}

/**
 * Compare hands.
 *
 * @param handA
 * @param handZ
 * @returns {number} Returns -1 when handA < handZ (already proper order), 1 when handA > handZ (values need to switch),
 *   and 0 when equal.
 */
function compareHands(handA, handZ) {
  const [cardsA, _, typeA] = handA
  const [cardsZ, __, typeZ] = handZ

  if (typeA !== typeZ) {
    return typeA - typeZ
  }

  return compareCards(cardsA, cardsZ)
}

const Types = {
  FIVE: 7,
  FOUR: 6,
  FULL: 5,
  THREE: 4,
  TWOPAIRS: 3,
  PAIR: 2,
  HIGH: 1,
}

function withType(hand) {
  const [cards] = hand
  const repetitions = {}

  for (const card of cards) {
    repetitions[card] = repetitions[card] ? repetitions[card] + 1 : 1
  }

  const counts = Object.values(repetitions)

  if (counts.some((count) => count === 5)) {
    return [...hand, Types.FIVE]
  }

  if (counts.some((count) => count === 4)) {
    return [...hand, Types.FOUR]
  }

  if (
    counts.some((count) => count === 3) &&
    counts.some((count) => count === 2)
  ) {
    return [...hand, Types.FULL]
  }

  if (counts.some((count) => count === 3)) {
    return [...hand, Types.THREE]
  }

  if (counts.filter((count) => count === 2).length === 2) {
    return [...hand, Types.TWOPAIRS]
  }

  if (counts.some((count) => count === 2)) {
    return [...hand, Types.PAIR]
  }

  return [...hand, Types.HIGH]
}

/**
 * Start here.
 */
function main() {
  const lines = readFromFile('07-input.txt')
  // const lines = readFromFile('07-example.txt')

  const hands = lines.map((line) => line.split(' '))
  const typedHands = hands.map((hand) => withType(hand))
  const sortedHands = typedHands.sort((a, z) => compareHands(a, z))
  const score = sortedHands.reduce(
    (total, hand, i) => total + Number(hand[1]) * (i + 1),
    0
  )

  console.log('score:', score)
}

// 🚀
main()
