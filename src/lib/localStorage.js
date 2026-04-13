export const loadCache = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
};

export const saveCache = (storageKey, map) => {
  localStorage.setItem(storageKey, JSON.stringify([...map.entries()]));
};

export const clearCache = (storageKey) => {
  localStorage.removeItem(storageKey);
};
