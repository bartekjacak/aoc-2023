const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts
const STARTING_SYMBOL = "S";
const GROUND_SYMBOL = ".";
const SYMBOL_TO_OFFSET_MAPPING = {
  "|": [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ],
  "-": [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ],
  L: [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
  ],
  J: [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ],
  7: [
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ],
  F: [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ],
  [GROUND_SYMBOL]: [{ x: 0, y: 0 }],
  [STARTING_SYMBOL]: [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ],
};

function runPartOne(input) {
  const board = transformInput(input);
  const startingCoords = findStartingCoords(board);
  const path = findPath(board, startingCoords);

  return Math.floor((path.length - 1) / 2);
}

function runPartTwo(input) {}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
function transformInput(input) {
  return input.map((row) => row.split(""));
}

function findStartingCoords(board) {
  for (const [index, row] of board.entries()) {
    const startingIndex = row.indexOf(STARTING_SYMBOL);

    if (startingIndex !== -1) {
      return {
        x: startingIndex,
        y: index,
      };
    }
  }
}

function findPath(board, startingCoords, savedPath = [], ignoredOffset = null) {
  let path = savedPath;
  const currentCoords = startingCoords;
  const currentSymbol = getSymbol(board, currentCoords);

  // Initialize path with starting symbol
  if (currentSymbol === STARTING_SYMBOL && path.length === 0) {
    path.push(STARTING_SYMBOL);
  }

  // Reaching starting symbol again means we found a complete path
  if (currentSymbol === STARTING_SYMBOL && path.length > 1) {
    return path;
  }

  for (const offset of SYMBOL_TO_OFFSET_MAPPING[currentSymbol]) {
    if (
      ignoredOffset &&
      offset.x === ignoredOffset.x &&
      offset.y === ignoredOffset.y
    ) {
      continue;
    }

    const nextCoords = {
      x: currentCoords.x + offset.x,
      y: currentCoords.y + offset.y,
    };
    const offsetToReturn = {
      x: -offset.x,
      y: -offset.y,
    };
    const nextSymbol = getSymbol(board, nextCoords);

    if (nextSymbol === GROUND_SYMBOL) continue;

    const hasConnection = SYMBOL_TO_OFFSET_MAPPING[nextSymbol].some(
      (nextOffset) =>
        nextOffset.x === offsetToReturn.x && nextOffset.y === offsetToReturn.y
    );

    if (hasConnection) {
      path.push(nextSymbol);
      return findPath(board, nextCoords, path, offsetToReturn);
    }
  }

  return path;
}

function getSymbol(board, coords) {
  return board[coords.y][coords.x];
}
