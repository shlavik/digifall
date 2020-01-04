export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandr = prev => {
  const a = 6364136223846793005n;
  const c = 1442695040888963407n;
  const m = 2n ** 64n;
  return (a * BigInt(prev) + c) % m;
};

const getRandrzInitial = seed => {
  let count = 1n,
    result = [getRandr(seed)];
  while (count < 7n) {
    result = [...result, getRandr(count * result[count - 1n])];
    ++count;
  }
  return result;
};

const createGetNewCardValue = seed => {
  let randrz = getRandrzInitial(seed);
  return column => {
    if (column < 0 || 6 < column) return;
    let result = randrz[column];
    randrz[column] = getRandr(result);
    return Number(result % 9n);
  };
};

const getNumberFromString = seed => {
  seed = String(seed).match(/[0-9A-Za-z]/g);
  if (!seed || !seed.length) return 0;
  seed = seed.length > 192 ? seed.slice(0, 192) : seed;
  return Number(parseInt(seed.join(""), 36));
};

const getNewCardValue = createGetNewCardValue(getNumberFromString(prompt("What seed is now?")));

export const getFieldUndefined = () => {
  const arr1 = Array(14).fill(undefined);
  const arr2 = Array(14).fill(undefined);
  const arr3 = Array(14).fill(undefined);
  const arr4 = Array(14).fill(undefined);
  const arr5 = Array(14).fill(undefined);
  const arr6 = Array(14).fill(undefined);
  const arr7 = Array(14).fill(undefined);
  return [arr1, arr2, arr3, arr4, arr5, arr6, arr7];
};

export const getFieldIndexes = cards => {
  const field = getFieldUndefined();
  cards.forEach((card, index) => (field[card.x][card.y] = index));
  return field;
};

export const getFieldRandom = () =>
  Array(49)
    .fill(undefined)
    .map((_, index) => ({
      x: Math.floor(index / 7),
      y: index % 7,
      value: getNewCardValue(Math.floor(index / 7)),
      duration: 0
    }));

export const getFieldPrepared = field => {
  let matchedIndexes = 1;
  while (matchedIndexes) {
    matchedIndexes = getMatchedIndexes(field);
    if (!matchedIndexes.length) return field;
    field = getCardsFallen(getCardsMatched(field, matchedIndexes));
  }
};

export const getFieldInitial = () => getFieldPrepared(getFieldRandom());

export const getCardsFallen = cards => {
  const result = [];
  const field = getFieldIndexes(cards);
  for (let x in field) {
    let countY = 0;
    for (let y in field[x]) {
      const index = field[x][y];
      if (index !== undefined) {
        const card = cards[index];
        result[index] = {
          x: card.x,
          y: y - countY,
          value: card.value,
          duration: (1 - (0.4 * countY) / 7) * countY * 75
        };
      } else ++countY;
    }
  }
  return result;
};

export const getMatchedIndexes = cards => {
  const field = getFieldIndexes(cards);
  let groupedArray = [];
  let count = 0;
  const group = index => {
    const { value, x, y } = cards[index];
    if (groupedArray[index]) return;
    groupedArray[index] = { value, group: count };
    let topIndex, rightIndex, bottomIndex, leftIndex;
    if (y < 6) topIndex = field[x][y + 1];
    if (x < 6) rightIndex = field[x + 1][y];
    if (y > 0) bottomIndex = field[x][y - 1];
    if (x > 0) leftIndex = field[x - 1][y];
    const isSameValue = index => index && cards[index].value === value;
    if (isSameValue(topIndex)) group(topIndex);
    if (isSameValue(rightIndex)) group(rightIndex);
    if (isSameValue(bottomIndex)) group(bottomIndex);
    if (isSameValue(leftIndex)) group(leftIndex);
  };
  for (let index in cards) {
    ++count;
    group(index);
  }
  const groupedObject = groupedArray.reduce(
    (result, { value, group }, index) => ({
      ...result,
      [group]: {
        value,
        indexes: [...(result[group] ? result[group].indexes : []), index]
      }
    }),
    {}
  );
  return Object.keys(groupedObject).reduce((result, group) => {
    const { value, indexes } = groupedObject[group];
    return value === indexes.length ? [...result, ...indexes] : result;
  }, []);
};

export const getCardsMatched = (cards, matchedIndexes) => {
  let counts = [0, 0, 0, 0, 0, 0, 0];
  const getNewY = x => counts[x] + cards.filter(card => card.x === x).sort(({ y: y1 }, { y: y2 }) => y1 - y2)[6].y;
  return cards.map((card, index) => {
    if (matchedIndexes.includes(index) && card.y < 7) {
      ++counts[card.x];
      return {
        x: card.x,
        y: getNewY(card.x),
        value: getNewCardValue(card.x),
        duration: 0
      };
    } else return card;
  });
};

export const getCardsPlusOne = (cards, plusIndex) =>
  cards.map((card, cardIndex) =>
    plusIndex === cardIndex && card.y < 7
      ? {
          x: card.x,
          y: card.y,
          value: card.value < 9 ? card.value + 1 : 0,
          duration: 0
        }
      : card
  );
