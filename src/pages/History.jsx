// src/pages/History.jsx
// Redesigned for visual calm and scannability:
// 1. "Risk Level" is the only filled colored pill badge in the row
// 2. Status, Adversarial, and Decision converted into plain text with small colored dot (●)
// 3. Removed progress bar; showing only bold percentage number
// 4. Replaced full yellow row background with thin 3.5px left-edge amber accent bar
// 5. Shortened timestamps to a single line, dropping year when matching current year
// 6. Merged Resolution and Actions into a single column, resolution status moved to subtext under Decision
// 7. Hairline row dividers and reduced row padding for a calm, dense list feel

import { useState } from 'react';
import { levelClass } from '../data/mockData';

const FILTERS = [
  { id: 'ALL',    label: 'All' },
  { id: 'ACCEPT', label: 'Accepted' },
  { id: 'HOLD',   label: 'On Hold' },
  { id: 'REJECT', label: 'Rejected' },
];

function formatShortTs(s) {
  if (!s) return '—';
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const currentYear = new Date().getFullYear();
  const dateYear = d.getFullYear();
  const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (dateYear === currentYear) {
    return `${monthDay} · ${time}`;
  }
  return `${monthDay}, ${dateYear} · ${time}`;
}

export default function History({ history, onResolve, toast }) {
  const [filter, setFilter]   = useState('ALL');
  const [modalItem, setModal] = useState(null);
  const [resolution, setRes]  = useState('');

  const holds   = history.filter((h) => h.action === 'HOLD' && !h.resolvedAt).length;
  const accepts = history.filter((h) => h.action === 'ACCEPT' || h.resolvedAction === 'ACCEPT').length;
  const rejects = history.filter((h) => h.action === 'REJECT' || h.resolvedAction === 'REJECT').length;

  const filtered = history.filter((h) => {
    if (filter === 'ALL') return true;
    if (filter === 'HOLD') return h.action === 'HOLD' && !h.resolvedAt;
    if (filter === 'ACCEPT') return h.action === 'ACCEPT' || h.resolvedAction === 'ACCEPT';
    if (filter === 'REJECT') return h.action === 'REJECT' || h.resolvedAction === 'REJECT';
    return true;
  });

  function openResolve(item, res) {
    setModal(item);
    setRes(res);
  }

  function confirmResolve() {
    if (!modalItem) return;
    onResolve(modalItem.id, resolution);
    setModal(null);
    toast(
      resolution === 'ACCEPT' ? 'success' : 'error',
      `Claim ${resolution}ED`,
      `${modalItem.claimId} hold resolved as ${resolution}.`
    );
  }

  return (
    <div className="page-inner page-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Audit Trail</div>
          <h1 className="page-title">Investigation History</h1>
          <p className="page-desc">All previous analysis decisions — resolve holds, review decisions, export records.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary sm"
            onClick={() => toast('info', 'Report Download', 'Report generation will be available once backend is connected.')}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="hist-strip">
        {[
          { label: 'Total Records', val: history.length, color: '#4F46E5' },
          { label: 'On Hold',       val: holds,          color: '#D97706' },
          { label: 'Accepted',      val: accepts,        color: '#16A34A' },
          { label: 'Rejected',      val: rejects,        color: '#DC2626' },
        ].map((s) => (
          <div className="hstat" key={s.label}>
            <span className="hstat-label">{s.label}</span>
            <span className="hstat-val" style={{ color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Toolbar with Four Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`chip${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.id === 'HOLD' && holds > 0 && (
                <span style={{ marginLeft: '6px', background: '#D97706', color: '#fff', borderRadius: '99px', padding: '0 6px', fontSize: '10px', fontWeight: 700 }}>
                  {holds}
                </span>
              )}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
          Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Calm & Scannable Claims Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Adversarial</th>
              <th>Decision</th>
              <th>Timestamp</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M3 3v5h5" />
                      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                    </svg>
                    <span>No records match this filter</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((h) => {
                const isOpenHold  = h.action === 'HOLD' && !h.resolvedAt;
                const isResolved  = h.action === 'HOLD' && h.resolvedAt;
                const finalAction = isResolved ? h.resolvedAction : h.action;

                // Color mappings for calm dots
                const statusColor = h.status === 'FLAGGED' ? '#DC2626' : '#16A34A';
                const statusLabel = h.status === 'FLAGGED' ? 'Flagged' : 'Not Flagged';

                const advColor = h.adversarial === 'STABLE' ? '#16A34A' : '#D97706';
                const advLabel = h.adversarial === 'STABLE' ? 'Stable' : 'Sensitive';

                let decColor = '#D97706';
                let decLabel = 'On Hold';
                if (finalAction === 'ACCEPT') {
                  decColor = '#16A34A';
                  decLabel = 'Accepted';
                } else if (finalAction === 'REJECT') {
                  decColor = '#DC2626';
                  decLabel = 'Rejected';
                }

                return (
                  <tr key={h.id} className={isOpenHold ? 'row-hold-accent' : undefined}>
                    {/* 1. Claim ID */}
                    <td className="td-mono mono">{h.claimId}</td>

                    {/* 2. Risk Score: Bold percentage number only, no bar */}
                    <td>
                      <span className="score-val-bold">{h.score}%</span>
                    </td>

                    {/* 3. Risk Level: ONLY filled colored pill badge */}
                    <td>
                      <span className={`badge sm ${levelClass(h.level)}`}>{h.level}</span>
                    </td>

                    {/* 4. Status: Plain text with small colored dot */}
                    <td>
                      <span className="dot-line">
                        <span className="dot-indicator" style={{ backgroundColor: statusColor }} />
                        <span>{statusLabel}</span>
                      </span>
                    </td>

                    {/* 5. Adversarial: Plain text with small colored dot */}
                    <td>
                      <span className="dot-line">
                        <span className="dot-indicator" style={{ backgroundColor: advColor }} />
                        <span>{advLabel}</span>
                      </span>
                    </td>

                    {/* 6. Decision: Plain text with small colored dot + resolution subtext beneath */}
                    <td>
                      <div className="dot-cell">
                        <span className="dot-line">
                          <span className="dot-indicator" style={{ backgroundColor: decColor }} />
                          <span>{decLabel}</span>
                        </span>
                        {isOpenHold ? (
                          <span className="dot-subtext pending">Pending</span>
                        ) : isResolved ? (
                          <span className="dot-subtext">Resolved {formatShortTs(h.resolvedAt)}</span>
                        ) : null}
                      </div>
                    </td>

                    {/* 7. Timestamp: Shortened single line */}
                    <td style={{ color: '#64748B', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                      {formatShortTs(h.ts)}
                    </td>

                    {/* 8. Merged Actions Column: Compact text buttons for pending, Report link for resolved */}
                    <td style={{ textAlign: 'right' }}>
                      {isOpenHold ? (
                        <div className="compact-action-btns">
                          <button
                            className="btn-compact-accept"
                            onClick={() => openResolve(h, 'ACCEPT')}
                            title={`Accept ${h.claimId}`}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-compact-reject"
                            onClick={() => openResolve(h, 'REJECT')}
                            title={`Reject ${h.claimId}`}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn-report-link"
                          onClick={() => toast('info', 'Report Export', `Report for ${h.claimId} will be available once backend is connected.`)}
                          title={`Download report for ${h.claimId}`}
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Report</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resolve Modal */}
      {modalItem && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Resolve Hold — {modalItem.claimId}</div>
              <button
                className="modal-close-btn"
                onClick={() => setModal(null)}
                title="Close dialog"
                aria-label="Close"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: '#334155' }}>
                You are about to <strong style={{ color: resolution === 'ACCEPT' ? '#16A34A' : '#DC2626' }}>{resolution}</strong> claim{' '}
                <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                  {modalItem.claimId}
                </code>.
              </p>
              <p style={{ marginTop: '10px', color: '#64748B', fontSize: '12.5px' }}>
                This will finalize the HOLD status in the audit trail and cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`modal-btn ${resolution === 'ACCEPT' ? 'modal-btn-accept' : 'modal-btn-reject'}`}
                onClick={confirmResolve}
              >
                {resolution === 'ACCEPT' ? (
                  <>
                    <span className="btn-icon-tick">✓</span>
                    <span>Confirm Accept</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon-cross">✗</span>
                    <span>Confirm Reject</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
