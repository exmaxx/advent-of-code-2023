import { readFromFile } from '../utils.js'

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

function readMaps(lines) {
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

function calculateLocations(seeds, maps) {
  const locations = []

  for (const seed of seeds) {
    locations.push(calculateLocation(seed, maps))
  }

  return locations
}

function calculateLocation(seed, maps) {
  let mappedValue = seed

  for (const mapGroup of maps) {
    const map = findMap(mappedValue, mapGroup)

    if (map) {
      mappedValue = mapValue(mappedValue, map)
    }
  }

  return mappedValue
}

function findMap (value, mapGroup) {
  for (const map of mapGroup) {
    const [_, source, length] = map

    if (source <= value && value <= source + length) {
      return map
    }
  }
}

function mapValue(value, map) {
  const [destination, source] = map
  const diff = value - source
  return destination + diff
}

/**
 * Start here.
 */
function main() {
  const lines = readFromFile('05-input.txt')
  // const lines = readFromFile('05-example.txt')

  const seeds = readSeeds(lines)
  const maps = readMaps(lines)
  const locations = calculateLocations(seeds, maps)
  const minLocation = Math.min(...locations)

  console.log('minLocation:', minLocation)
}

// 🚀
main()
