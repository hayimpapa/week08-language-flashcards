import { useState } from "react";
import Breadcrumb from "./Breadcrumb";
import { getCardKey } from "../utils/storage";

export default function CardBrowser({
  cards,
  words,
  language,
  level,
  onReactivate,
  onBack,
  onChangeLanguage,
  onChangeLevel,
}) {
  const [search, setSearch] = useState("");

  const cardMap = {};
  for (const card of cards) {
    cardMap[getCardKey(card.wordId, card.direction)] = card;
  }

  const filtered = words.filter((w) => {
    const q = search.toLowerCase();
    return (
      !q ||
      w.english.toLowerCase().includes(q) ||
      w.translation.toLowerCase().includes(q)
    );
  });

  const langShort = language.short;

  function statusBadge(card) {
    if (!card) return <span className="badge-status badge-new">New</span>;
    const now = Date.now();
    if (card.status === "retired")
      return <span className="badge-status badge-retired">Mastered</span>;
    if (card.nextDue <= now)
      return <span className="badge-status badge-due">Due</span>;
    return <span className="badge-status badge-snoozed">Snoozed</span>;
  }

  return (
    <div className="card-browser">
      <Breadcrumb
        language={language}
        level={level}
        onChangeLanguage={onChangeLanguage}
        onChangeLevel={onChangeLevel}
      />

      <div className="browser-header">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <h2>All Cards</h2>
        <span className="word-count">{words.length} words</span>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="browser-list">
        {filtered.map((word) => {
          const enTr = cardMap[getCardKey(word.id, "en-tr")];
          const trEn = cardMap[getCardKey(word.id, "tr-en")];

          return (
            <div key={word.id} className="browser-item">
              <div className="browser-item-words">
                <span className="word-en">{word.english}</span>
                <span className="word-arrow">↔</span>
                <span className="word-id">{word.translation}</span>
              </div>
              <div className="browser-item-status">
                <div className="direction-status">
                  <span className="dir-label">EN→{langShort}</span>
                  {statusBadge(enTr)}
                  {enTr && enTr.status === "retired" && (
                    <button
                      className="btn btn-xs"
                      onClick={() => onReactivate(word.id, "en-tr")}
                    >
                      Undo
                    </button>
                  )}
                </div>
                <div className="direction-status">
                  <span className="dir-label">{langShort}→EN</span>
                  {statusBadge(trEn)}
                  {trEn && trEn.status === "retired" && (
                    <button
                      className="btn btn-xs"
                      onClick={() => onReactivate(word.id, "tr-en")}
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
