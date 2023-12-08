import { readFromFile } from '../utils.js'

function possibilitiesToWinRace(time, record) {
  let onWinningStreak = false
  let winnings = 0

  for (let charging = 0; charging <= time; charging++) {
    const distance = (time - charging) * charging
    const raceWon = distance > record

    if (raceWon) {
      winnings++
      onWinningStreak = true
    } else if (onWinningStreak) {
      break
    }
  }

  return winnings
}

/**
 * Start here.
 */
function main() {
  const lines = readFromFile('06-input.txt')
  // const lines = readFromFile('06-example.txt')

  const time = Number(lines[0].match(/\d+/g).join(''))
  const record = Number(lines[1].match(/\d+/g).join(''))

  const possibilities = possibilitiesToWinRace(time, record)

  console.log('possibilities:', possibilities)
}

// 🚀
main()
