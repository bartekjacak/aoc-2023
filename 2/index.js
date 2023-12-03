const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts
const COLOR_TO_MAX_VALUE_MAPPING = {
  red: 12,
  green: 13,
  blue: 14,
};

function runPartOne(input) {
  const transformedInput = transformInput(input);

  let gameIdSum = 0;
  for (const [index, game] of transformedInput.entries()) {
    if (isGamePossible(game)) {
      gameIdSum += index + 1;
    }
  }

  return gameIdSum;
}

function runPartTwo(input) {
  return transformInput(input)
    .map(calculateGamePower)
    .reduce((a, b) => a + b, 0);
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
function transformInput(input) {
  return input.map((line) =>
    line
      .replace(/Game \d+: /g, "")
      .split("; ")
      .map((i) => i.split(", ").map((i) => i.split(" ")))
  );
}

function isGamePossible(game) {
  for (const set of game) {
    for (const [stringAmount, color] of set) {
      if (parseInt(stringAmount, 10) > COLOR_TO_MAX_VALUE_MAPPING[color]) {
        return false;
      }
    }
  }

  return true;
}

function calculateGamePower(game) {
  const minCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const set of game) {
    for (const [stringAmount, color] of set) {
      minCubes[color] = Math.max(minCubes[color], parseInt(stringAmount, 10));
    }
  }

  return minCubes.red * minCubes.green * minCubes.blue;
}
