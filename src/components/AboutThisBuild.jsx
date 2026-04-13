const REPO_NAME = "week08-language-flashcards";
const GITHUB_URL = `https://github.com/hayimpapa/${REPO_NAME}`;

export default function AboutThisBuild() {
  return (
    <div className="about-build">
      <header className="about-header">
        <h1 className="about-title">About This Build</h1>
        <p className="about-subtitle">
          Week 8 of{" "}
          <strong>52 Apps in 52 Weeks Before I Turn 52</strong> by Hey I'm Papa
        </p>
      </header>

      <div className="about-cards">
        <section className="about-card">
          <h2 className="about-card-heading">THE PROBLEM</h2>
          <p>
            Picking up a new language means grinding through hundreds of
            unfamiliar words, and most vocabulary apps bury that simple task
            under gamification, streaks, and ads. When you just want a quick,
            focused drill on English ↔ Indonesian words, the friction gets in
            the way of the practice itself.
          </p>
        </section>

        <section className="about-card">
          <h2 className="about-card-heading">THE APP</h2>
          <p>
            LinguaFlip is a minimal flashcard app for learning Indonesian,
            built with React 19 and Vite. It uses a lightweight spaced
            repetition scheduler — repeat soon, repeat later, or retire. The
            vocabulary list is stored in <strong>Supabase</strong> and fetched
            once at startup, while your review progress is persisted locally
            to <code>localStorage</code> so there's no sign-up required. You
            can study in either direction (English → Indonesian or the
            reverse), browse every card, and reactivate retired ones.
          </p>
        </section>

        <section className="about-card">
          <h2 className="about-card-heading">GITHUB REPO</h2>
          <p>The full source for this week's build lives on GitHub.</p>
          <a
            className="about-github-btn"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </section>
      </div>
    </div>
  );
}
