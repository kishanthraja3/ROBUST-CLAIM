// src/pages/Investigation.jsx
// Refined with concrete UI enhancements:
// 1. Removed duplicate "Total Billed" field
// 2. Structured into 4 labeled mini-sections: "Patient", "Provider & Coding", "Billing", "Activity"
// 3. Subtle icons next to key field labels (calendar, dollar, user, hospital, activity)
// 4. Pop fields: Large bold Claim Amount, light red chip for Claim Duration, warning chip for high Previous Claim Count
// 5. Hairline card background with distinct surface elevation

import { useState } from 'react';
import {
  MOCK_CLAIMS,
  getDeterministicAnalysis,
  fmtCurrency,
  fmtDate,
  evaluateBusinessRules,
  getMockShapFactors,
  getMockSimilarCases,
  getMockAiSummary,
} from '../data/mockData';

function getOrdinal(n) {
  if (n == null) return '0th';
  const num = Math.round(n);
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── Shared Icons (Stroke 2.2, size 12px) ──────────────────────
const ICONS = {
  user: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  hospital: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
    </svg>
  ),
  dollar: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  calendar: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  clock: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  code: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  activity: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  layers: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  shield: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  stethoscope: (
    <svg className="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.2.3" />
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
};

// ── SHAP Red Feature Icons (matching screenshot) ─────────────
const SHAP_ICONS = {
  amount: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  duration: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  procedure: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
    </svg>
  ),
  provider: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3" />
      <line x1="9" y1="9" x2="9" y2="9.01" />
      <line x1="9" y1="13" x2="9" y2="13.01" />
      <line x1="9" y1="17" x2="9" y2="17.01" />
    </svg>
  ),
  frequency: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
};

