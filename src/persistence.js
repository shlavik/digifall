import * as idbKeyval from "idb-keyval";
import { get, writable } from "svelte/store";

import { KEYS } from "./constants.js";

export function localStorageStore(key, initialValue) {
  const store = writable(initialValue);
  const json = localStorage.getItem(key);
  if (json) store.set(JSON.parse(json));
  else localStorage.setItem(key, JSON.stringify(initialValue));
  return {
    set(value) {
      localStorage.setItem(key, JSON.stringify(value));
      store.set(value);
    },
    update(cb) {
      this.set(cb(get(this)));
    },
    subscribe: store.subscribe,
  };
}

const database = idbKeyval.createStore(KEYS.digifall, KEYS.digifall);

export function indexedDBStore(key, initialValue) {
  const store = writable(initialValue);
  idbKeyval.get(key, database).then((value) => {
    if (value === undefined && initialValue !== undefined) {
      idbKeyval.set(key, initialValue, database);
      return;
    }
    if (value === initialValue) return;
    store.set(value);
  });
  return {
    set(value) {
      idbKeyval.set(key, value, database).then(() => store.set(value));
    },
    update(cb) {
      idbKeyval.get(key, database).then((value) => this.set(cb(value)));
    },
    subscribe: store.subscribe,
  };
}
