const getFieldUndefined = () => {
  const arr1 = Array(14).fill(undefined);
  const arr2 = Array(14).fill(undefined);
  const arr3 = Array(14).fill(undefined);
  const arr4 = Array(14).fill(undefined);
  const arr5 = Array(14).fill(undefined);
  const arr6 = Array(14).fill(undefined);
  const arr7 = Array(14).fill(undefined);
  return [arr1, arr2, arr3, arr4, arr5, arr6, arr7];
};

const getFieldFromBlocks = (blocks, type = "index") => {
  const newField = getFieldUndefined();
  blocks.forEach((block, index) => (newField[block.x][block.y] = type === "index" ? index : block.type));
  return newField;
};

const getBlocksFallen = blocks => {
  const result = [];
  const field = getFieldFromBlocks(blocks);
  for (let x in field) {
    let counterY = 0;
    for (let y in field[x]) {
      const index = field[x][y];
      if (index !== undefined) {
        const block = blocks[index];
        result[index] = {
          ...block,
          duration: (1 - (0.4 * counterY) / 7) * counterY * 75,
          y: y - counterY
        };
      } else ++counterY;
    }
  }
  return result;
};

const getMatchedIndexes = blocks => {
  const field = getFieldFromBlocks(blocks);
  let groupedArray = [];
  let counter = 0;
  const group = index => {
    const { type, x, y } = blocks[index];
    if (groupedArray[index]) return;
    groupedArray[index] = { type, group: counter };
    let topIndex, rightIndex, bottomIndex, leftIndex;
    if (y < 6) topIndex = field[x][y + 1];
    if (x < 6) rightIndex = field[x + 1][y];
    if (y > 0) bottomIndex = field[x][y - 1];
    if (x > 0) leftIndex = field[x - 1][y];
    const isSameType = index => index && blocks[index].type === type;
    if (isSameType(topIndex)) group(topIndex);
    if (isSameType(rightIndex)) group(rightIndex);
    if (isSameType(bottomIndex)) group(bottomIndex);
    if (isSameType(leftIndex)) group(leftIndex);
  };
  for (let index in blocks) {
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

const getBlocksMatched = (blocks, matchedIndexes) => {
  let counters = [0, 0, 0, 0, 0, 0, 0];
  const getNewY = x => counters[x] + blocks.filter(block => block.x === x).sort(({ y: y1 }, { y: y2 }) => y1 - y2)[6].y;
  return blocks.map((block, index) => {
    if (matchedIndexes.includes(index) && block.y < 7) {
      ++counters[block.x];
      return {
        ...block,
        duration: 0,
        type: ~~(Math.random() * 10),
        y: getNewY(block.x)
      };
    } else return block;
  });
};

const getBlocksPlusOne = (blocks, plusIndex) =>
  blocks.map((block, blockIndex) =>
    plusIndex === blockIndex && block.y < 7
      ? {
          ...block,
          duration: 0,
          type: block.type < 9 ? block.type + 1 : 0
        }
      : block
  );

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; --i) {
    const j = ~~(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { getBlocksFallen, getBlocksMatched, getBlocksPlusOne, getMatchedIndexes, shuffleArray };
