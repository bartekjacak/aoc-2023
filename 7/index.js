const inputText = await Bun.file("./input.txt").text();
const inputArray = inputText.split("\n");

// Consts
const CARD_VALUES = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};
const CARD_VALUES_WITH_JOKERS = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};
const JOKER = "J";

const HAND_TYPE = {
  FIVE_OF_A_KIND: 1,
  FOUR_OF_A_KIND: 2,
  FULL_HOUSE: 3,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 5,
  ONE_PAIR: 6,
  HIGH_CARD: 7,
};

function runPartOne(input) {
  const transformedInput = transformInput(input);

  const entries = transformedInput
    .map((entry) => ({
      ...entry,
      hand: entry.hand.map((card) => CARD_VALUES[card]),
      type: getHandType(entry.hand),
    }))
    .sort(sortByHandType)
    .sort(sortByHandValue)
    .map((entry, index) => ({
      ...entry,
      winning: (transformedInput.length - index) * entry.bid,
    }));

  return entries.reduce((acc, entry) => acc + entry.winning, 0);
}

function runPartTwo(input) {
  const transformedInput = transformInput(input);

  const entries = transformedInput
    .map((entry) => ({
      ...entry,
      hand: entry.hand.map((card) => CARD_VALUES_WITH_JOKERS[card]),
      type: getHandTypeIncludingJokers(entry.hand),
    }))
    .sort(sortByHandType)
    .sort(sortByHandValue)
    .map((entry, index) => ({
      ...entry,
      winning: (transformedInput.length - index) * entry.bid,
    }));

  return entries.reduce((acc, entry) => acc + entry.winning, 0);
}

// Results
console.log("Part 1: ", runPartOne(inputArray));
console.log("Part 2: ", runPartTwo(inputArray));

// Utils
/**
 * @example [[K, K, K, K, A], [A, A, A, A, A]] => [[A, A, A, A, A], [K, K, K, K, A]]
 */
function sortByHandValue(a, b) {
  if (a.type !== b.type) {
    return 0;
  }

  for (let i = 0; i < a.hand.length; i++) {
    if (a.hand[i] === b.hand[i]) {
      continue;
    }

    if (a.hand[i] > b.hand[i]) {
      return -1;
    }

    if (a.hand[i] < b.hand[i]) {
      return 1;
    }
  }

  return 0;
}

/**
 * @example [[A, A, A, A, K], [K, K, K, K, K]] => [[K, K, K, K, K], [A, A, A, A, K]]
 */
function sortByHandType(a, b) {
  if (a.type < b.type) {
    return -1;
  }

  if (a.type > b.type) {
    return 1;
  }

  return 0;
}

/**
 * @param {string[]} input
 * @returns {{
 *   hand: string[];
 *   bid: number;
 * }[]}
 */
function transformInput(input) {
  return input
    .map((line) => line.split(" "))
    .map(([hand, bid]) => ({
      hand: hand.split(""),
      bid: parseInt(bid, 10),
    }));
}

/**
 * Assign hand combination to a type
 * @param {string[]} hand
 * @returns {string}
 */
function getHandType(hand) {
  const handSet = new Set(hand);

  if (handSet.size === 1) {
    return HAND_TYPE.FIVE_OF_A_KIND;
  }

  if (handSet.size === 2) {
    return hand.some((card) => hand.filter((c) => c === card).length === 4)
      ? HAND_TYPE.FOUR_OF_A_KIND
      : HAND_TYPE.FULL_HOUSE;
  }

  if (handSet.size === 3) {
    return hand.some((card) => hand.filter((c) => c === card).length === 3)
      ? HAND_TYPE.THREE_OF_A_KIND
      : HAND_TYPE.TWO_PAIR;
  }

  if (handSet.size === 4) {
    return HAND_TYPE.ONE_PAIR;
  }

  return HAND_TYPE.HIGH_CARD;
}

/**
 * Assign hand combination to a type, with the assumption that joker can turn into any card
 * @param {string[]} hand
 * @returns {string}
 */
function getHandTypeIncludingJokers(hand) {
  const handSet = new Set(hand);

  const numberOfJokers = hand.filter((card) => card === JOKER).length;
  const hasSameCardFourTimes = hand.some(
    (card) => hand.filter((c) => c === card).length === 4
  );
  const hasSameCardThreeTimes = hand.some(
    (card) => hand.filter((c) => c === card).length === 3
  );

  // I wish JS would support more complex pattern matching in a switch statement
  // Could be done with couple of mapping consts, but I think it might be less readable

  if (handSet.size === 1) {
    return HAND_TYPE.FIVE_OF_A_KIND;
  }

  // 4:1 or 3:2
  if (handSet.size === 2) {
    // 4:1
    if (hasSameCardFourTimes) {
      if (numberOfJokers === 1 || numberOfJokers === 4) {
        return HAND_TYPE.FIVE_OF_A_KIND;
      } else {
        return HAND_TYPE.FOUR_OF_A_KIND;
      }
      // 3:2
    } else {
      if (numberOfJokers === 2 || numberOfJokers === 3) {
        return HAND_TYPE.FIVE_OF_A_KIND;
      } else {
        return HAND_TYPE.FULL_HOUSE;
      }
    }
  }

  // 3:1:1 or 2:2:1
  if (handSet.size === 3) {
    // 3:1:1
    if (hasSameCardThreeTimes) {
      if (numberOfJokers === 1 || numberOfJokers === 3) {
        return HAND_TYPE.FOUR_OF_A_KIND;
      } else {
        return HAND_TYPE.THREE_OF_A_KIND;
      }
      // 2:2:1
    } else {
      // If there are 2 jokers, it can be either FULL_HOUSE or FOUR_OF_A_KIND
      // Since FOUR_OF_A_KIND is higher, we handle this case in the next if
      if (numberOfJokers === 1) {
        return HAND_TYPE.FULL_HOUSE;
      } else if (numberOfJokers === 2) {
        return HAND_TYPE.FOUR_OF_A_KIND;
      } else {
        return HAND_TYPE.TWO_PAIR;
      }
    }
  }

  // 2:1:1:1
  if (handSet.size === 4) {
    if (numberOfJokers === 1 || numberOfJokers === 2) {
      return HAND_TYPE.THREE_OF_A_KIND;
    } else {
      return HAND_TYPE.ONE_PAIR;
    }
  }

  // 1:1:1:1:1
  if (numberOfJokers === 1) {
    return HAND_TYPE.ONE_PAIR;
  }

  return HAND_TYPE.HIGH_CARD;
}
