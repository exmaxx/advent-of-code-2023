import { readFromFile, writeToFile } from '../utils.js'

// Cheatsheet:
// seed-to-soil ruleset:
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
 * Reads rule sets from an array of lines.
 *
 * Each rule set consists of rules that represented by a set of numbers. Each rule is on
 * a single line. A rule consist of three numbers - destination, source and length.
 *
 * @param {string[]} lines - An array of lines representing the rule sets.
 * @returns {number[][][]} - An array of rule sets, where each rule set is an array of arrays of numbers.
 */
function readRuleSets(lines) {
  let ruleSets = []
  let ruleSet = []

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    // group ends
    if (line === '') {
      ruleSets.push(ruleSet)
      ruleSet = []

      continue
    }

    const values = line.match(/\d+/g)?.map((match) => Number(match))

    if (values) {
      ruleSet.push(values)
    }
  }

  // last group
  ruleSets.push(ruleSet)

  return ruleSets
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
 * Sorts a rule set by the source ID.
 *
 * @param {number[][]} ruleSet - The rule set to be sorted.
 * @returns {number[][]} - The sorted rule set.
 */
function sortRuleSetBySourceId(ruleSet) {
  return ruleSet.toSorted((a, z) => a[1] - z[1])
}

/**
 * Determines which part of rule interval overlaps the values interval.
 *
 * @param {[number[]]} valuesInterval - The values interval (serves as a reference).
 * @param {[number[]]} ruleInterval - The rule interval.
 * @returns {string} - The intersection type ('whole', 'end', or 'none').
 */
function detectIntersection(valuesInterval, ruleInterval) {
  const [valuesStart, valuesEnd] = valuesInterval
  const [ruleStart, ruleEnd] = ruleInterval
  //
  // console.log(valuesInterval, ruleInterval)
  //
  // if (valuesStart <= ruleStart && ruleEnd <= valuesEnd) {
  //   return 'whole'
  // } else if (ruleStart <= valuesStart && ruleEnd < valuesEnd) {
  //   return 'end'
  // } else if (valuesStart < ruleStart && valuesEnd <= ruleEnd) {
  //   return 'start'
  // } else if (ruleStart <= valuesStart && valuesEnd <= ruleEnd) {
  //   return 'around'
  // } else {
  //   return 'none'
  // }

  // if valuesstart <= valuesend -> return first one

  // return start interval
  // return middle
  // return rest
}

/**
 * Creates intersecting intervals based on the given interval and intersecting rules.
 *
 * @param {number[]} interval - The original interval represented by [start, end].
 * @param {number[][]} intersectingRules - The array of intersecting rules represented by [destinationStart, sourceStart, length].
 * @returns {Object[][]} - An array of intersecting intervals.
 */
function createIntersectingIntervals(interval, intersectingRules) {
  const [start, end] = interval
  const anchors = []

  anchors.push({ num: start, type: 'orig' })
  anchors.push({ num: end, type: 'orig' })

  if (!intersectingRules.length) {
    return [anchors]
  }

  // gather all unique numbers
  for (const rule of intersectingRules) {
    const [destinationStart, sourceStart, length] = rule
    const sourceEnd = sourceStart + length - 1

    const diff = destinationStart - sourceStart

    anchors.push({ num: sourceStart, type: 'rule', diff })
    anchors.push({ num: sourceEnd, type: 'rule', diff })
  }

  // sort them
  const sorted = anchors.toSorted((a, z) => a.num - z.num)

  // remove first and last if needed
  if (sorted.at(0).num <= start) {
    const ruleAnchor = sorted.shift()
    const origAnchor = sorted.shift()

    sorted.unshift({ ...ruleAnchor, num: origAnchor.num })
  }

  if (end <= sorted.at(-1).num) {
    const ruleAnchor = sorted.pop()
    const origAnchor = sorted.pop()

    sorted.push({ ...ruleAnchor, num: origAnchor.num })
  }

  // turn them into intervals
  const intervals = []

  for (let i = 0; i < sorted.length - 1; i++) {
    intervals.push([sorted[i], sorted[i + 1]]) // this way, there are overlaps, we will see if that matters
  }

  return intervals
}

function applyDiffOnIntersectedInterval(intersectingInterval) {
  const [start, end] = intersectingInterval

  return start.type === 'rule'
    ? [start.num + start.diff, end.num + start.diff]
    : [start.num, end.num]
}

function applyRuleSet(interval, ruleSet) {
  const [start, end] = interval
  // const intersectingIntervals = []
  const intersectingRules = []

  console.log('interval:', interval)

  for (const rule of ruleSet) {
    console.log('rule:', rule)
    const [_, sourceStart, length] = rule
    const sourceEnd = sourceStart + length - 1

    if (sourceEnd < start) continue // rule numbers are before interval numbers
    if (end < sourceStart) continue // rule numbers are after interval numbers

    intersectingRules.push(rule)
    console.log(' -> yes', sourceStart, sourceEnd)
  }

  const intersectingIntervals = createIntersectingIntervals(
    interval,
    intersectingRules
  )

  const mappedIntervals = intersectingIntervals.map(
    applyDiffOnIntersectedInterval
  )

  return mappedIntervals
}

function applyRuleSets(seedInterval, ruleSetsSorted) {
  let intermediateResults = [seedInterval]

  for (const ruleSet of ruleSetsSorted) {
    const another = []

    for (const intermediateResult of intermediateResults) {
      const results = applyRuleSet(intermediateResult, ruleSet)
      another.push(...results)
    }

    intermediateResults = another
  }
  // applyRuleSet(seedInterval, ruleSet) // test only

  console.log('intermediateResults:', intermediateResults)
}

/**
 * Calculates the minimum seeds for given seed intervals and rule sets.
 *
 * @param {Array} seedIntervals - An array of seed intervals.
 * @param {Array} ruleSets - An array of rule sets.
 * @returns {Array} - An array containing the calculated minimum seeds.
 */
function calculateMinSeeds(seedIntervals, ruleSets) {
  const ruleSetsSorted = ruleSets.map((ruleSet) =>
    sortRuleSetBySourceId(ruleSet)
  )

  console.log('ruleSetsSorted:', ruleSetsSorted)

  const mins = []

  for (const seedInterval of seedIntervals) {
    const min = applyRuleSets(seedInterval, ruleSetsSorted)

    mins.push(min)
  }

  return mins
}

/**
 * Start here.
 */
function main() {
  // const lines = readFromFile('05-input.txt')
  const lines = readFromFile('05-example.txt')

  const seeds = readSeeds(lines)
  const ruleSets = readRuleSets(lines)
  const seedIntervals = createIntervals(seeds)

  console.log('seedIntervals:', seedIntervals)

  const mins = calculateMinSeeds(seedIntervals, ruleSets)
  const min = Math.min(...mins)

  console.log('min:', min)
}

// 🚀
main()
