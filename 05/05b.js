import { readFromFile, writeToFile } from '../utils.js'

// Cheatsheet:
// seed-to-soil map:
// 50 98 2
// 52 50 48
// destination source length
// soil        seed

/**
 * Reads the seed values from the given lines.
 *
 * @param {string[]} lines - An array of lines containing seed values.
 * @returns {number[]} An array of seed values.
 */
function readSeeds(lines) {
  const line = lines[0]

  return line.match(/\d+/g).map((match) => Number(match))
}

/**
 * Reads map groups from an array of lines.
 *
 * Each map group consists of maps that represented by a set of numbers. Each map is on
 * a single line. A map consist of three numbers - destination, source and length.
 *
 * @param {string[]} lines - An array of lines representing the map groups.
 * @returns {number[][][]} - An array of map groups, where each map group is an array of arrays of numbers.
 */
function readMapGroups(lines) {
  let maps = []
  let mapGroup = []

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    // group ends
    if (line === '') {
      maps.push(mapGroup)
      mapGroup = []

      continue
    }

    const values = line.match(/\d+/g)?.map((match) => Number(match))

    if (values) {
      mapGroup.push(values)
    }
  }

  // last group
  maps.push(mapGroup)

  return maps
}

/**
 * Creates intervals from an array of seeds and lengths. The arrays contain
 * pairs of [from, to] values.
 *
 * @param {number[]} seeds - Array of seed values.
 * @returns {number[][]} - Array of intervals.
 */
function createIntervals(seeds) {
  const intervals = []

  for (let i = 0; i < seeds.length; i += 2) {
    const seed = seeds[i]
    const length = seeds[i + 1]

    intervals.push([seed, seed + length - 1])
  }

  return intervals
}

/**
 * Sorts a map group by the source ID.
 *
 * @param {number[][]} mapGroup - The map group to be sorted.
 * @returns {number[][]} - The sorted map group.
 */
function sortMapGroupBySourceId(mapGroup) {
  return mapGroup.toSorted((a, z) => a[1] - z[1])
}

/**
 * Start here.
 */
function main() {
  // const lines = readFromFile('05-input.txt')
  const lines = readFromFile('05-example.txt')

  const seeds = readSeeds(lines)
  const mapGroups = readMapGroups(lines)

  const mapGroupsSorted = mapGroups.map((mapGroup) =>
    sortMapGroupBySourceId(mapGroup)
  )

  console.log('mapGroupsSorted:', mapGroupsSorted)

  const seedIntervals = createIntervals(seeds)

  console.log('seedIntervals:', seedIntervals)
}

// 🚀
main()
