// src/pages/Dashboard.jsx
import { useEffect, useRef } from 'react';
import { DASH_STATS, levelClass, scoreColor } from '../data/mockData';
import { DonutChart, BarChart, LineChart, HorizBar } from '../components/charts/Charts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ label, value, icon, color, delta, deltaDesc, colorClass }) => (
  <div className={`stat-card c-${colorClass}`}>
    <div className="stat-card-top">
      <span className="stat-label">{label}</span>
      <div className={`stat-icon-wrap ${color}`}>{icon}</div>
    </div>
    <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    <div className="stat-footer">
      {delta && <span className={`stat-delta ${delta.startsWith('+') || delta.startsWith('↑') ? 'up' : 'down'}`}>{delta}</span>}
      {deltaDesc && <span className="stat-delta-desc">{deltaDesc}</span>}
    </div>
  </div>
);

export default function Dashboard({ history, onNav }) {
  const S = DASH_STATS;

  // Animate adv bars
  const stableRef   = useRef();
  const sensRef     = useRef();
  useEffect(() => {
    const t = setTimeout(() => {
      if (stableRef.current) stableRef.current.style.width = S.adversarialStable ?? S.stable / (S.stable + S.sensitive) * 100 + '%';
      if (sensRef.current)   sensRef.current.style.width   = S.adversarialSensitive ?? S.sensitive / (S.stable + S.sensitive) * 100 + '%';
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const stablePct   = Math.round(S.stable / (S.stable + S.sensitive) * 100);
  const sensitivePct= 100 - stablePct;
  const recent = [...history].filter(h => h.action !== 'HOLD' || h.resolvedAt).slice(0, 6);

  return (
    <div className="page-inner page-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Overview</div>
          <h1 className="page-title">Claims Intelligence Dashboard</h1>
          <p className="page-desc">Real-time overview of fraud investigation activity — Q3 2026</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary sm" onClick={() => alert('Report export not yet available.')}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-row">
        <StatCard label="Total Analysed" value={S.total} colorClass="blue" color="blue"
          delta="↑ 12.4%" deltaDesc="vs last quarter"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>} />
        <StatCard label="Flagged Claims" value={S.flagged} colorClass="red" color="red"
          delta={`↑ ${((S.flagged/S.total)*100).toFixed(1)}%`} deltaDesc="fraud rate"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        <StatCard label="Not Flagged" value={S.clean} colorClass="green" color="green"
          delta="↑ 8.1%" deltaDesc="vs last quarter"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="On Hold" value={S.onHold} colorClass="amber" color="amber"
          deltaDesc={`${((S.onHold/S.total)*100).toFixed(1)}% pending resolution`}
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>} />
        <StatCard label="High / Very High Risk" value={S.highVeryHigh} colorClass="orange" color="orange"
          delta="↑ 6.7%" deltaDesc="priority cases"
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>} />
        <StatCard label="Sensitive (Adversarial)" value={S.sensitive} colorClass="purple" color="purple"
          deltaDesc={`${S.stable.toLocaleString()} stable`}
          icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
      </div>

      {/* Charts row 1 */}
      <div className="chart-grid">
        <div className="chart-card cg-5">
          <div className="chart-head">
            <div>
              <div className="chart-title">Risk Distribution</div>
              <div className="chart-subtitle">All claims by risk level</div>
            </div>
            <div className="chart-legend">
              {[['#16A34A','LOW'],['#D97706','MED'],['#EA580C','HIGH'],['#DC2626','V.HIGH']].map(([c,l])=>(
                <div key={l} className="legend-item"><span className="legend-dot" style={{background:c}}/>{l}</div>
              ))}
            </div>
          </div>
          <DonutChart data={S.riskDist} total={S.total} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginTop:'14px'}}>
            {[{l:'LOW',pct:S.riskDist.LOW,c:'#16A34A'},{l:'MEDIUM',pct:S.riskDist.MEDIUM,c:'#D97706'},{l:'HIGH',pct:S.riskDist.HIGH,c:'#EA580C'},{l:'VERY HIGH',pct:S.riskDist.VERY_HIGH,c:'#DC2626'}].map(d=>(
              <div key={d.l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 10px',background:'#F9FAFB',borderRadius:'7px',border:'1px solid #F3F4F6'}}>
                <span style={{fontSize:'11px',fontWeight:600,color:d.c}}>{d.l}</span>
                <span style={{fontSize:'13px',fontWeight:700,color:'#111827'}}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card cg-7">
          <div className="chart-head">
            <div>
              <div className="chart-title">Flagged Claims Trend</div>
              <div className="chart-subtitle">Monthly count — Jan to Dec 2024</div>
            </div>
            <div className="chart-legend">
              <div className="legend-item"><span className="legend-dot" style={{background:'#4F46E5'}}/> Total</div>
              <div className="legend-item"><span className="legend-dot" style={{background:'#DC2626'}}/> Flagged</div>
            </div>
          </div>
          <BarChart
            labels={MONTHS}
            values={S.monthFlagged}
            colorFn={(i,v) => {
              const r = v / S.monthTotal[i];
              if (r > 0.4) return '#DC2626';
              if (r > 0.3) return '#EA580C';
              return '#4F46E5';
            }}
          />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="chart-grid">
        <div className="chart-card cg-7">
          <div className="chart-head">
            <div>
              <div className="chart-title">Fraud Detection Over Time</div>
              <div className="chart-subtitle">Flagged vs total claims per month</div>
            </div>
          </div>
          <LineChart
            labels={MONTHS}
            datasets={[
              { values: S.monthTotal,   color: '#4F46E5' },
              { values: S.monthFlagged, color: '#DC2626' },
            ]}
          />
        </div>

        <div className="chart-card cg-5">
          <div className="chart-head">
            <div>
              <div className="chart-title">Investigation Decisions</div>
              <div className="chart-subtitle">Action distribution</div>
            </div>
          </div>
          <div style={{marginTop:'10px'}}>
            <HorizBar items={[
              {label:'Accept', value: S.accepted, color:'#16A34A'},
              {label:'Hold',   value: S.held,     color:'#D97706'},
              {label:'Reject', value: S.rejected,  color:'#DC2626'},
            ]} />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="chart-grid">
        <div className="chart-card cg-4">
          <div className="chart-head">
            <div>
              <div className="chart-title">Adversarial Stability</div>
              <div className="chart-subtitle">Model robustness breakdown</div>
            </div>
          </div>
          <div className="adv-bars" style={{paddingTop:'8px'}}>
            <div className="adv-row">
              <div className="adv-labels">
                <span style={{color:'#6B7280',fontWeight:500}}>Stable Claims</span>
                <span style={{color:'#111827',fontWeight:600}}>{S.stable.toLocaleString()} ({stablePct}%)</span>
              </div>
              <div className="adv-track">
                <div className="adv-fill" ref={stableRef} style={{width:'0%',background:'#4F46E5'}} />
              </div>
            </div>
            <div className="adv-row">
              <div className="adv-labels">
                <span style={{color:'#6B7280',fontWeight:500}}>Sensitive Claims</span>
                <span style={{color:'#111827',fontWeight:600}}>{S.sensitive.toLocaleString()} ({sensitivePct}%)</span>
              </div>
              <div className="adv-track">
                <div className="adv-fill" ref={sensRef} style={{width:'0%',background:'#D97706'}} />
              </div>
            </div>
          </div>
          <div style={{marginTop:'18px',display:'flex',flexDirection:'column',gap:'8px'}}>
            <div className="section-label">Quick Breakdown</div>
            {[
              {label:'Claims Accepted', val:S.accepted, color:'#16A34A'},
              {label:'Claims Rejected', val:S.rejected,  color:'#DC2626'},
              {label:'Pending (Hold)',  val:S.held,      color:'#D97706'},
            ].map(it=>(
              <div key={it.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',background:'#F9FAFB',borderRadius:'8px',border:'1px solid #F3F4F6'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{width:'8px',height:'8px',borderRadius:'50%',background:it.color,display:'block'}} />
                  <span style={{fontSize:'12px',color:'#6B7280',fontWeight:500}}>{it.label}</span>
                </div>
                <span style={{fontSize:'14px',fontWeight:700,color:'#111827'}}>{it.val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card cg-8">
          <div className="chart-head">
            <div>
              <div className="chart-title">Recent Investigations</div>
              <div className="chart-subtitle">Latest completed decisions</div>
            </div>
            <button className="btn btn-ghost sm" onClick={()=>onNav('history')}>View All →</button>
          </div>
          <div className="table-wrap" style={{border:'none',borderRadius:0,boxShadow:'none'}}>
            <table>
              <thead>
                <tr>
                  <th>Claim ID</th><th>Score</th><th>Risk Level</th>
                  <th>Status</th><th>Decision</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr><td colSpan={6} style={{textAlign:'center',color:'#9CA3AF',padding:'24px'}}>No resolved investigations yet</td></tr>
                ) : recent.map(h => {
                  const finalAction = h.resolvedAt ? h.resolvedAction : h.action;
                  return (
                    <tr key={h.id}>
                      <td className="td-mono">{h.claimId}</td>
                      <td style={{fontWeight:700}}>{h.score}%</td>
                      <td><span className={`badge sm ${levelClass(h.level)}`}>{h.level}</span></td>
                      <td><span className={`badge sm ${h.status==='FLAGGED'?'badge-flagged':'badge-clean'}`}>{h.status}</span></td>
                      <td><span className={`badge sm badge-${finalAction?.toLowerCase()}`}>{finalAction}</span></td>
                      <td className="td-dim td-sm">{new Date(h.ts).toLocaleDateString('en-US',{month:'short',day:'2-digit'})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
