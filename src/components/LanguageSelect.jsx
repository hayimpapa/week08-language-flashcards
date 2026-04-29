import { LANGUAGES } from "../data/catalog";

export default function LanguageSelect({ onSelect }) {
  return (
    <div className="menu-screen">
      <header className="menu-header">
        <h1 className="app-title">LinguaFlip</h1>
        <p className="app-subtitle">Choose a language to learn</p>
      </header>

      <div className="menu-tiles">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`menu-tile ${lang.active ? "" : "menu-tile-disabled"}`}
            disabled={!lang.active}
            onClick={() => lang.active && onSelect(lang)}
          >
            <span className="menu-tile-flag" aria-hidden="true">
              {lang.flag}
            </span>
            <span className="menu-tile-name">{lang.name}</span>
            {!lang.active && (
              <span className="menu-tile-coming">Coming soon</span>
            )}
          </button>
        ))}
      </div>

      <p className="menu-footnote">Base language is always English.</p>
    </div>
  );
}
