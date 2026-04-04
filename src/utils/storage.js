const STORAGE_KEY = "linguaflip_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function initializeCards(words) {
  const now = Date.now();
  const cards = [];

  for (const word of words) {
    cards.push({
      wordId: word.id,
      direction: "en-id",
      status: "active",
      lastSeen: null,
      nextDue: now,
    });
    cards.push({
      wordId: word.id,
      direction: "id-en",
      status: "active",
      lastSeen: null,
      nextDue: now,
    });
  }

  return cards;
}

export function getCardKey(wordId, direction) {
  return `${wordId}-${direction}`;
}