// ── Claim Details Card Component (Structured Executive Dossier) ───────
function ClaimDetailsCard({ claim, onAnalyze, isAnalyzing, showAnalyzeButton = true }) {
  const isHighVelocity = claim.prevClaimCount >= 15;

  return (
    <div className="claim-dossier-card">
      {/* Dossier Hero Header */}
      <div className="dossier-hero">
        <div className="dossier-hero-left">
          <span className="dossier-pretitle">Healthcare Claim Dossier</span>
          <div className="dossier-id-row">
            <span className="dossier-claim-id">{claim.claimId}</span>
            <span className={`badge ${claim.claimType === 'Inpatient' ? 'badge-inpatient' : 'badge-outpatient'}`}>
              {claim.claimType}
            </span>
          </div>
          <div className="dossier-subline">
            <span>Service Window: {fmtDate(claim.claimStart)} → {fmtDate(claim.claimEnd)}</span>
            <span>•</span>
            <span>Beneficiary: <strong style={{ color: '#334155' }}>{claim.beneficiaryId}</strong></span>
          </div>
        </div>

        <div className="dossier-hero-right">
          <span className="dossier-amount-lbl">Total Billed</span>
          <div className="dossier-amount">{fmtCurrency(claim.claimAmount)}</div>
          <div className="dossier-deductible">Deductible: {fmtCurrency(claim.deductible)}</div>
        </div>
      </div>

      {/* 2x2 Structured Quadrant Grid */}
      <div className="dossier-grid">
        {/* Quadrant 1: Patient Information */}
        <div className="dossier-panel">
          <div className="dossier-panel-title">
            {ICONS.user}
            <span>Patient Information</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Beneficiary ID</span>
            <span className="dossier-v mono">{claim.beneficiaryId}</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Age</span>
            <span className="dossier-v">{claim.age} years</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Gender</span>
            <span className="dossier-v">{claim.gender}</span>
          </div>
        </div>

        {/* Quadrant 2: Provider & Coding */}
        <div className="dossier-panel">
          <div className="dossier-panel-title">
            {ICONS.hospital}
            <span>Provider & Clinical Coding</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Provider ID</span>
            <span className="dossier-v mono">{claim.providerId}</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">DRG Classification</span>
            <span className="dossier-v mono">{claim.drgCode}</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Claim Classification</span>
            <span className="dossier-v">{claim.claimType}</span>
          </div>
        </div>

        {/* Quadrant 3: Billing & Timeline */}
        <div className="dossier-panel">
          <div className="dossier-panel-title">
            {ICONS.calendar}
            <span>Billing & Timeline</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Admission / Start</span>
            <span className="dossier-v">{fmtDate(claim.claimStart)}</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Discharge / End</span>
            <span className="dossier-v">{fmtDate(claim.claimEnd)}</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Deductible Applied</span>
            <span className="dossier-v">{fmtCurrency(claim.deductible)}</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Stay Duration</span>
            <span className="chip-signal danger">
              {claim.duration} Day{claim.duration !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Quadrant 4: Activity & Fraud Signals */}
        <div className="dossier-panel">
          <div className="dossier-panel-title">
            {ICONS.activity}
            <span>Activity & Utilization</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Primary Diagnoses</span>
            <span className="dossier-v">{claim.diagCount} codes</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Procedures Recorded</span>
            <span className="dossier-v">{claim.procCount} procedures</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Attending Physicians</span>
            <span className="dossier-v">{claim.physicianCount} physicians</span>
          </div>
          <div className="dossier-row">
            <span className="dossier-k">Prior Claim History</span>
            <span className={`chip-signal ${isHighVelocity ? 'warning' : 'neutral'}`}>
              {claim.prevClaimCount} claims {isHighVelocity ? '(High Velocity)' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer / Action Bar */}
      {showAnalyzeButton && (
        <div className="dossier-footer">
          <div className="dossier-footer-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>All clinical and billing parameters verified. Ready for fraud risk analysis.</span>
          </div>

          <button
            className="btn-analyze-dossier"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            id="btn-analyze-claim"
          >
            {isAnalyzing ? (
              <>
                <span className="spinner" />
                <span>Analyzing claim...</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                <span>Analyze Claim</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Investigation({
  onAction,
  currentClaim,
  setCurrentClaim,
  currentAnalysis,
  setCurrentAnalysis,
  toast
}) {
  // Single state variable driving which page view renders
  const [analysisStatus, setAnalysisStatus] = useState(
    currentClaim ? (currentAnalysis ? 'complete' : 'loaded') : 'idle'
  );

  const [selectedClaimId, setSelectedClaimId] = useState(currentClaim?.claimId || MOCK_CLAIMS[0].claimId);
  const [loadedClaim, setLoadedClaim] = useState(currentClaim || null);
  const [analysisResult, setAnalysisResult] = useState(currentAnalysis || null);

  // Adjudication form state
  const [notes, setNotes] = useState('');
  const [isActioned, setIsActioned] = useState(false);

  // Results page topic tabs ('overview', 'shap', 'cases', 'rules')
  const [topicTab, setTopicTab] = useState('overview');

  // AI Assistant chat state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponses, setAiResponses] = useState([]);

  function handleAskAi(queryText) {
    const q = (queryText || aiQuestion).trim();
    if (!q || !loadedClaim) return;

    let answer = `Based on CMS billing history and regional peer records, provider ${loadedClaim.providerId} has an audit flag rate in the 94th percentile. For DRG ${loadedClaim.drgCode} inpatient admissions, their submission cost is 2.8x higher than regional peers with similar patient risk scores.`;
    if (q.toLowerCase().includes('state') || q.toLowerCase().includes('average') || q.toLowerCase().includes('cost')) {
      answer = `Regional peer benchmark for ${loadedClaim.drgCode} in this state is $9,200.00. This claim's billed charges of ${fmtCurrency(loadedClaim.claimAmount)} place it in the 94th percentile of all regional submissions.`;
    } else if (q.toLowerCase().includes('beneficiary') || q.toLowerCase().includes('overlapping') || q.toLowerCase().includes('duplicate') || q.toLowerCase().includes('claim')) {
      answer = `Beneficiary ${loadedClaim.beneficiaryId} has ${loadedClaim.prevClaimCount} prior claims on record. Cross-referencing against rolling 30-day windows identified overlapping procedure submissions within the same treatment interval.`;
    }

    setAiResponses((prev) => [...prev, { q, a: answer }]);
    setAiQuestion('');
  }

  // ── Step 1 Handler: Lookup Claim ─────────────────────────────
  function handleLookup() {
    const found = MOCK_CLAIMS.find(
      (c) => c.claimId.toLowerCase() === selectedClaimId.trim().toLowerCase()
    );
    if (found) {
      setLoadedClaim(found);
      setCurrentClaim(found);
      setAnalysisResult(null);
      setCurrentAnalysis(null);
      setIsActioned(false);
      setNotes('');
      setTopicTab('overview');
      setAiResponses([]);
      setAiQuestion('');
      // Transition to State 2 ('loaded')
      setAnalysisStatus('loaded');
      toast('info', 'Claim Loaded', `${found.claimId} details loaded. Review specifications and click "Analyze Claim".`);
    } else {
      toast('error', 'Claim Not Found', `No mock record found for ID: ${selectedClaimId}`);
    }
  }

  // ── Dropdown selection change: only updates selected ID; keeps current claim visible until Lookup ──
  function handleDropdownChange(claimId) {
    setSelectedClaimId(claimId);
  }

  // ── Step 3 Handler: Analyze Claim (1.5s full-page loading state) ─
  function handleAnalyze() {
    if (!loadedClaim) return;
    setAnalysisStatus('analyzing');

    setTimeout(() => {
      const result = getDeterministicAnalysis(loadedClaim);
      setAnalysisResult(result);
      setCurrentAnalysis(result);
      // Transition to State 4: Dedicated Results Page
      setAnalysisStatus('complete');
      toast(
        result.status === 'FLAGGED' ? 'warning' : 'success',
        'Analysis Complete',
        `Risk score: ${result.rawScore.toFixed(2)} (${result.level} RISK) — ${result.status}`
      );
    }, 1500);
  }

  // ── Step 5 Handler: Adjudication Decision ────────────────────
  function handleAdjudication(actionType) {
    if (!loadedClaim || !analysisResult) return;
    onAction(loadedClaim, analysisResult, actionType);
    setIsActioned(true);

    const labels = {
      ACCEPT: { type: 'success', title: 'Claim Approved', msg: `${loadedClaim.claimId} accepted and saved to history.` },
      HOLD:   { type: 'warning', title: 'Claim On Hold',  msg: `${loadedClaim.claimId} placed on hold and saved to history.` },
      REJECT: { type: 'error',   title: 'Fraud Confirmed', msg: `${loadedClaim.claimId} recorded as fraud and rejected.` },
    };
    const act = labels[actionType] || { type: 'info', title: 'Action Recorded', msg: 'Decision saved.' };
    toast(act.type, act.title, act.msg);

    // Return to the initial dropdown page ('idle')
    setTimeout(() => {
      setLoadedClaim(null);
      setCurrentClaim(null);
      setAnalysisResult(null);
      setCurrentAnalysis(null);
      setNotes('');
      setIsActioned(false);
      setTopicTab('overview');
      setAiResponses([]);
      setAnalysisStatus('idle');
    }, 400);
  }

  // ── RENDER VIEW 1: INITIAL & CLAIM DETAILS PAGES (idle, loaded, analyzing) ──
  if (analysisStatus !== 'complete') {
    return (
      <div className="page-inner">
        {/* Page Header */}
        <div className="page-header-row" style={{ marginBottom: '20px' }}>
          <div>
            <h1 className="page-title">Analyze Claim</h1>
            <p className="page-subtitle">Review and adjudicate flagged healthcare claims.</p>
          </div>
        </div>

        {/* State 3: Full Page Loading Spinner */}
        {analysisStatus === 'analyzing' ? (
          <div className="white-card surface-card" style={{ padding: '90px 24px', textAlign: 'center' }}>
            <div
              className="spinner"
              style={{
                width: '42px',
                height: '42px',
                borderWidth: '3.5px',
                borderColor: 'rgba(11, 19, 43, 0.15)',
                borderTopColor: '#0B132B',
                margin: '0 auto 20px',
              }}
            />
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Analyzing claim...
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '460px', margin: '0 auto' }}>
              Evaluating {loadedClaim?.claimId} against regional DRG benchmarks, provider fraud rates, and adversarial stability limits...
            </p>
          </div>
        ) : (
          <div className="investigation-workbench-wrap">
            {/* "Load Existing Claim" Selection Panel */}
            <div className="white-card surface-card">
              <div className="card-title-row">
                <h2 className="card-heading">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Load Existing Claim</span>
                </h2>
                <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                  {MOCK_CLAIMS.length} Claims Available
                </span>
              </div>

              <div className="form-field-group" style={{ marginBottom: 0 }}>
                <label className="cd-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Select Claim ID
                </label>
                <div className="lookup-form-row">
                  <select
                    className="form-select"
                    style={{ flex: 1, height: '40px', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                    value={selectedClaimId}
                    onChange={(e) => handleDropdownChange(e.target.value)}
                  >
                    {MOCK_CLAIMS.map((c) => (
                      <option key={c.claimId} value={c.claimId}>
                        {c.claimId}
                      </option>
                    ))}
                  </select>

                  <button className="btn-lookup" onClick={handleLookup} id="lookup-claim-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Lookup</span>
                  </button>
                </div>
              </div>
            </div>

            {/* State 1: Initial Empty-State Hint */}
            {analysisStatus === 'idle' && (
              <div className="white-card surface-card" style={{ textAlign: 'center', padding: '64px 24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  Select and load a claim to begin analysis
                </h3>
                <p style={{ color: '#64748B', fontSize: '13px', maxWidth: '420px', margin: '0 auto' }}>
                  Choose a claim from the dropdown above and click <strong>Lookup</strong> to review its full clinical specifics and run fraud risk detection.
                </p>
              </div>
            )}

            {/* State 2: Claim Loaded (Structured Executive Dossier + Analyze Claim Button) */}
            {analysisStatus === 'loaded' && loadedClaim && (
              <ClaimDetailsCard
                claim={loadedClaim}
                onAnalyze={handleAnalyze}
                isAnalyzing={false}
                showAnalyzeButton={true}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // ── RENDER VIEW 2: DEDICATED RESULTS PAGE (Sketch & Reference Style) ─────────
  const evaluatedRules = evaluateBusinessRules(loadedClaim);
  const triggeredCount = evaluatedRules.filter((r) => r.triggered).length;
  const shapFactors = getMockShapFactors(loadedClaim);
  const similarCases = getMockSimilarCases(loadedClaim);
  const aiSummary = getMockAiSummary(loadedClaim, analysisResult);

  const isFlagged = analysisResult.status === 'FLAGGED';
  const isHighRisk = analysisResult.level === 'HIGH' || analysisResult.level === 'VERY HIGH';
  const isSensitive = analysisResult.adversarial === 'SENSITIVE';

  return (
    <div className="page-inner">
      <div className="results-page-container">
        {/* Header Bar */}
        <div className="results-header-bar">
          <div>
            <button
              className="btn-back-link"
              onClick={() => setAnalysisStatus('loaded')}
              title="Return to Claim Details"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Analyze Claim</span>
            </button>
            <h1 className="page-title" style={{ fontSize: '24px', fontWeight: 800 }}>Claim Analysis Result</h1>
            <p className="page-subtitle" style={{ marginTop: '2px' }}>
              Detailed insight and explanations for Claim ID:{' '}
              <strong className="mono" style={{ color: '#0F172A' }}>{loadedClaim.claimId}</strong>
            </p>
          </div>

          <button
            className="btn-download-report"
            onClick={() => toast('info', 'Report Generation', `Downloading full audit dossier for ${loadedClaim.claimId}...`)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download Report</span>
          </button>
        </div>

        {/* ── 1. Top Three Summary Cards (Matching Screenshot Layout) ── */}
        <div className="results-top-three-cards">
          {/* Card 1: Fraud Score */}
          <div className="top-metric-card-visual">
            <div className="card-top-title-row">
              <div className={`card-top-icon-badge ${isHighRisk ? 'red' : 'green'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span className="card-top-label">Fraud Score</span>
            </div>

            <div className="card-top-metric-row">
              <span className={`card-top-big-number ${isHighRisk ? 'red' : 'green'}`}>{analysisResult.score}%</span>
              <span className={`card-top-risk-pill ${isHighRisk ? 'danger' : 'success'}`}>
                {isHighRisk ? 'High Risk' : 'Low Risk'}
              </span>
            </div>

            <div className="card-top-progress-track">
              <div
                className={`card-top-progress-fill ${isHighRisk ? 'danger' : 'success'}`}
                style={{ width: `${Math.min(100, Math.max(6, analysisResult.score))}%` }}
              />
            </div>
          </div>

          {/* Card 2: Final Decision */}
          <div className="top-metric-card-visual">
            <div className="card-top-title-row">
              <div className={`card-top-icon-badge ${isFlagged ? 'amber' : 'green'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className="card-top-label">Final Decision</span>
            </div>

            <div className="card-top-metric-row">
              <div className={`card-top-decision-text ${isFlagged ? 'red' : 'green'}`}>
                {isFlagged ? 'Flag for Investigation' : 'Approved / Clean'}
              </div>
            </div>

            <div className="card-top-subtext">
              {isFlagged ? 'Requires human review' : 'Eligible for expedited processing'}
            </div>
          </div>

          {/* Card 3: Adversarial Risk */}
          <div className="top-metric-card-visual">
            <div className="card-top-title-row">
              <div className={`card-top-icon-badge ${isSensitive ? 'red' : 'green'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                </svg>
              </div>
              <span className="card-top-label">Adversarial Risk</span>
            </div>

            <div className="card-top-metric-row">
              <div className={`card-top-decision-text ${isSensitive ? 'red' : 'green'}`} style={{ fontSize: '24px' }}>
                {isSensitive ? 'Sensitive' : 'Stable'}
              </div>
            </div>

            <div className="card-top-subtext">
              {isSensitive ? 'Easily manipulated near boundary' : 'Robust classification margin'}
            </div>
          </div>
        </div>

        {/* ── 2. Topics Tabbed Container (Toggle content) ── */}
        <div className="results-topics-container">
          {/* Tab Navigation Bar */}
          <div className="topics-tab-bar">
            <button
              className={`topic-tab-btn ${topicTab === 'overview' ? 'active' : ''}`}
              onClick={() => setTopicTab('overview')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Overview</span>
            </button>

            <button
              className={`topic-tab-btn ${topicTab === 'shap' ? 'active' : ''}`}
              onClick={() => setTopicTab('shap')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>
              <span>SHAP (Explainability)</span>
              <span className="tab-badge neutral">Preview</span>
            </button>

            <button
              className={`topic-tab-btn ${topicTab === 'cases' ? 'active' : ''}`}
              onClick={() => setTopicTab('cases')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
              <span>Past Cases (RAG)</span>
              <span className="tab-badge neutral">3 Matches</span>
            </button>

            <button
              className={`topic-tab-btn ${topicTab === 'rules' ? 'active' : ''}`}
              onClick={() => setTopicTab('rules')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Triggered Rules</span>
              <span className={`tab-badge ${triggeredCount > 0 ? 'danger' : 'neutral'}`}>
                {triggeredCount} {triggeredCount === 1 ? 'Rule' : 'Rules'}
              </span>
            </button>
          </div>

          {/* Tab Panel Content */}
          <div className="topic-content-panel">
            {/* TAB 1: OVERVIEW */}
            {topicTab === 'overview' && (
              <div>
                <div className="overview-summary-grid">
                  {/* Panel 1: Patient Information */}
                  <div className="overview-panel-box">
                    <div className="overview-panel-title">
                      {ICONS.user}
                      <span>Patient Information</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Patient / Beneficiary ID</span>
                      <span className="dossier-v mono">{loadedClaim.beneficiaryId}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Age & Gender</span>
                      <span className="dossier-v">{loadedClaim.gender}, {loadedClaim.age} yrs</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Date of Birth</span>
                      <span className="dossier-v">{loadedClaim.dob || '1958-04-12'}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Chronic Conditions</span>
                      <span className="dossier-v">{loadedClaim.chronicCount} conditions recorded</span>
                    </div>
                  </div>

                  {/* Panel 2: Provider Information */}
                  <div className="overview-panel-box">
                    <div className="overview-panel-title">
                      {ICONS.hospital}
                      <span>Provider & Facility</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Provider Facility ID</span>
                      <span className="dossier-v mono">{loadedClaim.providerId}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Care Classification</span>
                      <span className="dossier-v">{loadedClaim.claimType}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Attending Physicians</span>
                      <span className="dossier-v">{loadedClaim.physicianCount} physicians registered</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Prior Claim Submissions</span>
                      <span className="dossier-v">{loadedClaim.prevClaimCount} historical claims</span>
                    </div>
                  </div>

                  {/* Panel 3: Clinical & Diagnostic Coding */}
                  <div className="overview-panel-box">
                    <div className="overview-panel-title">
                      {ICONS.code}
                      <span>Clinical & Procedure Codes</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">DRG Classification</span>
                      <span className="dossier-v mono">{loadedClaim.drgCode}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Primary Procedures</span>
                      <span className="dossier-v mono">
                        {loadedClaim.procedureCodes?.join(', ') || 'CPT-99223, CPT-94002'}
                      </span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Diagnostic Codes (ICD-10)</span>
                      <span className="dossier-v" style={{ fontSize: '12px' }}>
                        {loadedClaim.diagnosisCodes?.slice(0, 2).join(', ') || 'I10 (HTN), E11.9 (DM)'}
                      </span>
                    </div>
                  </div>

                  {/* Panel 4: Financials & Timeline */}
                  <div className="overview-panel-box">
                    <div className="overview-panel-title">
                      {ICONS.dollar}
                      <span>Billing & Service Timeline</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Total Billed Charges</span>
                      <span className="dossier-v" style={{ fontSize: '15px', color: '#0F172A', fontWeight: 800 }}>
                        {fmtCurrency(loadedClaim.claimAmount)}
                      </span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Deductible Applied</span>
                      <span className="dossier-v">{fmtCurrency(loadedClaim.deductible)}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Service Window</span>
                      <span className="dossier-v">{fmtDate(loadedClaim.claimStart)} → {fmtDate(loadedClaim.claimEnd)}</span>
                    </div>
                    <div className="dossier-row">
                      <span className="dossier-k">Length of Stay</span>
                      <span className="chip-signal danger">{loadedClaim.duration} Days</span>
                    </div>
                  </div>
                </div>

                {/* Key Risk Indicators Strip */}
                <div className="overview-kpi-row">
                  <div className="kpi-mini-card">
                    <div className={`kpi-mini-icon ${isHighRisk ? 'danger' : analysisResult.score >= 40 ? 'warning' : 'success'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                        {getOrdinal(analysisResult.score)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        Risk Percentile
                      </div>
                    </div>
                  </div>

                  <div className="kpi-mini-card">
                    <div className={`kpi-mini-icon ${triggeredCount > 0 ? 'warning' : 'success'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{triggeredCount}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        Rules Triggered
                      </div>
                    </div>
                  </div>

                  <div className="kpi-mini-card">
                    <div className={`kpi-mini-icon ${isFlagged ? 'danger' : 'success'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                        {isFlagged ? 'Flagged' : 'Passed'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        Human Review
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SHAP EXPLAINABILITY (Matching Screenshot 1) */}
            {topicTab === 'shap' && (
              <div className="shap-tab-wrap">
                <div className="shap-header-row">
                  <div className="shap-header-left">
                    <div className="shap-blue-icon-badge">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                      </svg>
                    </div>
                    <h3 className="shap-title">Explainable Insight (SHAP)</h3>
                    <button
                      type="button"
                      className="shap-info-circle-btn"
                      title="Shapley Additive Explanations feature attribution"
                      onClick={() => toast('info', 'SHAP Explainability', 'Feature attribution values derived from cooperative game theory Shapley values.')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="shap-view-full-btn"
                    onClick={() => toast('info', 'SHAP Analysis', 'Opening full feature attribution waterfall and beeswarm plots.')}
                  >
                    View Full Explanation →
                  </button>
                </div>

                {/* Red Subtitle Heading from screenshot */}
                <div className="shap-factors-heading">
                  Top Factors Contributing to High Risk
                </div>

                <div className="shap-factors-list-visual">
                  {shapFactors.map((item) => (
                    <div key={item.id} className="shap-factor-row-visual">
                      <div className="shap-factor-red-icon-box">
                        {SHAP_ICONS[item.iconType] || SHAP_ICONS.amount}
                      </div>
                      <div className="shap-factor-content-box">
                        <div className="shap-factor-title-line">{item.factor}</div>
                        <div className="shap-factor-desc-line">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SIMILAR PAST CASES (RAG) */}
            {topicTab === 'cases' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Similar Past Cases (RAG)</h3>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Historical adjudicated claims retrieved via semantic vector similarity matching.
                    </p>
                  </div>
                  <span className="badge badge-gray" style={{ fontSize: '11px' }}>
                    Live Vector Database Coming Soon
                  </span>
                </div>

                <div className="past-cases-grid">
                  {similarCases.map((c, i) => (
                    <div key={i} className="past-case-card">
                      <div className="past-case-head">
                        <div>
                          <span className="past-case-id">{c.caseId}</span>
                          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                            {c.drg} · {c.procedure}
                          </div>
                        </div>
                        <span className="past-case-sim">{c.similarity}</span>
                      </div>

                      <div className="past-case-desc">{c.description}</div>

                      <div className="past-case-action">
                        <div style={{ fontWeight: 700, color: c.statusType === 'danger' ? '#DC2626' : '#16A34A', marginBottom: '2px' }}>
                          Outcome: {c.outcome}
                        </div>
                        <div>{c.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TRIGGERED BUSINESS RULES (IMAGE 3) */}
            {topicTab === 'rules' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Triggered Business Rules</h3>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Rule engine evaluation against institutional CMS fraud heuristics.
                    </p>
                  </div>
                  <span className={`badge ${triggeredCount > 0 ? 'badge-high' : 'badge-clean'}`} style={{ fontSize: '11px' }}>
                    {triggeredCount} {triggeredCount === 1 ? 'Rule' : 'Rules'} Triggered
                  </span>
                </div>

                <div className="rules-catalog-wrap">
                  <table className="rules-catalog-table">
                    <thead>
                      <tr>
                        <th style={{ width: '180px' }}>Rule</th>
                        <th>Logic</th>
                        <th>Claim Details</th>
                        <th style={{ width: '70px', textAlign: 'center' }}>Weight</th>
                        <th style={{ width: '100px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluatedRules.map((rule) => (
                        <tr key={rule.id} className={rule.triggered ? 'triggered' : undefined}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span className="rule-code-chip">{rule.id}</span>
                              <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{rule.name}</strong>
                            </div>
                          </td>
                          <td>
                            <code className="rule-logic-box">{rule.logic}</code>
                            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                              {rule.condition}
                            </div>
                          </td>
                          <td style={{ color: rule.triggered ? '#991B1B' : '#475569', fontWeight: rule.triggered ? 600 : 400 }}>
                            {rule.details}
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            {rule.weight.toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={`badge sm ${rule.triggered ? 'badge-high' : 'badge-clean'}`}>
                              {rule.triggered ? 'TRIGGERED' : 'PASSED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Static Card: AI Investigation Assistant ── */}
        <div className="ai-assistant-card">
          <div className="ai-assistant-head">
            <div className="ai-assistant-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1010 10H12V2z" />
                <path d="M12 12L2.5 7.5" />
                <path d="M12 12v9" />
              </svg>
              <span>AI Investigation Assistant</span>
            </div>
            <span className="badge badge-gray" style={{ fontSize: '11px' }}>
              LLM Case Narrative
            </span>
          </div>

          {/* AI Clinical Summary Narrative */}
          <div className="ai-narrative-text">
            {aiSummary}
          </div>

          {/* Recommendation Prompt Suggestions */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748B', marginBottom: '8px' }}>
              Recommended Investigation Queries:
            </div>
            <div className="ai-prompts-row">
              <button
                type="button"
                className="ai-prompt-chip"
                onClick={() => handleAskAi(`What is the historical billing pattern for provider ${loadedClaim.providerId}?`)}
              >
                🔍 Provider historical billing pattern?
              </button>
              <button
                type="button"
                className="ai-prompt-chip"
                onClick={() => handleAskAi(`How does DRG ${loadedClaim.drgCode} cost compare to regional average?`)}
              >
                📊 DRG {loadedClaim.drgCode} regional cost baseline?
              </button>
              <button
                type="button"
                className="ai-prompt-chip"
                onClick={() => handleAskAi(`Are there overlapping claims for beneficiary ${loadedClaim.beneficiaryId}?`)}
              >
                👥 Overlapping claims for beneficiary?
              </button>
            </div>
          </div>

          {/* Chat Response Stream (if user asked questions) */}
          {aiResponses.map((item, idx) => (
            <div key={idx} className="ai-response-box">
              <div style={{ fontWeight: 700, marginBottom: '3px' }}>Q: {item.q}</div>
              <div>{item.a}</div>
            </div>
          ))}

          {/* Interactive Chat Input */}
          <form
            className="ai-chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAi();
            }}
          >
            <input
              type="text"
              className="ai-chat-input"
              placeholder="Ask a follow-up question to investigate this claim..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
            />
            <button type="submit" className="btn-ai-send">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Ask AI</span>
            </button>
          </form>
        </div>

        {/* ── 4. Final Adjudication Bar (Notes on Left, Buttons on Right) ── */}
        <div className="adjudication-bar-card">
          <div className="adjudication-notes-wrap">
            <input
              type="text"
              className="adjudication-notes-input"
              placeholder="Add your notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="adjudication-buttons-wrap">
            <button
              className="btn-adj-action accept"
              onClick={() => handleAdjudication('ACCEPT')}
              disabled={isActioned}
              id="btn-adjudicate-accept"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Accept (Valid Claim)</span>
            </button>

            <button
              className="btn-adj-action reject"
              onClick={() => handleAdjudication('REJECT')}
              disabled={isActioned}
              id="btn-adjudicate-reject"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Reject (Fraudulent Claim)</span>
            </button>

            <button
              className="btn-adj-action hold"
              onClick={() => handleAdjudication('HOLD')}
              disabled={isActioned}
              id="btn-adjudicate-hold"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Hold (Needs More Review)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
