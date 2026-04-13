import { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import StudySession from "./components/StudySession";
import CardBrowser from "./components/CardBrowser";
import NavBar from "./components/NavBar";
import AboutThisBuild from "./components/AboutThisBuild";
import { loadState, saveState, initializeCards } from "./utils/storage";
import {
  repeatSoon,
  repeatLater,
  retire,
  reactivate,
} from "./utils/scheduler";
import { fetchWords } from "./data/wordsApi";

function findCardIndex(cards, wordId, direction) {
  return cards.findIndex(
    (c) => c.wordId === wordId && c.direction === direction
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("app");
  const [screen, setScreen] = useState("dashboard");
  const [directionFilter, setDirectionFilter] = useState("both");
  const [words, setWords] = useState(null);
  const [cards, setCards] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Fetch the word list from Supabase once on mount, then hydrate the
  // localStorage progress (or seed a fresh card set if nothing is saved).
  useEffect(() => {
    let cancelled = false;

    fetchWords()
      .then((fetched) => {
        if (cancelled) return;
        setWords(fetched);
        const saved = loadState();
        if (saved && saved.cards && saved.cards.length === fetched.length * 2) {
          setCards(saved.cards);
        } else {
          setCards(initializeCards(fetched));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load words from Supabase", err);
        setLoadError(err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Progress is persisted to localStorage on every card change, exactly as
  // before. Words are never written here.
  useEffect(() => {
    if (cards) saveState({ cards });
  }, [cards]);

  const updateCard = useCallback((wordId, direction, updater) => {
    setCards((prev) => {
      if (!prev) return prev;
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

  function renderAppContent() {
    if (loadError) {
      return (
        <div className="load-state load-error">
          <h2>Couldn't load words</h2>
          <p>{loadError.message}</p>
          <p>
            Check your Supabase credentials in <code>.env.local</code> and that
            the <code>words</code> table exists.
          </p>
        </div>
      );
    }

    if (!words || !cards) {
      return (
        <div className="load-state">
          <p>Loading words…</p>
        </div>
      );
    }

    if (screen === "dashboard") {
      return (
        <Dashboard
          cards={cards}
          directionFilter={directionFilter}
          onDirectionChange={setDirectionFilter}
          onStudy={() => setScreen("study")}
          onBrowse={() => setScreen("browse")}
        />
      );
    }

    if (screen === "study") {
      return (
        <StudySession
          cards={cards}
          words={words}
          directionFilter={directionFilter}
          onRepeatSoon={handleRepeatSoon}
          onRepeatLater={handleRepeatLater}
          onRetire={handleRetire}
          onBack={() => setScreen("dashboard")}
        />
      );
    }

    if (screen === "browse") {
      return (
        <CardBrowser
          cards={cards}
          words={words}
          onReactivate={handleReactivate}
          onBack={() => setScreen("dashboard")}
        />
      );
    }

    return null;
  }

  return (
    <div className="app-shell">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        <div className="app">
          {activeTab === "app" && renderAppContent()}
          {activeTab === "about" && <AboutThisBuild />}
        </div>
      </main>
    </div>
  );
}
