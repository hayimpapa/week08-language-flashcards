import { LEVELS } from "../data/catalog";

export default function LevelSelect({ language, onSelect, onBackToLanguage }) {
  return (
    <div className="menu-screen">
      <button
        type="button"
        className="btn btn-ghost menu-back"
        onClick={onBackToLanguage}
      >
        ← {language.flag} {language.name}
      </button>

      <header className="menu-header">
        <h1 className="app-title">{language.name}</h1>
        <p className="app-subtitle">Pick a level</p>
      </header>

      <div className="menu-tiles menu-tiles-stacked">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.code}
            type="button"
            className={`menu-tile menu-tile-row ${
              lvl.active ? "" : "menu-tile-disabled"
            }`}
            disabled={!lvl.active}
            onClick={() => lvl.active && onSelect(lvl)}
          >
            <div className="menu-tile-row-text">
              <span className="menu-tile-name">{lvl.name}</span>
              <span className="menu-tile-desc">{lvl.description}</span>
            </div>
            {!lvl.active && (
              <span className="menu-tile-coming">Coming soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
