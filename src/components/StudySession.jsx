import { useState, useCallback, useEffect, useRef } from "react";
import FlashCard from "./FlashCard";
import Breadcrumb from "./Breadcrumb";
import { getDueCards, getNextDueTime } from "../utils/scheduler";

// Matches the .flashcard-inner transition duration in global.css so the next
// card isn't swapped in until the current card has finished flipping back.
const FLIP_ANIMATION_MS = 600;

export default function StudySession({
  cards,
  words,
  language,
  level,
  directionFilter,
  onRepeatSoon,
  onRepeatLater,
  onRetire,
  onBack,
  onChangeLanguage,
  onChangeLevel,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState(() =>
    getDueCards(cards, directionFilter)
  );
  const [completedCount, setCompletedCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const currentCard = sessionCards[currentIndex];
  const currentWord = currentCard
    ? words.find((w) => w.id === currentCard.wordId)
    : null;

  const nextDueTime = getNextDueTime(cards, directionFilter);

  const handleResponse = useCallback(
    (action) => {
      if (!currentCard || isTransitioning) return;

      if (action === "soon") onRepeatSoon(currentCard.wordId, currentCard.direction);
      else if (action === "later") onRepeatLater(currentCard.wordId, currentCard.direction);
      else if (action === "retire") onRetire(currentCard.wordId, currentCard.direction);

      // Start flipping back, but delay swapping in the next card until the
      // flip animation has finished — otherwise the back face of the card
      // briefly reveals the next card's answer mid-rotation.
      setIsTransitioning(true);
      setIsFlipped(false);

      transitionTimeoutRef.current = setTimeout(() => {
        setCompletedCount((c) => c + 1);
        setSessionCards((prev) => {
          const next = prev.filter((_, i) => i !== currentIndex);
          if (currentIndex >= next.length && next.length > 0) {
            setCurrentIndex(0);
          }
          return next;
        });
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, FLIP_ANIMATION_MS);
    },
    [currentCard, currentIndex, isTransitioning, onRepeatSoon, onRepeatLater, onRetire]
  );

  useEffect(() => {
    function handleKey(e) {
      if (!currentCard || isTransitioning) return;

      if (!isFlipped && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setIsFlipped(true);
      } else if (isFlipped) {
        if (e.key === "1") handleResponse("soon");
        else if (e.key === "2") handleResponse("later");
        else if (e.key === "3") handleResponse("retire");
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentCard, isFlipped, isTransitioning, handleResponse]);

  function formatTimeUntil(timestamp) {
    if (!timestamp) return "";
    const diff = timestamp - Date.now();
    if (diff <= 0) return "now";
    const mins = Math.ceil(diff / 60000);
    if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""}`;
    const hours = Math.ceil(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""}`;
    const days = Math.ceil(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""}`;
  }

  if (!currentWord || sessionCards.length === 0) {
    return (
      <div className="study-session">
        <Breadcrumb
          language={language}
          level={level}
          onChangeLanguage={onChangeLanguage}
          onChangeLevel={onChangeLevel}
        />
        <div className="session-empty">
          <div className="caught-up-card">
            <span className="caught-up-icon">🌴</span>
            <h2>You're all caught up!</h2>
            {nextDueTime ? (
              <p>
                Next card due in <strong>{formatTimeUntil(nextDueTime)}</strong>
              </p>
            ) : (
              <p>All cards have been retired. Amazing work!</p>
            )}
            {completedCount > 0 && (
              <p className="completed-note">
                You reviewed {completedCount} card
                {completedCount !== 1 ? "s" : ""} this session.
              </p>
            )}
            <button className="btn btn-primary" onClick={onBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-session">
      <Breadcrumb
        language={language}
        level={level}
        onChangeLanguage={onChangeLanguage}
        onChangeLevel={onChangeLevel}
      />

      <div className="session-header">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <span className="card-counter">
          Card {completedCount + 1} of {sessionCards.length + completedCount} due
        </span>
        <button className="btn btn-ghost" onClick={onBack}>
          Finish
        </button>
      </div>

      <FlashCard
        word={currentWord}
        direction={currentCard.direction}
        languageName={language.name}
        isFlipped={isFlipped}
        onFlip={() => {
          if (!isTransitioning) setIsFlipped(true);
        }}
      />

      {isFlipped && (
        <div className="response-buttons">
          <button
            className="btn btn-response btn-soon"
            onClick={() => handleResponse("soon")}
          >
            <span className="btn-emoji">🔁</span>
            <span className="btn-label">Repeat soon</span>
            <span className="btn-sub">Today</span>
          </button>
          <button
            className="btn btn-response btn-later"
            onClick={() => handleResponse("later")}
          >
            <span className="btn-emoji">📅</span>
            <span className="btn-label">Repeat later</span>
            <span className="btn-sub">3+ days</span>
          </button>
          <button
            className="btn btn-response btn-retire"
            onClick={() => handleResponse("retire")}
          >
            <span className="btn-emoji">✅</span>
            <span className="btn-label">Never repeat</span>
            <span className="btn-sub">Mastered</span>
          </button>
        </div>
      )}
    </div>
  );
}
