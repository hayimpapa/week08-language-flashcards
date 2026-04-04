import { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import StudySession from "./components/StudySession";
import CardBrowser from "./components/CardBrowser";
import { loadState, saveState, initializeCards } from "./utils/storage";
import {
  repeatSoon,
  repeatLater,
  retire,
  reactivate,
} from "./utils/scheduler";
import words from "./data/words";

function findCardIndex(cards, wordId, direction) {
  return cards.findIndex(
    (c) => c.wordId === wordId && c.direction === direction
  );
}

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [directionFilter, setDirectionFilter] = useState("both");
  const [cards, setCards] = useState(() => {
    const saved = loadState();
    if (saved && saved.cards && saved.cards.length === words.length * 2) {
      return saved.cards;
    }
    return initializeCards(words);
  });

  useEffect(() => {
    saveState({ cards });
  }, [cards]);

  const updateCard = useCallback((wordId, direction, updater) => {
    setCards((prev) => {
      const idx = findCardIndex(prev, wordId, direction);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = updater(next[idx]);
      return next;
    });
  }, []);

  const handleRepeatSoon = useCallback(
    (wordId, direction) => updateCard(wordId, direction, repeatSoon),
    [updateCard]
  );

  const handleRepeatLater = useCallback(
    (wordId, direction) => updateCard(wordId, direction, repeatLater),
    [updateCard]
  );

  const handleRetire = useCallback(
    (wordId, direction) => updateCard(wordId, direction, retire),
    [updateCard]
  );

  const handleReactivate = useCallback(
    (wordId, direction) => updateCard(wordId, direction, reactivate),
    [updateCard]
  );

  return (
    <div className="app">
      {screen === "dashboard" && (
        <Dashboard
          cards={cards}
          directionFilter={directionFilter}
          onDirectionChange={setDirectionFilter}
          onStudy={() => setScreen("study")}
          onBrowse={() => setScreen("browse")}
        />
      )}
      {screen === "study" && (
        <StudySession
          cards={cards}
          directionFilter={directionFilter}
          onRepeatSoon={handleRepeatSoon}
          onRepeatLater={handleRepeatLater}
          onRetire={handleRetire}
          onBack={() => setScreen("dashboard")}
        />
      )}
      {screen === "browse" && (
        <CardBrowser
          cards={cards}
          onReactivate={handleReactivate}
          onBack={() => setScreen("dashboard")}
        />
      )}
    </div>
  );
}
