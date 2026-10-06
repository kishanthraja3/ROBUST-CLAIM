// src/pages/Account.jsx
import { useState } from 'react';
import { MOCK_USER, fmtDate, fmtTs } from '../data/mockData';

function InfoRow({ icon, label, value }) {
  return (
    <div className="pinfo-row">
      <span className="pinfo-icon">{icon}</span>
      <span className="pinfo-label">{label}</span>
      <span className="pinfo-val">{value}</span>
    </div>
  );
}

function SectionCard({ title, iconBg, iconColor, icon, children, action }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-title-icon" style={{background:iconBg,color:iconColor}}>{icon}</span>
          {title}
        </div>
        {action}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function Account({ history, toast }) {
  const [modal, setModal] = useState(null);
  const holdCount = history.filter(h=>h.action==='HOLD'&&!h.resolvedAt).length;

  const ModalEl = () => {
    if (!modal) return null;
    const configs = {
      password: {
        title: 'Change Password',
        body: (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {['Current Password','New Password','Confirm New Password'].map(l=>(
              <div className="form-group" key={l}>
                <label className="form-label">{l}</label>
                <input className="form-input" type="password" placeholder={l==='New Password'?'Min. 12 characters':''} />
              </div>
            ))}
            <p style={{fontSize:'12px',color:'#6B7280',background:'#EFF6FF',padding:'10px 12px',borderRadius:'7px',border:'1px solid #BFDBFE',lineHeight:'1.7'}}>
              Must be ≥ 12 characters with uppercase, numbers, and a special character.
            </p>
          </div>
        ),
        okLabel:'Update Password', okCls:'btn-primary',
        onOk:()=>{ setModal(null); toast('success','Password Updated','Your password has been changed.'); },
      },
      reset: {
        title:'Reset Password',
        body:(
          <>
            <p>A reset link will be sent to:</p>
            <p style={{margin:'10px 0',padding:'10px 14px',background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:'7px',fontFamily:'monospace',fontSize:'12.5px'}}>{MOCK_USER.email}</p>
            <p style={{fontSize:'12.5px',color:'#9CA3AF'}}>Reset link expires in 30 minutes.</p>
          </>
        ),
        okLabel:'Send Reset Link', okCls:'btn-primary',
        onOk:()=>{ setModal(null); toast('info','Reset Email Sent','Password reset link sent.'); },
      },
      logout:{
        title:'Confirm Logout',
        body:(
          <>
            <p>Are you sure you want to end your investigation session?</p>
            {holdCount>0 && <p style={{marginTop:'8px',fontSize:'12.5px',color:'#D97706',fontWeight:500}}>{holdCount} claim(s) currently on hold will remain in the system.</p>}
          </>
        ),
        okLabel:'Log Out', okCls:'btn-danger',
        onOk:()=>{ setModal(null); toast('warning','Logged Out','Session ended. Refresh to restart.'); },
      },
    };
    const cfg = configs[modal];
    return (
      <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">{cfg.title}</div>
            <button className="modal-close" onClick={()=>setModal(null)}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="modal-body">{cfg.body}</div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
            <button className={`btn ${cfg.okCls}`} onClick={cfg.onOk}>{cfg.okLabel}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-inner page-fade">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Profile & Settings</div>
          <h1 className="page-title">Account</h1>
          <p className="page-desc">Manage your investigator profile, credentials, and preferences.</p>
        </div>
      </div>

      <div className="account-layout">
        {/* ── Left: Profile Card ── */}
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div className="profile-card">
            <div className="profile-hero">
              <div className="profile-ava">{MOCK_USER.initials}</div>
              <div className="profile-name">{MOCK_USER.name}</div>
              <div className="profile-role">{MOCK_USER.role}</div>
              <div className="profile-badges">
                <span className="badge sm badge-brand">Active</span>
                <span className="badge sm badge-stable">2FA On</span>
              </div>
            </div>
            <div className="profile-info-list">
              <InfoRow
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                label="Email" value={MOCK_USER.email}
              />
              <InfoRow
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
                label="Dept." value={MOCK_USER.department}
              />
              <InfoRow
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="EMP ID" value={MOCK_USER.employeeId}
              />
              <InfoRow
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="Joined" value={fmtDate(MOCK_USER.joined)}
              />
              <InfoRow
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                label="Last Login" value={fmtTs(MOCK_USER.lastLogin)}
              />
            </div>
          </div>

          {/* Activity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Session Activity</div>
            </div>
            <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {label:'Claims Reviewed (All Time)', val:MOCK_USER.reviewedTotal.toLocaleString()},
                {label:'Holds Pending',              val:holdCount},
              ].map(it=>(
                <div key={it.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'12.5px',color:'#6B7280'}}>{it.label}</span>
                  <span style={{fontSize:'15px',fontWeight:700,color:'#111827'}}>{it.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Settings ── */}
        <div className="settings-col">
          {/* Profile info */}
          <SectionCard
            title="Profile Information"
            iconBg="#EFF6FF" iconColor="#2563EB"
            action={<button className="btn btn-secondary sm" onClick={()=>toast('info','Edit Profile','Profile editing will be available in the next release.')}>Edit</button>}
            icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          >
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {[
                ['Full Name',    MOCK_USER.name],
                ['Employee ID', MOCK_USER.employeeId],
                ['Email',       MOCK_USER.email],
                ['Role',        MOCK_USER.role],
                ['Institution', MOCK_USER.institution],
                ['Department',  MOCK_USER.department],
              ].map(([l,v])=>(
                <div className="form-group" key={l}>
                  <label className="form-label">{l}</label>
                  <input className="form-input" defaultValue={v} readOnly />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Security */}
          <SectionCard
            title="Security & Access"
            iconBg="#FEF2F2" iconColor="#DC2626"
            icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          >
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                {label:'Two-Factor Authentication', desc:'Extra layer of login security', badge:<span className="badge sm badge-brand">Enabled</span>},
                {label:'Investigation Alerts',      desc:'Receive alerts for high-risk flags', badge:<span className="badge sm badge-brand">On</span>},
              ].map(it=>(
                <div key={it.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'#F9FAFB',borderRadius:'8px',border:'1px solid #F3F4F6'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{it.label}</div>
                    <div style={{fontSize:'11.5px',color:'#9CA3AF',marginTop:'2px'}}>{it.desc}</div>
                  </div>
                  {it.badge}
                </div>
              ))}
              <div style={{display:'flex',gap:'10px',paddingTop:'6px'}}>
                <button className="btn btn-secondary" style={{flex:1}} onClick={()=>setModal('password')}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Change Password
                </button>
                <button className="btn btn-secondary" style={{flex:1}} onClick={()=>setModal('reset')}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>
                  Reset Password
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Preferences */}
          <SectionCard
            title="System Preferences"
            iconBg="#FFFBEB" iconColor="#D97706"
            icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>}
          >
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {[
                ['Theme',               'Light Mode'],
                ['Language',            'English (US)'],
                ['Time Zone',           'IST (UTC+5:30)'],
                ['Risk Alert Threshold','≥ MEDIUM'],
              ].map(([l,v])=>(
                <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#F9FAFB',borderRadius:'8px',border:'1px solid #F3F4F6'}}>
                  <span style={{fontSize:'12.5px',color:'#6B7280',fontWeight:500}}>{l}</span>
                  <span className="badge sm badge-gray">{v}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Danger zone */}
          <div className="card" style={{borderColor:'#FECACA'}}>
            <div className="card-header">
              <div className="card-title" style={{color:'#DC2626'}}>
                <span className="card-title-icon" style={{background:'#FEF2F2',color:'#DC2626'}}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                Session & Account
              </div>
            </div>
            <div className="card-body">
              <p style={{fontSize:'12.5px',color:'#6B7280',lineHeight:'1.7',marginBottom:'14px'}}>
                Logging out will end your current investigation session. All unsaved analysis results will be lost.
                {holdCount > 0 && <strong style={{color:'#D97706'}}> You have {holdCount} pending hold(s).</strong>}
              </p>
              <button className="btn btn-danger" onClick={()=>setModal('logout')}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log Out of Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalEl />
    </div>
  );
}
