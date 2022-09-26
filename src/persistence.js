import { createStore, get as idbGet, set as idbSet } from "idb-keyval";
import { get, writable } from "svelte/store";

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

export function createIndexedDBStore(dbName, storeName) {
  const db = createStore(dbName, storeName);
  return function indexedDBStore(key, initialValue) {
    const store = writable(initialValue);
    idbGet(key, db).then((value) => {
      if (value === undefined && initialValue !== undefined) {
        idbSet(key, initialValue, db);
        return;
      }
      if (value === initialValue) return;
      store.set(value);
    });
    return {
      set(value) {
        idbSet(key, value, db).then(() => store.set(value));
      },
      update(cb) {
        idbGet(key, db).then((value) => this.set(cb(value)));
      },
      subscribe: store.subscribe,
    };
  };
}
