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
      duration: 0,
      type: ~~(Math.random() * 10),
      x: ~~(index / 7),
      y: index % 7
    }));

export const getFieldRecursive = field => {
  const matchedIndexes = getMatchedIndexes(field);
  if (!matchedIndexes.length) return field;
  return getFieldRecursive(getCardsFallen(getCardsMatched(field, matchedIndexes)));
};

export const getFieldNonRecursive = field => {
  let matchedIndexes = 1;
  while (matchedIndexes) {
    matchedIndexes = getMatchedIndexes(field);
    if (!matchedIndexes.length) return field;
    field = getCardsFallen(getCardsMatched(field, matchedIndexes));
  }
};

export const getFieldInit = () => getFieldNonRecursive(getFieldRandom());

export const getFieldSeed = seed => {};

export const getCardsFallen = cards => {
  const result = [];
  const field = getFieldIndexes(cards);
  for (let x in field) {
    let counterY = 0;
    for (let y in field[x]) {
      const index = field[x][y];
      if (index !== undefined) {
        const card = cards[index];
        result[index] = {
          ...card,
          duration: (1 - (0.4 * counterY) / 7) * counterY * 75,
          y: y - counterY
        };
      } else ++counterY;
    }
  }
  return result;
};

export const getMatchedIndexes = cards => {
  const field = getFieldIndexes(cards);
  let groupedArray = [];
  let counter = 0;
  const group = index => {
    const { type, x, y } = cards[index];
    if (groupedArray[index]) return;
    groupedArray[index] = { type, group: counter };
    let topIndex, rightIndex, bottomIndex, leftIndex;
    if (y < 6) topIndex = field[x][y + 1];
    if (x < 6) rightIndex = field[x + 1][y];
    if (y > 0) bottomIndex = field[x][y - 1];
    if (x > 0) leftIndex = field[x - 1][y];
    const isSameType = index => index && cards[index].type === type;
    if (isSameType(topIndex)) group(topIndex);
    if (isSameType(rightIndex)) group(rightIndex);
    if (isSameType(bottomIndex)) group(bottomIndex);
    if (isSameType(leftIndex)) group(leftIndex);
  };
  for (let index in cards) {
    ++counter;
    group(index);
  }
  const groupedObject = groupedArray.reduce(
    (result, { type, group }, index) => ({
      ...result,
      [group]: {
        type,
        indexes: [...(result[group] ? result[group].indexes : []), index]
      }
    }),
    {}
  );
  return Object.keys(groupedObject).reduce((result, group) => {
    const { type, indexes } = groupedObject[group];
    return type === indexes.length ? [...result, ...indexes] : result;
  }, []);
};

export const getCardsMatched = (cards, matchedIndexes) => {
  let counters = [0, 0, 0, 0, 0, 0, 0];
  const getNewY = x => counters[x] + cards.filter(card => card.x === x).sort(({ y: y1 }, { y: y2 }) => y1 - y2)[6].y;
  return cards.map((card, index) => {
    if (matchedIndexes.includes(index) && card.y < 7) {
      ++counters[card.x];
      return {
        ...card,
        duration: 0,
        type: ~~(Math.random() * 10),
        y: getNewY(card.x)
      };
    } else return card;
  });
};

export const getCardsPlusOne = (cards, plusIndex) =>
  cards.map((card, cardIndex) =>
    plusIndex === cardIndex && card.y < 7
      ? {
          ...card,
          duration: 0,
          type: card.type < 9 ? card.type + 1 : 0
        }
      : card
  );

export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; --i) {
    const j = ~~(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
