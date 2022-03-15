export function UniQueue({
  data = [],
  maxSize = Infinity,
  compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0),
  extractKey = (item) => item,
} = {}) {
  this.data = data;
  const indexes = new Map(data.map((item, index) => [extractKey(item), index]));
  this.indexes = indexes;
  const up = (pos) => {
    const item = data[pos];
    while (pos > 0) {
      const parent = (pos - 1) >> 1;
      const current = data[parent];
      if (compare(item, current) >= 0) break;
      indexes.set(extractKey(current), pos);
      data[pos] = current;
      pos = parent;
    }
    indexes.set(extractKey(item), pos);
    data[pos] = item;
  };
  const down = (pos) => {
    const halfLength = data.length >> 1;
    const item = data[pos];
    while (pos < halfLength) {
      let left = (pos << 1) + 1;
      let best = data[left];
      const right = left + 1;
      if (right < data.length && compare(data[right], best) < 0) {
        left = right;
        best = data[right];
      }
      if (compare(best, item) >= 0) break;
      indexes.set(extractKey(best), pos);
      data[pos] = best;
      pos = left;
    }
    indexes.set(extractKey(item), pos);
    data[pos] = item;
  };
  if (data.length > 0) {
    for (let i = (data.length >> 1) - 1; i >= 0; i--) down(i);
  }
  this.push = (item) => {
    let index = indexes.get(extractKey(item));
    if (index === undefined) {
      data.push(item);
      up(data.length - 1);
      if (data.length <= maxSize) return;
      this.pop();
    } else {
      if (compare(data[index], item) >= 0) return;
      data[index] = item;
      down(index);
    }
  };
  this.pop = () => {
    if (data.length === 0) return undefined;
    const top = data[0];
    const bottom = data.pop();
    if (data.length > 0) {
      indexes.set(extractKey(bottom), 0);
      data[0] = bottom;
      down(0);
    }
    indexes.delete(extractKey(top));
    return top;
  };
  this.peek = () => {
    return data[0];
  };
}
