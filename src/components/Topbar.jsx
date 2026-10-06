// src/components/Topbar.jsx
// Matches screenshot topbar: Claims Feed, Priority Queue, search input, "RUN DETECTION" dark pill, bell, history, avatar

import { useState } from 'react';

export default function Topbar({ page, onNav, onQuickSearch, onRunDetection }) {
  const [searchVal, setSearchVal] = useState('');

  function handleKeyDown(e) {
    if (e.key === 'Enter' && searchVal.trim()) {
      if (onQuickSearch) {
        onQuickSearch(searchVal.trim());
      }
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Navigation Quick Links */}
        <div className="topbar-links">
          <button
            className={`topbar-link ${page === 'history' ? 'active' : ''}`}
            onClick={() => onNav('history')}
          >
            Claims Feed
          </button>
          <button
            className={`topbar-link ${page === 'priority' ? 'active' : ''}`}
            onClick={() => onNav('history')}
          >
            Priority Queue
          </button>
        </div>

        {/* Search Claim ID input */}
        <div className="topbar-search-wrap">
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search Claim ID..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Bell Notification */}
        <button
          className="topbar-icon-btn"
          onClick={() => onNav('history')}
          title="Flagged Alerts"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="notif-badge" />
        </button>

        {/* Clock History */}
        <button
          className="topbar-icon-btn"
          onClick={() => onNav('history')}
          title="Investigation History"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>

        {/* User Avatar */}
        <div
          className="topbar-avatar"
          onClick={() => onNav('account')}
          title="Dr. Reena Patel (Lead Investigator)"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Investigator Avatar"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerText = 'RP';
            }}
          />
        </div>
      </div>
    </header>
  );
}
