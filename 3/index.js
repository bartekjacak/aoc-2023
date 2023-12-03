const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n").map((i) => i.split(""));

// Consts
const IS_NUMBER_REGEX = /\d/;
const IS_SYMBOL_REGEX = /[^\.^\d]/;
const GEAR_SYMBOL = "*";
const GEAR_ADJACENT_NUMBERS_COUNT = 2;

function runPartOne(input) {
  return getBoardNumbers(input)
    .filter((number) => number.isAdjacentToSymbol)
    .reduce((a, b) => a + b.value, 0);
}

function runPartTwo(input) {
  const numbers = getBoardNumbers(input);
  const gearRatios = [];

  for (const [index, row] of input.entries()) {
    let position = 0;

    while (position < row.length) {
      const char = row[position];

      if (char !== GEAR_SYMBOL) {
        position++;
        continue;
      }

      const adjacentNumbers = getAdjacentNumbers(
        input,
        numbers,
        position,
        index
      );
      if (adjacentNumbers.length === GEAR_ADJACENT_NUMBERS_COUNT) {
        gearRatios.push(adjacentNumbers.reduce((a, b) => a * b, 1));
      }

      position++;
    }
  }

  return gearRatios.reduce((a, b) => a + b, 0);
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
/**
 * Locate numbers on the board
 * @param {string[][]} input
 * @returns {{
 *   row: number;
 *   start: number;
 *   end: number;
 *   value: number;
 *   isAdjacentToSymbol: boolean;
 * }[]}
 */
function getBoardNumbers(input) {
  const numbers = [];

  for (const [index, row] of input.entries()) {
    let position = 0;

    while (position < row.length) {
      const char = row[position];

      if (!char.match(IS_NUMBER_REGEX)) {
        position++;
        continue;
      }

      const number = {
        row: index,
        start: position,
        end: position,
        value: null,
        isAdjacentToSymbol: isAdjacentToSymbol(input, position, index),
      };

      while (
        row[number.end + 1] &&
        row[number.end + 1].match(IS_NUMBER_REGEX)
      ) {
        number.end += 1;
        if (isAdjacentToSymbol(input, number.end, index)) {
          number.isAdjacentToSymbol = true;
        }
      }

      number.value = parseInt(
        row.slice(number.start, number.end + 1).join(""),
        10
      );

      numbers.push(number);
      position = number.end + 1;
    }
  }

  return numbers;
}

/**
 * Get numbers adjacent to a board position
 * @param {string[][]} input
 * @param {{
 *   row: number;
 *   start: number;
 *   end: number;
 *   value: number;
 *   isAdjacentToSymbol: boolean;
 * }[]} numbers
 * @param {number} x
 * @param {number} y
 * @returns {number[]}
 */
function getAdjacentNumbers(input, numbers, x, y) {
  const adjacentCoordinates = getAdjacentCoordinates(input, x, y);
  const adjacentNumbers = new Set();

  for (const { x, y } of adjacentCoordinates) {
    const number = numbers.find(
      (number) => number.start <= x && x <= number.end && number.row === y
    );

    if (number) {
      adjacentNumbers.add(number);
    }
  }

  return [...adjacentNumbers].map((number) => number.value);
}

/**
 * Check if the number is adjacent to a symbol
 * @param {string[][]} input
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function isAdjacentToSymbol(input, x, y) {
  return getAdjacentValues(input, x, y).some((value) =>
    value.match(IS_SYMBOL_REGEX)
  );
}

/**
 * Get adjacent coordinates
 * @param {string[][]} input
 * @param {number} x
 * @param {number} y
 * @returns {{ x: number; y: number }[]}
 */
function getAdjacentCoordinates(input, x, y) {
  const coords = [];

  if (x > 0) {
    coords.push({ x: x - 1, y });

    if (y > 0) {
      coords.push({ x: x - 1, y: y - 1 });
    }
  }

  if (x < input[y].length - 1) {
    coords.push({ x: x + 1, y });

    if (y < input.length - 1) {
      coords.push({ x: x + 1, y: y + 1 });
    }
  }

  if (y > 0) {
    coords.push({ x, y: y - 1 });

    if (x < input[y].length - 1) {
      coords.push({ x: x + 1, y: y - 1 });
    }
  }

  if (y < input.length - 1) {
    coords.push({ x, y: y + 1 });

    if (x > 0) {
      coords.push({ x: x - 1, y: y + 1 });
    }
  }

  return coords;
}

/**
 * Get adjacent values
 * @param {string[][]} input
 * @param {number} x
 * @param {number} y
 * @returns {string[]}
 */
function getAdjacentValues(input, x, y) {
  return getAdjacentCoordinates(input, x, y).map(
    (coord) => input[coord.y][coord.x]
  );
}
