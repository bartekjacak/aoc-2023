const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts

function runPartOne(input) {
  const transformedInput = transformInput(input);

  let points = 0;

  for (const [winningNumbers, playerNumbers] of transformedInput) {
    let winsCount = 0;

    for (const number of playerNumbers) {
      if (winningNumbers.includes(number)) {
        winsCount++;
      }
    }

    if (winsCount > 0) {
      points += 2 ** (winsCount - 1);
    }
  }

  return points;
}

function runPartTwo(input) {
  const transformedInput = transformInput(input);

  const cardWinsCount = transformedInput.map(
    ([winningNumbers, playerNumbers]) => {
      let winsCount = 0;

      playerNumbers.forEach((number) => {
        if (winningNumbers.includes(number)) {
          winsCount++;
        }
      });

      return winsCount;
    }
  );

  const cardCopiesCount = transformedInput.map(() => 1);

  for (const [index, winCount] of cardWinsCount.entries()) {
    for (let i = 0; i < winCount; i++) {
      cardCopiesCount[index + i + 1] += 1 * cardCopiesCount[index];
    }
  }

  return cardCopiesCount.reduce((acc, curr) => acc + curr, 0);
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
function transformInput(input) {
  return input.map((line) =>
    line
      .replace(/Card.+\d+: /g, "")
      .split(" | ")
      .map((group) =>
        group
          .split(" ")
          .filter((num) => num !== "")
          .map((num) => parseInt(num, 10))
      )
  );
}
