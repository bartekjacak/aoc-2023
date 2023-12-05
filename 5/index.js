const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

function runPartOne(input) {
  const { seeds, ...mappings } = transformInput(input);

  const locations = seeds.map((seedValue) => {
    return getDestinationValueFromPipeline(seedValue, [
      mappings.seedToSoil,
      mappings.soilToFertilizer,
      mappings.fertilizerToWater,
      mappings.waterToLight,
      mappings.lightToTemperature,
      mappings.temperatureToHumidity,
      mappings.humidityToLocation,
    ]);
  });

  return Math.min(...locations);
}

function runPartTwo(input) {}

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
 * Get value through the pipeline of getDestinationValue functions running for each provided mapping
 * @param {number} value
 * @param {number[][]} mappingArray
 * @returns
 */
function getDestinationValueFromPipeline(value, mappingArray) {
  return mappingArray.reduce(
    (acc, mapping) => getDestinationValue(acc, mapping),
    value
  );
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

    if (sourceValue >= sourceStart && sourceValue <= sourceEnd) {
      const offset = sourceValue - sourceStart;
      return destinationStart + offset;
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
