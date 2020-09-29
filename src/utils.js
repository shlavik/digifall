export function getRandom(previous = 0) {
  return (previous * 16807 + 19487171) % 2147483647;
}

export function getBase64FromArray(array) {
  return btoa(String.fromCodePoint(...array));
}

export function getArrayFromBase64(base64) {
  return [...atob(base64)].map((letter) => letter.charCodeAt());
}

export function curry(fn0) {
  return function fn1(...args1) {
    if (fn0.length <= args1.length) {
      return fn0(...args1);
    }
    return function (...args2) {
      return fn1(...args1.concat(args2));
    };
  };
}
