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

  const times = lines[0].match(/\d+/g)
  const records = lines[1].match(/\d+/g)

  let sum = 1

  for (let i = 0; i < times.length; i++) {
    const possibilities = possibilitiesToWinRace(times[i], records[i])
    console.log('possibilities:', possibilities)
    sum *= possibilities
  }

  console.log('sum:', sum)
}

// 🚀
main()
