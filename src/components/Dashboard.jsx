import Breadcrumb from "./Breadcrumb";
import { getStats, getDueCards } from "../utils/scheduler";

export default function Dashboard({
  cards,
  language,
  level,
  directionFilter,
  onDirectionChange,
  onStudy,
  onBrowse,
  onChangeLanguage,
  onChangeLevel,
}) {
  const stats = getStats(cards);
  const dueCards = getDueCards(cards, directionFilter);
  const masteryPercent =
    stats.totalCards > 0
      ? Math.round((stats.totalRetired / stats.totalCards) * 100)
      : 0;

  const directionOptions = [
    { value: "both", label: "Both Directions" },
    { value: "en-tr", label: `English → ${language.name}` },
    { value: "tr-en", label: `${language.name} → English` },
  ];

  return (
    <div className="dashboard">
      <Breadcrumb
        language={language}
        level={level}
        onChangeLanguage={onChangeLanguage}
        onChangeLevel={onChangeLevel}
      />

      <header className="dashboard-header">
        <h1 className="app-title">LinguaFlip</h1>
        <p className="app-subtitle">
          {language.flag} {language.name} · {level.name}
        </p>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{dueCards.length}</span>
          <span className="stat-label">Cards due</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.completedToday}</span>
          <span className="stat-label">Done today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalRetired}</span>
          <span className="stat-label">Mastered</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Overall mastery</span>
          <span>{masteryPercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
      </div>

      <div className="direction-toggle">
        {directionOptions.map((opt) => (
          <button
            key={opt.value}
            className={`btn btn-direction ${
              directionFilter === opt.value ? "active" : ""
            }`}
            onClick={() => onDirectionChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary btn-lg" onClick={onStudy}>
          Study Now
          {dueCards.length > 0 && (
            <span className="badge">{dueCards.length}</span>
          )}
        </button>
        <button className="btn btn-secondary btn-lg" onClick={onBrowse}>
          Browse All Cards
        </button>
      </div>
    </div>
  );
}
