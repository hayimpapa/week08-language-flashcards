import { useState } from "react";
import words from "../data/words";
import { getCardKey } from "../utils/storage";

export default function CardBrowser({ cards, onReactivate, onBack }) {
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
      w.indonesian.toLowerCase().includes(q)
    );
  });

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
          const enId = cardMap[getCardKey(word.id, "en-id")];
          const idEn = cardMap[getCardKey(word.id, "id-en")];

          return (
            <div key={word.id} className="browser-item">
              <div className="browser-item-words">
                <span className="word-en">{word.english}</span>
                <span className="word-arrow">↔</span>
                <span className="word-id">{word.indonesian}</span>
              </div>
              <div className="browser-item-status">
                <div className="direction-status">
                  <span className="dir-label">EN→ID</span>
                  {statusBadge(enId)}
                  {enId && enId.status === "retired" && (
                    <button
                      className="btn btn-xs"
                      onClick={() => onReactivate(word.id, "en-id")}
                    >
                      Undo
                    </button>
                  )}
                </div>
                <div className="direction-status">
                  <span className="dir-label">ID→EN</span>
                  {statusBadge(idEn)}
                  {idEn && idEn.status === "retired" && (
                    <button
                      className="btn btn-xs"
                      onClick={() => onReactivate(word.id, "id-en")}
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
