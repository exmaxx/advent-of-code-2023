import { readFromFile, writeToFile } from '../utils.js'

// Cheatsheet:
// seed-to-soil map:
// 50 98 2
// 52 50 48
// destination source length
// soil        seed

function readSeeds(lines) {
  const line = lines[0]

  return line.match(/\d+/g).map((match) => Number(match))
}

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

function createIntervals(seeds) {
  const intervals = []

  for (let i = 0; i < seeds.length; i += 2) {
    const seed = seeds[i]
    const length = seeds[i + 1]

    intervals.push([seed, seed + length - 1])
  }

  return intervals
}

function calculateMinLocationForIntervals(seedIntervals, mapGroups) {
  const minLocations = []

  for (const seedInterval of seedIntervals) {
    minLocations.push(calculateMinLocationForInterval(seedInterval, mapGroups))
  }

  return minLocations
}

function splitIntervalByMapGroup (seedInterval, mapGroup) {
  let splitIntervals = []
  const [from, to] = seedInterval
  let current = from

  while (current < to) {
    const map = findMap(current, mapGroup)

    if (map) {
      const [_, source, length] = map
      const mapMax = source + length - 1

      splitIntervals.push([current, mapMax < to ? mapMax : to])
      current = mapMax + 1
    } else {
      const closestMap = findClosestLargerMap(current, mapGroup)

      if (closestMap) {
        const closestLarger = closestMap[1]
        splitIntervals.push([current, closestLarger - 1])
        current = closestLarger
      } else {
        current = to
      }
    }
  }

  return splitIntervals
}

function mapNextIntervals(intervals, mapGroup) {
  const nextIntervals = []

  for (const interval of intervals) {
    const map = findMap(interval[0], mapGroup)
    const nextInterval = mapInterval(interval, map)
    nextIntervals.push(nextInterval)
  }

  return nextIntervals
}

function calculateMinLocationForInterval(seedInterval, mapGroups) {
  console.log('seedInterval:', seedInterval)
  // let mappedValue = seed

  let nextIntervals = [seedInterval]

  for (const mapGroup of mapGroups) {
    const newIntervals = []
    for (const nextInterval of nextIntervals) {
      const splitIntervals = splitIntervalByMapGroup(nextInterval, mapGroup)
      newIntervals.push(...mapNextIntervals(splitIntervals, mapGroup))
    }
    nextIntervals.push(...newIntervals)
  }

  console.log('nextIntervals:', nextIntervals)

  return Math.min(...nextIntervals.flatMap(interval => interval[0]))

  // for (const nextInterval of nextIntervals) {
  //   calculateMinLocationForInterval(nextInterval)
  // }
}

function findMap(value, mapGroup) {
  for (const map of mapGroup) {
    const [_, source, length] = map

    if (source <= value && value <= source + length - 1) {
      return map
    }
  }
}

function findClosestLargerMap(value, mapGroup) {
  let closestMap = null

  for (const map of mapGroup) {
    const source = map[1]
    const closestSource = closestMap?.[1]

    if (value <= source && source < closestSource) {
      closestMap = map
    }
  }

  return closestMap
}

function mapValue(value, map) {
  const [destination, source] = map
  const diff = value - source
  return destination + diff
}

function mapInterval(interval, map) {
  const [destination, source] = map
  const [from, to] = interval

  const diffFrom = from - source
  const diffTo = to - source

  return [destination + diffFrom, destination + diffTo ]
}

/**
 * Start here.
 */
function main() {
  // const lines = readFromFile('05-input.txt')
  const lines = readFromFile('05-example.txt')

  const seeds = readSeeds(lines)
  const mapGroups = readMapGroups(lines)

  const seedIntervals = createIntervals(seeds)
  // const locations = calculateMinLocationForIntervals(seedIntervals, mapGroups)
  const locations = calculateMinLocationForIntervals([seedIntervals[0]], mapGroups)
  const minLocation = Math.min(...locations)

  console.log('minLocation:', minLocation)
}

// 🚀
main()
