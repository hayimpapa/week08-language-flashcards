import { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import StudySession from "./components/StudySession";
import CardBrowser from "./components/CardBrowser";
import NavBar from "./components/NavBar";
import AboutThisBuild from "./components/AboutThisBuild";
import LanguageSelect from "./components/LanguageSelect";
import LevelSelect from "./components/LevelSelect";
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
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const [directionFilter, setDirectionFilter] = useState("both");
  const [words, setWords] = useState(null);
  const [cards, setCards] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Whenever the (language, level) pair changes, fetch that course's words
  // from Supabase and hydrate progress from the matching localStorage bucket.
  // State resets between courses are handled by the change handlers below, so
  // this effect only runs the fetch.
  useEffect(() => {
    if (!selectedLanguage || !selectedLevel) return;

    let cancelled = false;
    const langCode = selectedLanguage.code;
    const levelCode = selectedLevel.code;

    fetchWords(langCode, levelCode)
      .then((fetched) => {
        if (cancelled) return;
        setWords(fetched);
        const saved = loadState(langCode, levelCode);
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
  }, [selectedLanguage, selectedLevel]);

  // Persist progress to the bucket that matches the current course.
  useEffect(() => {
    if (cards && selectedLanguage && selectedLevel) {
      saveState(selectedLanguage.code, selectedLevel.code, { cards });
    }
  }, [cards, selectedLanguage, selectedLevel]);

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

  function resetCourseData() {
    setWords(null);
    setCards(null);
    setLoadError(null);
  }

  function changeLanguage() {
    resetCourseData();
    setSelectedLanguage(null);
    setSelectedLevel(null);
    setScreen("dashboard");
    setDirectionFilter("both");
  }

  function changeLevel() {
    resetCourseData();
    setSelectedLevel(null);
    setScreen("dashboard");
    setDirectionFilter("both");
  }

  function pickLanguage(lang) {
    resetCourseData();
    setSelectedLanguage(lang);
  }

  function pickLevel(lvl) {
    resetCourseData();
    setSelectedLevel(lvl);
  }

  function renderAppContent() {
    if (!selectedLanguage) {
      return <LanguageSelect onSelect={pickLanguage} />;
    }

    if (!selectedLevel) {
      return (
        <LevelSelect
          language={selectedLanguage}
          onSelect={pickLevel}
          onBackToLanguage={changeLanguage}
        />
      );
    }

    if (loadError) {
      return (
        <div className="load-state load-error">
          <h2>Couldn't load words</h2>
          <p>{loadError.message}</p>
          <p>
            Check your Supabase credentials in <code>.env.local</code>, that
            the <code>words</code> table exists, and that you've applied{" "}
            <code>supabase/migrations/001_add_language_and_level.sql</code>.
          </p>
          <button className="btn btn-ghost" onClick={changeLevel}>
            ← Back to levels
          </button>
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
          language={selectedLanguage}
          level={selectedLevel}
          directionFilter={directionFilter}
          onDirectionChange={setDirectionFilter}
          onStudy={() => setScreen("study")}
          onBrowse={() => setScreen("browse")}
          onChangeLanguage={changeLanguage}
          onChangeLevel={changeLevel}
        />
      );
    }

    if (screen === "study") {
      return (
        <StudySession
          cards={cards}
          words={words}
          language={selectedLanguage}
          level={selectedLevel}
          directionFilter={directionFilter}
          onRepeatSoon={handleRepeatSoon}
          onRepeatLater={handleRepeatLater}
          onRetire={handleRetire}
          onBack={() => setScreen("dashboard")}
          onChangeLanguage={changeLanguage}
          onChangeLevel={changeLevel}
        />
      );
    }

    if (screen === "browse") {
      return (
        <CardBrowser
          cards={cards}
          words={words}
          language={selectedLanguage}
          level={selectedLevel}
          onReactivate={handleReactivate}
          onBack={() => setScreen("dashboard")}
          onChangeLanguage={changeLanguage}
          onChangeLevel={changeLevel}
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
