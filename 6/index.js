const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts
const ACCELERATION_PER_MS_HOLD_TIME = 1;

function runPartOne(input) {
  const races = transformPartOneInput(input);

  const possibleWins = races.map((race) => {
    let wins = 0;
    for (let holdTime = 0; holdTime <= race.time; holdTime++) {
      if (canBeatTheRecord(holdTime, race)) {
        wins++;
      }
    }
    return wins;
  });

  return possibleWins.reduce((acc, wins) => acc * wins, 1);
}

function runPartTwo(input) {
  const race = transformPartTwoInput(input);

  let wins = 0;
  for (let holdTime = 0; holdTime <= race.time; holdTime++) {
    if (canBeatTheRecord(holdTime, race)) {
      wins++;
    }
  }

  return wins;
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
/**
 * Check if the record can be beaten for a given hold time
 * @param {number} holdTime
 * @param {{
 *  time: number;
 *  distance: number;
 * }[]} race
 * @returns
 */
function canBeatTheRecord(holdTime, race) {
  const { time, distance } = race;

  return (
    holdTime * ACCELERATION_PER_MS_HOLD_TIME * (time - holdTime) > distance
  );
}

/**
 *
 * @param {string[]} input
 * @returns {{
 *  time: number;
 *  distance: number;
 * }[]}
 */
function transformPartOneInput(input) {
  const [times, distances] = input.map((line) =>
    line
      .replace(/Time:\s+/g, "")
      .replace(/Distance:\s+/, "")
      .split(/\s+/g)
      .map((number) => parseInt(number, 10))
  );

  return times.map((time, index) => {
    const distance = distances[index];
    return { time, distance };
  });
}

/**
 *
 * @param {string[]} input
 * @returns {{
 *  time: number;
 *  distance: number;
 * }}
 */
function transformPartTwoInput(input) {
  const [time, distance] = input.map((line) =>
    parseInt(
      line
        .replace(/Time:\s+/g, "")
        .replace(/Distance:\s+/g, "")
        .replace(/\s+/g, ""),
      10
    )
  );

  return {
    time,
    distance,
  };
}
