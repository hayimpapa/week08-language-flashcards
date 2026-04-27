export default function FlashCard({
  word,
  direction,
  languageName,
  onFlip,
  isFlipped,
}) {
  const front = direction === "en-tr" ? word.english : word.translation;
  const back = direction === "en-tr" ? word.translation : word.english;
  const label =
    direction === "en-tr"
      ? `English → ${languageName}`
      : `${languageName} → English`;

  return (
    <div className="flashcard-container">
      <span className="direction-label">{label}</span>
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={!isFlipped ? onFlip : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!isFlipped && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p className="card-text">{front}</p>
            <span className="tap-hint">Tap to flip</span>
          </div>
          <div className="flashcard-back">
            <p className="card-text-small">{front}</p>
            <div className="divider" />
            <p className="card-text">{back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
