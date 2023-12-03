const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts
const IS_NUMBER_REGEX = /\d/g;
const SPOKEN_TO_DIGIT_MAPPING = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function runPartOne(input) {
  const sanitizedInput = input.map((line) => line.match(IS_NUMBER_REGEX));

  let result = 0;
  for (const entry of sanitizedInput) {
    if (entry.length === 0) {
      return;
    } else if (entry.length === 1) {
      result += parseInt(`${entry[0]}${entry[0]}`, 10);
    } else if (entry.length > 1) {
      result += parseInt(`${entry[0]}${entry[entry.length - 1]}`, 10);
    }
  }

  return result;
}

function runPartTwo(input) {
  return runPartOne(
    input.map((line) =>
      line
        .split("")
        .map((_, index) => getDigitAtPosition(index, line))
        .filter(Boolean)
        .join("")
    )
  );
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
function getDigitAtPosition(position, input) {
  const charAtPosition = input[position];
  if (charAtPosition && charAtPosition.match(IS_NUMBER_REGEX)) {
    return charAtPosition;
  }

  let digit = null;
  for (const [spoken, numeric] of Object.entries(SPOKEN_TO_DIGIT_MAPPING)) {
    if (input.slice(position).startsWith(spoken)) {
      digit = numeric;
    }
  }

  return digit;
}
