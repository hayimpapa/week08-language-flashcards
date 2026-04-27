// Progress is stored per (language, level) so switching course doesn't mix
// progress between Indonesian Beginner, Spanish Intermediate, etc.
// Direction codes are language-agnostic: "en-tr" = English → translation,
// "tr-en" = translation → English. The translation language is implied by
// which storage bucket the cards live in.

const STORAGE_PREFIX = "linguaflip_v2";

function storageKey(language, level) {
  return `${STORAGE_PREFIX}:${language}:${level}`;
}

export function loadState(language, level) {
  try {
    const raw = localStorage.getItem(storageKey(language, level));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(language, level, state) {
  localStorage.setItem(storageKey(language, level), JSON.stringify(state));
}

export function initializeCards(words) {
  const now = Date.now();
  const cards = [];

  for (const word of words) {
    cards.push({
      wordId: word.id,
      direction: "en-tr",
      status: "active",
      lastSeen: null,
      nextDue: now,
    });
    cards.push({
      wordId: word.id,
      direction: "tr-en",
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
