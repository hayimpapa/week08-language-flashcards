export default function NavBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "app", label: "LinguaFlip" },
    { id: "about", label: "About This Build" },
  ];

  return (
    <nav className="nav-bar">
      <div className="nav-bar-inner">
        <a
          className="nav-logo"
          href="https://52-app.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="52 Apps in 52 Weeks"
        >
          <img
            src="https://raw.githubusercontent.com/hayimpapa/week00-main-page/main/public/w52.png"
            alt="52 Apps Logo"
          />
        </a>
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
