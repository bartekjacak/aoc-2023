const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

function runPartOne(input) {
  const { seeds, ...mappings } = transformInput(input);

  const locations = seeds.map((seedValue) => {
    return getValueFromPipeline(
      seedValue,
      [
        mappings.seedToSoil,
        mappings.soilToFertilizer,
        mappings.fertilizerToWater,
        mappings.waterToLight,
        mappings.lightToTemperature,
        mappings.temperatureToHumidity,
        mappings.humidityToLocation,
      ],
      getDestinationValue
    );
  });

  return Math.min(...locations);
}

function runPartTwo(input) {
  const { seeds, ...mappings } = transformInput(input);

  // Spit seeds into ranges
  // [1, 2, 3, 4, 5, 6] => [[1, 2], [3, 4], [5, 6]
  const seedRanges = [];
  for (let i = 0; i < seeds.length; i++) {
    if (i % 2 !== 0) {
      seedRanges.push([seeds[i - 1], seeds[i - 1] + seeds[i] - 1]);
    }
  }

  let currentLocation = 0;
  let continueLoop = true;
  while (continueLoop) {
    const lowestLocationEntry = mappings.humidityToLocation.find(
      ([val, _, range]) => isInRange(currentLocation, val, val + range - 1)
    ) || [currentLocation, currentLocation];

    const [destinationStartLoc, sourceStartHum] = lowestLocationEntry;
    const startValue = sourceStartHum + currentLocation - destinationStartLoc;
    const potentialSeed = getValueFromPipeline(
      startValue,
      [
        mappings.temperatureToHumidity,
        mappings.lightToTemperature,
        mappings.waterToLight,
        mappings.fertilizerToWater,
        mappings.soilToFertilizer,
        mappings.seedToSoil,
      ],
      getSourceValue
    );

    for (const [seedStart, seedEnd] of seedRanges) {
      if (isInRange(potentialSeed, seedStart, seedEnd)) {
        continueLoop = false;
        break;
      }
    }

    if (continueLoop) {
      currentLocation++;
    }
  }

  return currentLocation;
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
/**
 * Transform input into readable format
 * @param {string[]} input
 * @returns {{
 *   seeds: number[][];
 *   seedToSoil: number[][];
 *   soilToFertilizer: number[][];
 *   fertilizerToWater: number[][];
 *   waterToLight: number[][];
 *   lightToTemperature: number[][];
 *   temperatureToHumidity: number[][];
 *   humidityToLocation: number[][];
 * }}
 */
function transformInput(input) {
  return {
    seeds: getNumberArray(input[0].replace("seeds: ", "")),
    seedToSoil: extractMapping(input, "seed-to-soil"),
    soilToFertilizer: extractMapping(input, "soil-to-fertilizer"),
    fertilizerToWater: extractMapping(input, "fertilizer-to-water"),
    waterToLight: extractMapping(input, "water-to-light"),
    lightToTemperature: extractMapping(input, "light-to-temperature"),
    temperatureToHumidity: extractMapping(input, "temperature-to-humidity"),
    humidityToLocation: extractMapping(input, "humidity-to-location"),
  };
}

/**
 * Get value through the pipeline of getSourceValue functions running for each provided mapping
 * @param {number} value
 * @param {number[][]} mappingArray
 * @param {(acc: number, mapping: number[]) => number} func
 * @returns
 */
function getValueFromPipeline(value, mappingArray, func) {
  return mappingArray.reduce((acc, mapping) => func(acc, mapping), value);
}

/**
 * Get source value given the destination value and the mapping
 * @param {number} destinationValue
 * @param {number[][]} mapping
 * @returns
 */
function getSourceValue(destinationValue, mapping) {
  for (const [dest, source, range] of mapping) {
    const rangeStart = dest;
    const rangeEnd = dest + range - 1;

    if (isInRange(destinationValue, rangeStart, rangeEnd)) {
      return source + destinationValue - rangeStart;
    }
  }

  return destinationValue;
}

/**
 * Get destination value given the source value and the mapping
 * @param {number} sourceValue
 * @param {number[][]} mapping
 * @returns {number | null}
 */
function getDestinationValue(sourceValue, mapping) {
  for (const entry of mapping) {
    const [destinationStart, sourceStart, rangeLength] = entry;
    const sourceEnd = sourceStart + rangeLength - 1;

    if (isInRange(sourceValue, sourceStart, sourceEnd)) {
      return destinationStart + sourceValue - sourceStart;
    }
  }

  return sourceValue;
}

/**
 * Extract mapping from the raw input
 * @param {string[]} input
 * @param {string} mappingName
 * @returns {number[][]}
 */
function extractMapping(input, mappingName) {
  const HEADING = `${mappingName} map:`;

  const mapping = [];
  const initialPosition = input.indexOf(HEADING) + 1;

  for (let i = initialPosition; i < input.length; i++) {
    if (input[i] === "") break;
    mapping.push(getNumberArray(input[i]));
  }

  return mapping;
}

/**
 * Helper to convert raw line from the input into numeric array
 * @param {string} stringLine
 * @returns {number[]}
 * @example "79 21 34 88" converts to [79, 21, 34, 88]
 */
function getNumberArray(stringLine) {
  return stringLine.split(" ").map((number) => parseInt(number, 10));
}

function isInRange(value, rangeStart, rangeEnd) {
  return value >= rangeStart && value <= rangeEnd;
}
