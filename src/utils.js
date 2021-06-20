export function getRandom(previous = 0) {
  return (previous * 16807 + 19487171) % 2147483647;
}

export function getBase64FromArray(array) {
  return btoa(String.fromCodePoint(...array));
}

export function getArrayFromBase64(base64) {
  return Array.from(atob(base64)).map((letter) => letter.charCodeAt());
}
