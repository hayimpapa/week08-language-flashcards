const ONE_HOUR = 60 * 60 * 1000;
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

export function repeatSoon(card) {
  const now = Date.now();
  return {
    ...card,
    status: "active",
    lastSeen: now,
    nextDue: now + ONE_HOUR,
  };
}

export function repeatLater(card) {
  const now = Date.now();
  return {
    ...card,
    status: "snoozed",
    lastSeen: now,
    nextDue: now + THREE_DAYS,
  };
}

export function retire(card) {
  return {
    ...card,
    status: "retired",
    lastSeen: Date.now(),
  };
}

export function reactivate(card) {
  return {
    ...card,
    status: "active",
    lastSeen: null,
    nextDue: Date.now(),
  };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getDueCards(cards, directionFilter) {
  const now = Date.now();

  const due = cards.filter((c) => {
    if (c.status === "retired") return false;
    if (directionFilter !== "both" && c.direction !== directionFilter)
      return false;
    return c.nextDue <= now;
  });

  // Split into unseen and seen, shuffle each group, then combine
  // so unseen cards still come first but in random order
  const unseen = due.filter((c) => c.lastSeen === null);
  const seen = due.filter((c) => c.lastSeen !== null);

  return [...shuffle(unseen), ...shuffle(seen)];
}

export function getNextDueTime(cards, directionFilter) {
  const now = Date.now();

  const futureDue = cards
    .filter((c) => {
      if (c.status === "retired") return false;
      if (directionFilter !== "both" && c.direction !== directionFilter)
        return false;
      return c.nextDue > now;
    })
    .sort((a, b) => a.nextDue - b.nextDue);

  return futureDue.length > 0 ? futureDue[0].nextDue : null;
}

export function getStats(cards) {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayMs = todayStart.getTime();

  let dueToday = 0;
  let completedToday = 0;
  let totalRetired = 0;

  for (const card of cards) {
    if (card.status === "retired") {
      totalRetired++;
      if (card.lastSeen && card.lastSeen >= todayMs) {
        completedToday++;
      }
    } else if (card.nextDue <= now) {
      dueToday++;
    } else if (card.lastSeen && card.lastSeen >= todayMs) {
      completedToday++;
    }
  }

  return {
    dueToday,
    completedToday,
    totalRetired,
    totalCards: cards.length,
  };
}
