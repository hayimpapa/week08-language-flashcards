// Compact in-app breadcrumb so the user can jump back to the language or
// level menu from any screen (Dashboard, Study, Browse).

export default function Breadcrumb({
  language,
  level,
  onChangeLanguage,
  onChangeLevel,
}) {
  return (
    <nav className="breadcrumb" aria-label="Course selection">
      <button
        type="button"
        className="breadcrumb-link"
        onClick={onChangeLanguage}
        title="Choose a different language"
      >
        <span className="breadcrumb-flag" aria-hidden="true">
          {language.flag}
        </span>
        {language.name}
      </button>
      <span className="breadcrumb-sep" aria-hidden="true">
        ›
      </span>
      <button
        type="button"
        className="breadcrumb-link"
        onClick={onChangeLevel}
        title="Choose a different level"
      >
        {level.name}
      </button>
    </nav>
  );
}
