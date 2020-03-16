const getRandr = (prev = 0) => (prev * 16807 + 19487171) % 2147483647;

const getRandrzInitial = seed => {
  let count = 1,
    result = [getRandr(seed)];
  while (count < 6) result = [...result, getRandr(++count * result[0])];
  return result;
};

const createGetNewCardValue = seed => {
  let randrz = getRandrzInitial(seed);
  return column => {
    if (column < 0 || 5 < column) return;
    let result = randrz[column];
    randrz[column] = getRandr(result);
    return Number(result % 10);
  };
};

const getNumberFromString = seed => {
  seed = String(seed).match(/[0-9A-Za-z]/g);
  if (!seed) return 0;
  seed = seed.length > 192 ? seed.slice(0, 192) : seed;
  return Number(parseInt(seed.join(""), 36));
};

const getNewCardValue = createGetNewCardValue(getNumberFromString(prompt("What seed is now?", Date.now())));

export const getFieldUndefined = () => {
  const arr0 = Array(12).fill();
  const arr1 = Array(12).fill();
  const arr2 = Array(12).fill();
  const arr3 = Array(12).fill();
  const arr4 = Array(12).fill();
  const arr5 = Array(12).fill();
  return [arr0, arr1, arr2, arr3, arr4, arr5];
};

export const getFieldIndexes = cards => {
  const field = getFieldUndefined();
  cards.forEach((card, index) => (field[card.x][card.y] = index));
  return field;
};

export const getFieldRandom = () =>
  Array(36)
    .fill(undefined)
    .map((_, index) => ({
      x: Math.floor(index / 6),
      y: index % 6,
      value: getNewCardValue(Math.floor(index / 6)),
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
    let count = 0;
    for (let y in field[x]) {
      const index = field[x][y];
      if (index !== undefined) {
        const card = cards[index];
        result[index] = {
          x: card.x,
          y: y - count,
          value: card.value,
          duration: 100 * Math.sqrt(2 * count)
        };
      } else ++count;
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
    if (y < 5) topIndex = field[x][y + 1];
    if (x < 5) rightIndex = field[x + 1][y];
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
  let counts = [0, 0, 0, 0, 0, 0];
  const getNewY = x => counts[x] + cards.filter(card => card.x === x).sort(({ y: y1 }, { y: y2 }) => y1 - y2)[5].y;
  return cards.map((card, index) => {
    if (matchedIndexes.includes(index) && card.y < 6) {
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
    plusIndex === cardIndex && card.y < 6
      ? {
        x: card.x,
        y: card.y,
        value: card.value < 9 ? card.value + 1 : 0,
        duration: 0
      }
      : card
  );
