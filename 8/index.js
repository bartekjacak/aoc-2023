const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts
const IGNORED_CHARACTER = "_";
const LEFT_INSTRUCTION = "L";
const RIGHT_INSTRUCTION = "R";

function runPartOne(input) {
  const START_SYMBOL = "AAA";
  const END_SYMBOL = "ZZZ";

  const { map, instructions } = transformInput(input);

  let stepsCount = 0;
  let currentSymbol = START_SYMBOL;

  while (currentSymbol !== END_SYMBOL) {
    const instruction = getInstruction(instructions, stepsCount);
    const { left, right } = map[currentSymbol];

    if (instruction === LEFT_INSTRUCTION) {
      currentSymbol = left;
    } else if (instruction === RIGHT_INSTRUCTION) {
      currentSymbol = right;
    }

    stepsCount++;
  }

  return stepsCount;
}

function runPartTwo(input) {
  const START_SYMBOL_MASK = [IGNORED_CHARACTER, IGNORED_CHARACTER, "A"];
  const END_SYMBOL_MASK = [IGNORED_CHARACTER, IGNORED_CHARACTER, "Z"];

  const { map, instructions } = transformInput(input);

  const startSymbols = getSymbolsByMask(map, START_SYMBOL_MASK);
  const stepsTillEndSymbol = startSymbols.map((symbol) => {
    let currentSymbol = symbol;
    let stepsCount = 0;

    while (!doesSymbolMatchMask(currentSymbol, END_SYMBOL_MASK)) {
      const instruction = getInstruction(instructions, stepsCount);

      if (instruction === LEFT_INSTRUCTION) {
        currentSymbol = map[currentSymbol].left;
      } else if (instruction === RIGHT_INSTRUCTION) {
        currentSymbol = map[currentSymbol].right;
      }

      stepsCount++;
    }

    return stepsCount;
  });

  return stepsTillEndSymbol.reduce(getLeastCommonMultiplier);
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
function getInstruction(instructions, stepsCount) {
  return instructions[stepsCount % instructions.length];
}

function transformInput(input) {
  const map = {};

  input.slice(2).forEach((line) => {
    const [from, to] = line.split(" = ");
    const [left, right] = to.replace("(", "").replace(")", "").split(", ");

    map[from] = {
      left,
      right,
    };
  });

  return {
    instructions: input[0].split(""),
    map,
  };
}

function getSymbolsByMask(map, mask) {
  return Object.keys(map).filter((symbol) => doesSymbolMatchMask(symbol, mask));
}

function doesSymbolMatchMask(symbol, mask) {
  const symbolChars = symbol.split("");

  for (let i = 0; i < mask.length; i++) {
    if (symbolChars[i] !== mask[i] && mask[i] !== IGNORED_CHARACTER) {
      return false;
    }
  }

  return true;
}

function getLeastCommonMultiplier(a, b) {
  function gcd(a, b) {
    return a ? gcd(b % a, a) : b;
  }

  return (a * b) / gcd(a, b);
}
