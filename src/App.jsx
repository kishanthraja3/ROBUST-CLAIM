// src/App.jsx — Enterprise Router, global state, toast system
import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar  from './components/Topbar';
import Dashboard    from './pages/Dashboard';
import Investigation from './pages/Investigation';
import History      from './pages/History';
import Account      from './pages/Account';
import { INITIAL_HISTORY, MOCK_CLAIMS, MOCK_ANALYSIS, genId } from './data/mockData';

const TOAST_ICONS = {
  success: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className={`toast-icon ${t.type}`}>{TOAST_ICONS[t.type]}</span>
          <div>
            <div className="toast-title">{t.title}</div>
            {t.msg && <div className="toast-msg">{t.msg}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage]       = useState('investigation'); // default directly to the flagship investigation console
  const [collapsed, setCol]   = useState(false);
  const [history, setHistory] = useState([...INITIAL_HISTORY]);
  const [toasts, setToasts]   = useState([]);

  // Initially null so page starts in clean 'idle' state
  const [currentClaim, setClaim]       = useState(null);
  const [currentAnalysis, setAnalysis] = useState(null);

  // ── Toast System ─────────────────────────────────────────────
  const toast = useCallback((type, title, msg, dur = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), dur);
  }, []);

  // ── Quick Search from Topbar ─────────────────────────────────
  function handleQuickSearch(claimIdQuery) {
    const found = MOCK_CLAIMS.find(
      (c) => c.claimId.toLowerCase().includes(claimIdQuery.toLowerCase()) ||
             c.beneficiaryId.toLowerCase().includes(claimIdQuery.toLowerCase())
    );
    if (found) {
      setClaim(found);
      setAnalysis(MOCK_ANALYSIS[found.claimId] || {
        score: 75,
        rawScore: 0.75,
        level: 'HIGH',
        status: 'FLAGGED',
        adversarial: 'SENSITIVE',
      });
      setPage('investigation');
      toast('info', 'Claim Located', `Opened ${found.claimId} in Investigation Console.`);
    } else {
      toast('warning', 'Claim Not Found', `No match for "${claimIdQuery}". Try CLM-90210-FX88.`);
    }
  }

  // ── Run Detection from Topbar ────────────────────────────────
  function handleRunDetection() {
    toast('info', 'Pipeline Active', 'Executing ensemble fraud detector across 24 pending submissions...', 2000);
    setTimeout(() => {
      toast('warning', 'Anomaly Detected', 'Flagged CLM-90210-FX88 with DRG Cost Outlier (+0.35).', 4000);
    }, 1800);
  }

  // ── Investigation Decision ───────────────────────────────────
  function handleAction(claim, analysis, action) {
    const existingHold = history.find((h) => h.claimId === claim.claimId && h.action === 'HOLD' && !h.resolvedAt);
    if (existingHold && action !== 'HOLD') {
      setHistory((prev) =>
        prev.map((h) =>
          h.id === existingHold.id
            ? { ...h, resolvedAt: new Date().toISOString(), resolvedAction: action }
            : h
        )
      );
      return;
    }
    const record = {
      id: genId(),
      claimId: claim.claimId,
      score: analysis.score,
      level: analysis.level,
      status: analysis.status,
      adversarial: analysis.adversarial,
      action,
      ts: new Date().toISOString(),
      resolvedAt: null,
      resolvedAction: null,
    };
    setHistory((prev) => [record, ...prev]);
  }

  // ── History Resolve ──────────────────────────────────────────
  function handleResolve(histId, resolution) {
    setHistory((prev) =>
      prev.map((h) =>
        h.id === histId
          ? { ...h, resolvedAt: new Date().toISOString(), resolvedAction: resolution }
          : h
      )
    );
  }

  const holdCount = history.filter((h) => h.action === 'HOLD' && !h.resolvedAt).length;

  // ── Page Router ──────────────────────────────────────────────
  function renderPage() {
    const commonProps = { history, toast, onNav: setPage };
    switch (page) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'investigation-new':
        return (
          <Investigation
            {...commonProps}
            onAction={handleAction}
            currentClaim={currentClaim}
            setCurrentClaim={setClaim}
            currentAnalysis={currentAnalysis}
            setCurrentAnalysis={setAnalysis}
            initialMode="manual"
          />
        );
      case 'investigation':
        return (
          <Investigation
            {...commonProps}
            onAction={handleAction}
            currentClaim={currentClaim}
            setCurrentClaim={setClaim}
            currentAnalysis={currentAnalysis}
            setCurrentAnalysis={setAnalysis}
            initialMode="lookup"
          />
        );
      case 'history':
        return <History {...commonProps} onResolve={handleResolve} />;
      case 'account':
        return <Account {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        onNav={setPage}
        collapsed={collapsed}
        holdCount={holdCount}
      />
      <div className="main-wrap">
        <Topbar
          page={page}
          onNav={setPage}
          onQuickSearch={handleQuickSearch}
          onRunDetection={handleRunDetection}
        />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
