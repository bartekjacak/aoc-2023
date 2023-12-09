const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

function runPartOne(input) {
  const history = transformInput(input);
  const sequences = getSequences(history);
  const predictions = sequences.map((seq) =>
    seq
      .toReversed()
      .map(getLastItem)
      .reduce((acc, lastItem) => acc + lastItem, 0)
  );

  return predictions.reduce((a, b) => a + b, 0);
}

function runPartTwo(input) {
  const history = transformInput(input);
  const sequences = getSequences(history);
  const backwardPredictions = sequences.map((seq) =>
    seq
      .toReversed()
      .map(getFirstItem)
      .reduce((acc, firstItem) => firstItem - acc, 0)
  );

  return backwardPredictions.reduce((a, b) => a + b, 0);
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
function transformInput(input) {
  return input.map((line) =>
    line.split(" ").map((number) => parseInt(number, 10))
  );
}

function getSequences(history) {
  return history.map((entry) => {
    const accumulatedSequences = [entry];

    while (!hasOnlyZeros(getLastItem(accumulatedSequences))) {
      accumulatedSequences.push(
        getLastItem(accumulatedSequences).reduce((acc, _, index, array) => {
          if (index === 0) return acc;
          return [...acc, array[index] - array[index - 1]];
        }, [])
      );
    }

    return accumulatedSequences;
  });
}

function hasOnlyZeros(array) {
  return array.every((number) => number === 0);
}

function getFirstItem(array) {
  return array[0];
}

function getLastItem(array) {
  return array[array.length - 1];
}
