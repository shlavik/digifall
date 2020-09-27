export function getRandom(previous = 0) {
  return (previous * 16807 + 19487171) % 2147483647;
}

export function setShadow(on = true) {
  const { style } = document.documentElement;
  const none = "none";
  const transparent = "0 0 0 transparent";
  const shadow0 = "0 0 1px black";
  const shadow1 = "0 0.5rem 0.5rem var(--color-black-04), 0 -1px 0 white";
  const shadow2 = "0 1rem 1rem var(--color-black-04),  0 -1px 0 white";
  const shadow21 = "0 0 21rem 1rem black";
  const shadowInset1 =
    "inset 0 0.5rem 0.5rem var(--color-black-04), 0 1px 0 white";
  const shadowInset2 = "inset 0 1rem 1rem var(--color-black-04), 0 1px 0 white";
  style.setProperty("--shadow-0", on ? shadow0 : none);
  style.setProperty("--shadow-1", on ? shadow1 : none);
  style.setProperty("--shadow-2", on ? shadow2 : none);
  style.setProperty("--shadow-21", on ? shadow21 : transparent);
  style.setProperty("--shadow-inset-1", on ? shadowInset1 : none);
  style.setProperty("--shadow-inset-2", on ? shadowInset2 : none);
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
