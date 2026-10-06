// src/data/mockData.js
// ── 10 Realistic Mock Claims with deterministic scoring for RoBust-Claim

export const MOCK_CLAIMS = [
  {
    claimId: "CLM-90210-FX88",
    beneficiaryId: "BEN-10992-ZZ",
    providerId: "PRV-404-X",
    age: 68,
    dob: "1958-04-12",
    gender: "Male",
    drgCode: "DRG-470",
    claimType: "Inpatient",
    claimStart: "2023-10-12",
    claimEnd: "2023-10-24",
    claimAmount: 42850.00,
    deductible: 1200.00,
    diagCount: 3,
    procCount: 3,
    physicianCount: 2,
    duration: 12,
    chronicCount: 4,
    annualReimbursed: 18450.00,
    prevClaimCount: 6,
    diagnosisCodes: ["I10 (Hypertension)", "E11.9 (Type 2 Diabetes)", "J18.9 (Pneumonia)"],
    procedureCodes: ["CPT-99223", "CPT-94002", "CPT-71045"],
    physicians: ["PHY-8821", "PHY-4190"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "3.2x", highlight: "danger" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "14% (98th Pctl)", highlight: "danger" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [
      { id: "R1", name: "Cost Outlier", delta: "+0.35", desc: "Billed amount exceeds 99th percentile for identical DRG." },
      { id: "R2", name: "Excessive Duration", delta: "+0.22", desc: "Length of stay is 3.5x higher than typical stay for diagnosed condition." },
      { id: "R3", name: "Unusual Billing Velocity", delta: "+0.15", desc: "Multiple claims submitted within 48h timeframe from same facility." }
    ],
    recommendation: "Claim requires priority investigation due to extreme cost anomaly and high provider risk."
  },
  {
    claimId: "CLM-2024-0047",
    beneficiaryId: "BNF-883421",
    providerId: "PRV-10203",
    age: 72,
    dob: "1952-03-18",
    gender: "Male",
    drgCode: "DRG-470",
    claimType: "Inpatient",
    claimStart: "2024-01-08",
    claimEnd: "2024-01-15",
    claimAmount: 18450.00,
    deductible: 1340.00,
    diagCount: 2,
    procCount: 2,
    physicianCount: 2,
    duration: 7,
    chronicCount: 3,
    annualReimbursed: 9200.00,
    prevClaimCount: 12,
    diagnosisCodes: ["I25.10 (CAD)", "E11.9 (Type 2 Diabetes)"],
    procedureCodes: ["CPT-99222", "CPT-93000"],
    physicians: ["PHY-1049"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "1.8x", highlight: "warning" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "8% (75th Pctl)", highlight: "warning" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [
      { id: "R1", name: "Duplicate Procedure Billing", delta: "+0.28", desc: "Duplicate ECG codes filed across 3 consecutive days." },
      { id: "R2", name: "Cost Above Median", delta: "+0.18", desc: "Billed charges exceed standard regional DRG benchmark." }
    ],
    recommendation: "Review physician documentation for redundant ECG claims."
  },
  {
    claimId: "CLM-2024-0051",
    beneficiaryId: "BNF-774902",
    providerId: "PRV-30581",
    age: 58,
    dob: "1966-07-22",
    gender: "Female",
    drgCode: "DRG-194",
    claimType: "Outpatient",
    claimStart: "2024-01-20",
    claimEnd: "2024-01-20",
    claimAmount: 3820.50,
    deductible: 250.00,
    diagCount: 2,
    procCount: 1,
    physicianCount: 1,
    duration: 0,
    chronicCount: 1,
    annualReimbursed: 3820.50,
    prevClaimCount: 3,
    diagnosisCodes: ["M54.5 (Low back pain)", "R51 (Headache)"],
    procedureCodes: ["CPT-99213"],
    physicians: ["PHY-3012"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "0.95x", highlight: "success" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "1.2% (12th Pctl)", highlight: "success" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [],
    recommendation: "Routine outpatient visit. No anomaly detected."
  },
  {
    claimId: "CLM-2024-0068",
    beneficiaryId: "BNF-669034",
    providerId: "PRV-29847",
    age: 83,
    dob: "1941-11-05",
    gender: "Female",
    drgCode: "DRG-871",
    claimType: "Inpatient",
    claimStart: "2024-02-03",
    claimEnd: "2024-02-14",
    claimAmount: 52340.00,
    deductible: 2200.00,
    diagCount: 4,
    procCount: 3,
    physicianCount: 4,
    duration: 11,
    chronicCount: 5,
    annualReimbursed: 41200.00,
    prevClaimCount: 27,
    diagnosisCodes: ["A41.9 (Sepsis)", "N39.0 (UTI)", "I10 (Hypertension)", "J44.9 (COPD)"],
    procedureCodes: ["CPT-99291", "CPT-36556", "CPT-94002"],
    physicians: ["PHY-7712", "PHY-9041"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "2.9x", highlight: "danger" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "11% (92nd Pctl)", highlight: "danger" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Partial", highlight: "warning" }
    ],
    rules: [
      { id: "R1", name: "Sepsis DRG Upcoding", delta: "+0.41", desc: "Severe sepsis DRG mapped without documented organ dysfunction." },
      { id: "R2", name: "Overlapping Provider Claims", delta: "+0.25", desc: "Attending physician billed for concurrent surgical shifts." }
    ],
    recommendation: "High suspicion of DRG upcoding. Request full clinical chart audit."
  },
  {
    claimId: "CLM-2024-0089",
    beneficiaryId: "BNF-512388",
    providerId: "PRV-10203",
    age: 45,
    dob: "1979-04-30",
    gender: "Male",
    drgCode: "DRG-039",
    claimType: "Inpatient",
    claimStart: "2024-02-19",
    claimEnd: "2024-02-22",
    claimAmount: 9760.00,
    deductible: 800.00,
    diagCount: 1,
    procCount: 1,
    physicianCount: 2,
    duration: 3,
    chronicCount: 0,
    annualReimbursed: 9760.00,
    prevClaimCount: 1,
    diagnosisCodes: ["K35.80 (Acute appendicitis)"],
    procedureCodes: ["CPT-44970"],
    physicians: ["PHY-1049"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "1.1x", highlight: "success" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "4.5% (40th Pctl)", highlight: "success" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [
      { id: "R1", name: "Minor Anomaly", delta: "+0.12", desc: "Slightly elevated supply charge compared to hospital baseline." }
    ],
    recommendation: "Standard laparoscopic appendectomy. Claim within acceptable parameters."
  },
  {
    claimId: "CLM-2024-0103",
    beneficiaryId: "BNF-923710",
    providerId: "PRV-58821",
    age: 67,
    dob: "1957-09-14",
    gender: "Female",
    drgCode: "DRG-291",
    claimType: "Outpatient",
    claimStart: "2024-03-05",
    claimEnd: "2024-03-05",
    claimAmount: 6100.00,
    deductible: 400.00,
    diagCount: 4,
    procCount: 2,
    physicianCount: 1,
    duration: 0,
    chronicCount: 2,
    annualReimbursed: 6100.00,
    prevClaimCount: 9,
    diagnosisCodes: ["E11.65 (Type 2 diabetes with hyperglycemia)", "I10 (Hypertension)"],
    procedureCodes: ["CPT-99214", "CPT-80053"],
    physicians: ["PHY-5881"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "1.02x", highlight: "success" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "2.1% (20th Pctl)", highlight: "success" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [],
    recommendation: "Routine diabetes management and metabolic panel. Approved."
  },
  {
    claimId: "CLM-2024-0117",
    beneficiaryId: "BNF-340129",
    providerId: "PRV-44032",
    age: 79,
    dob: "1945-01-28",
    gender: "Male",
    drgCode: "DRG-682",
    claimType: "Inpatient",
    claimStart: "2024-03-11",
    claimEnd: "2024-03-25",
    claimAmount: 74200.00,
    deductible: 3100.00,
    diagCount: 3,
    procCount: 3,
    physicianCount: 5,
    duration: 14,
    chronicCount: 6,
    annualReimbursed: 68900.00,
    prevClaimCount: 31,
    diagnosisCodes: ["I50.9 (Heart failure)", "I10 (Hypertension)", "N18.3 (CKD Stage 3)"],
    procedureCodes: ["CPT-93458", "CPT-99233", "CPT-36556"],
    physicians: ["PHY-4401", "PHY-5520"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "3.8x", highlight: "danger" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "18% (99th Pctl)", highlight: "danger" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Mismatch", highlight: "danger" }
    ],
    rules: [
      { id: "R1", name: "Severe Phantom Billing", delta: "+0.45", desc: "Catheterization supplies billed 4x without matched imaging notes." },
      { id: "R2", name: "Extended Stay Anomaly", delta: "+0.30", desc: "Length of stay exceeds peer group 95th percentile by 8 days." }
    ],
    recommendation: "Immediate freeze and escalate to Special Investigations Unit (SIU)."
  },
  {
    claimId: "CLM-2024-0134",
    beneficiaryId: "BNF-781002",
    providerId: "PRV-30581",
    age: 53,
    dob: "1971-06-09",
    gender: "Female",
    drgCode: "DRG-145",
    claimType: "Outpatient",
    claimStart: "2024-03-28",
    claimEnd: "2024-03-28",
    claimAmount: 2950.00,
    deductible: 175.00,
    diagCount: 2,
    procCount: 1,
    physicianCount: 1,
    duration: 0,
    chronicCount: 0,
    annualReimbursed: 2950.00,
    prevClaimCount: 0,
    diagnosisCodes: ["J02.9 (Acute pharyngitis)", "R05 (Cough)"],
    procedureCodes: ["CPT-99213"],
    physicians: ["PHY-3058"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "0.91x", highlight: "success" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "1.4% (15th Pctl)", highlight: "success" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [],
    recommendation: "Low-risk acute outpatient claim. Passed automated check."
  },
  {
    claimId: "CLM-2024-0158",
    beneficiaryId: "BNF-455671",
    providerId: "PRV-77109",
    age: 61,
    dob: "1963-12-03",
    gender: "Male",
    drgCode: "DRG-312",
    claimType: "Inpatient",
    claimStart: "2024-04-07",
    claimEnd: "2024-04-12",
    claimAmount: 28900.00,
    deductible: 1750.00,
    diagCount: 6,
    procCount: 4,
    physicianCount: 3,
    duration: 5,
    chronicCount: 3,
    annualReimbursed: 19400.00,
    prevClaimCount: 7,
    diagnosisCodes: ["I21.0 (STEMI)", "I25.10 (CAD)", "E78.5 (Hyperlipidemia)"],
    procedureCodes: ["CPT-92928", "CPT-93010"],
    physicians: ["PHY-7711", "PHY-7715"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "1.9x", highlight: "warning" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "9.2% (80th Pctl)", highlight: "warning" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Match", highlight: "success" }
    ],
    rules: [
      { id: "R1", name: "Stent Material Markup", delta: "+0.24", desc: "Coronary drug-eluting stent billed at 180% of wholesale benchmark." },
      { id: "R2", name: "Aftercare Coding Spike", delta: "+0.16", desc: "Unbundled post-procedural monitoring billed separately." }
    ],
    recommendation: "Reimburse standard cardiac intervention, hold device markup portion for audit."
  },
  {
    claimId: "CLM-2024-0172",
    beneficiaryId: "BNF-632094",
    providerId: "PRV-44032",
    age: 88,
    dob: "1936-08-17",
    gender: "Female",
    drgCode: "DRG-552",
    claimType: "Inpatient",
    claimStart: "2024-04-22",
    claimEnd: "2024-05-06",
    claimAmount: 93500.00,
    deductible: 4200.00,
    diagCount: 11,
    procCount: 9,
    physicianCount: 6,
    duration: 14,
    chronicCount: 7,
    annualReimbursed: 87400.00,
    prevClaimCount: 44,
    diagnosisCodes: ["S72.001A (Femur fracture)", "I10 (Hypertension)", "E11.9 (Diabetes)", "I48.91 (A-fib)"],
    procedureCodes: ["CPT-27244", "CPT-99291", "CPT-00400", "CPT-73502"],
    physicians: ["PHY-4401", "PHY-4408", "PHY-9012"],
    intelligence: [
      { category: "Peer/Cost Analysis", metric: "Cost to Peer Avg Ratio", value: "4.1x", highlight: "danger" },
      { category: "Provider History", metric: "Historical Fraud Flag Rate", value: "22% (99.8th Pctl)", highlight: "danger" },
      { category: "Patient History", metric: "Chronic Condition Consistency", value: "Partial", highlight: "warning" }
    ],
    rules: [
      { id: "R1", name: "Extensive Hardware Phantom Charge", delta: "+0.48", desc: "Specialty surgical implants billed with fabricated lot identifiers." },
      { id: "R2", name: "Double Rehabilitation Surcharge", delta: "+0.32", desc: "Concurrent physical therapy claims submitted for dates patient was in ICU." }
    ],
    recommendation: "Critical anomaly detected. Freeze provider payouts and refer to Federal Inspector General."
  }
];

// Deterministic Analysis lookup: Every claim produces the exact same reliable output
export const MOCK_ANALYSIS = {
  "CLM-90210-FX88": { score: 82, rawScore: 0.82, level: "VERY HIGH", status: "FLAGGED",     adversarial: "SENSITIVE" },
  "CLM-2024-0047": { score: 72, rawScore: 0.72, level: "HIGH",      status: "FLAGGED",     adversarial: "SENSITIVE" },
  "CLM-2024-0051": { score: 18, rawScore: 0.18, level: "LOW",       status: "NOT FLAGGED", adversarial: "STABLE"    },
  "CLM-2024-0068": { score: 87, rawScore: 0.87, level: "VERY HIGH", status: "FLAGGED",     adversarial: "SENSITIVE" },
  "CLM-2024-0089": { score: 38, rawScore: 0.38, level: "MEDIUM",    status: "FLAGGED",     adversarial: "STABLE"    },
  "CLM-2024-0103": { score: 12, rawScore: 0.12, level: "LOW",       status: "NOT FLAGGED", adversarial: "STABLE"    },
  "CLM-2024-0117": { score: 91, rawScore: 0.91, level: "VERY HIGH", status: "FLAGGED",     adversarial: "SENSITIVE" },
  "CLM-2024-0134": { score: 22, rawScore: 0.22, level: "LOW",       status: "NOT FLAGGED", adversarial: "STABLE"    },
  "CLM-2024-0158": { score: 64, rawScore: 0.64, level: "HIGH",      status: "FLAGGED",     adversarial: "SENSITIVE" },
  "CLM-2024-0172": { score: 96, rawScore: 0.96, level: "VERY HIGH", status: "FLAGGED",     adversarial: "SENSITIVE" },
};

export function getDeterministicAnalysis(claim) {
  if (!claim) return null;
  if (MOCK_ANALYSIS[claim.claimId]) {
    return MOCK_ANALYSIS[claim.claimId];
  }
  // Fallback deterministic calculation based on claimId
  let hash = 0;
  for (let i = 0; i < claim.claimId.length; i++) {
    hash = (hash * 31 + claim.claimId.charCodeAt(i)) % 1000;
  }
  const rawScore = Number((0.10 + (hash / 1000) * 0.85).toFixed(2));
  const score = Math.round(rawScore * 100);
  let level = "LOW";
  let status = "NOT FLAGGED";
  let adversarial = "STABLE";
  if (rawScore >= 0.80) {
    level = "VERY HIGH";
    status = "FLAGGED";
    adversarial = "SENSITIVE";
  } else if (rawScore >= 0.60) {
    level = "HIGH";
    status = "FLAGGED";
    adversarial = "SENSITIVE";
  } else if (rawScore >= 0.30) {
    level = "MEDIUM";
    status = "FLAGGED";
    adversarial = "STABLE";
  }
  return { score, rawScore, level, status, adversarial };
}

export const INITIAL_HISTORY = [
  { id:"HIST-001", claimId:"CLM-90210-FX88", score:82, level:"VERY HIGH", status:"FLAGGED",     adversarial:"SENSITIVE", action:"HOLD",   ts:"2024-01-04T09:22:11Z", resolvedAt:null, resolvedAction:null },
  { id:"HIST-002", claimId:"CLM-2024-0051", score:18, level:"LOW",       status:"NOT FLAGGED", adversarial:"STABLE",    action:"ACCEPT", ts:"2024-01-05T11:44:32Z", resolvedAt:null, resolvedAction:null },
  { id:"HIST-003", claimId:"CLM-2024-0047", score:72, level:"HIGH",      status:"FLAGGED",     adversarial:"SENSITIVE", action:"HOLD",   ts:"2024-01-06T14:07:55Z", resolvedAt:null, resolvedAction:null },
  { id:"HIST-004", claimId:"CLM-2024-0089", score:38, level:"MEDIUM",    status:"FLAGGED",     adversarial:"STABLE",    action:"ACCEPT", ts:"2024-01-08T10:15:00Z", resolvedAt:null, resolvedAction:null },
  { id:"HIST-005", claimId:"CLM-2024-0068", score:87, level:"VERY HIGH", status:"FLAGGED",     adversarial:"SENSITIVE", action:"REJECT", ts:"2024-01-09T08:30:22Z", resolvedAt:null, resolvedAction:null },
  { id:"HIST-006", claimId:"CLM-2024-0117", score:91, level:"VERY HIGH", status:"FLAGGED",     adversarial:"SENSITIVE", action:"HOLD",   ts:"2024-01-11T16:52:44Z", resolvedAt:null, resolvedAction:null },
];

export const DASH_STATS = {
  total: 1284,
  flagged: 318,
  clean: 966,
  onHold: 89,
  highVeryHigh: 142,
  stable: 872,
  sensitive: 412,
  accepted: 589,
  held: 89,
  rejected: 258,
  riskDist: { LOW: 48, MEDIUM: 28, HIGH: 14, VERY_HIGH: 10 },
  monthFlagged: [24, 28, 22, 35, 41, 38, 48, 44, 51, 58, 45, 62],
  monthTotal:   [95, 110, 99, 132, 148, 139, 167, 155, 181, 196, 163, 199],
};

export const MOCK_USER = {
  name: "Dr. Reena Patel",
  initials: "DR",
  email: "r.patel@robustclaim.health",
  role: "Lead Fraud Investigator",
  institution: "National Healthcare Fraud Unit",
  department: "Claims Risk & Compliance",
  employeeId: "EMP-4821",
  region: "South Asia Division",
  joined: "2021-03-15",
  lastLogin: "2026-09-21T08:47:00Z",
  reviewedTotal: 847,
};

// ── Helpers ────────────────────────────────────────────────────
export function scoreToLevel(s) {
  if (s < 0.30 || s < 30) return "LOW";
  if (s < 0.60 || s < 60) return "MEDIUM";
  if (s < 0.80 || s < 80) return "HIGH";
  return "VERY HIGH";
}

export function levelClass(l) {
  const m = {
    LOW: "badge-low",
    MEDIUM: "badge-medium",
    HIGH: "badge-high",
    "VERY HIGH": "badge-veryhigh"
  };
  return m[l] || "badge-gray";
}

export function scoreColor(s) {
  const val = s > 1 ? s / 100 : s;
  if (val < 0.30) return "#16A34A";
  if (val < 0.60) return "#D97706";
  if (val < 0.80) return "#EA580C";
  return "#DC2626";
}

export function fmtCurrency(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

export function fmtTs(s) {
  const d = new Date(s);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    + " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function genId() {
  return "HIST-" + Date.now().toString(36).toUpperCase();
}

// ── Business Rules Catalog (Exact mapping from specification) ──
export const BUSINESS_RULES_CATALOG = [
  {
    id: "R1",
    name: "Cost Outlier (mild)",
    logic: "3 < claim_to_expected_ratio ≤ 6",
    condition: "Claim amount 3–6× above DRG peer baseline",
    weight: 0.15,
  },
  {
    id: "R2",
    name: "Extreme Cost Outlier",
    logic: "claim_to_expected_ratio > 6",
    condition: "Claim amount > 6× above DRG peer baseline",
    weight: 0.30,
  },
  {
    id: "R3",
    name: "Claim After Death",
    logic: "Claim start date falls after the patient's recorded date of death",
    condition: "Service date > patient recorded date of death",
    weight: 0.40,
  },
  {
    id: "R4",
    name: "Duplicate/Near-Duplicate Claim",
    logic: "Same patient + same provider + same procedure code, filed within a 7-day window",
    condition: "Identical patient & provider procedure within 7 days",
    weight: 0.25,
  },
  {
    id: "R5",
    name: "Excessive Claim Duration",
    logic: "Duration exceeds the point-in-time 95th percentile for that procedure/care-type peer group",
    condition: "Length of stay exceeds 95th percentile for DRG",
    weight: 0.15,
  },
  {
    id: "R6",
    name: "Provider Claim-Frequency Spike",
    logic: "That provider's claims in the last 7 days exceed 3× their own historical weekly average (requires ≥10 prior claims)",
    condition: "Provider 7-day volume spike > 3× historical average",
    weight: 0.20,
  },
];

// Evaluates a given claim against the business rules catalog
export function evaluateBusinessRules(claim) {
  if (!claim) return [];
  const expectedPeerAvg = 9200;
  const ratio = claim.claimAmount / expectedPeerAvg;

  return BUSINESS_RULES_CATALOG.map((rule) => {
    let triggered = false;
    let details = "Within normal peer benchmarks";

    if (rule.id === "R1") {
      triggered = ratio > 3 && ratio <= 6;
      details = triggered
        ? `Claim amount ($${claim.claimAmount.toLocaleString()}) is ${ratio.toFixed(1)}× peer average ($${expectedPeerAvg.toLocaleString()})`
        : `Claim-to-expected ratio is ${ratio.toFixed(1)}× (≤ 3.0× threshold)`;
    } else if (rule.id === "R2") {
      triggered = ratio > 6;
      details = triggered
        ? `Claim amount ($${claim.claimAmount.toLocaleString()}) is ${ratio.toFixed(1)}× peer average ($${expectedPeerAvg.toLocaleString()})`
        : `Claim ratio ${ratio.toFixed(1)}× below extreme threshold (6.0×)`;
    } else if (rule.id === "R3") {
      // Trigger for specific high risk test cases (e.g. CLM-2024-0158) or age > 85 with 5+ chronics
      triggered = claim.claimId === "CLM-2024-0158" || (claim.age >= 86 && claim.chronicCount >= 5);
      details = triggered
        ? `Service start date (${claim.claimStart}) falls after recorded date of demise`
        : `Beneficiary active status verified with vital statistics registry`;
    } else if (rule.id === "R4") {
      triggered = claim.prevClaimCount >= 10 || claim.rules?.some((r) => r.name.toLowerCase().includes("duplicate"));
      details = triggered
        ? `Same patient & provider filed overlapping procedure within 7-day window`
        : `No duplicate procedure billing detected in rolling 7-day window`;
    } else if (rule.id === "R5") {
      triggered = claim.duration >= 7;
      details = triggered
        ? `Length of stay (${claim.duration} days) exceeds 95th percentile (expected 2–4 days)`
        : `Duration (${claim.duration} days) within standard 95th percentile window`;
    } else if (rule.id === "R6") {
      triggered = claim.prevClaimCount >= 12;
      details = triggered
        ? `Provider ${claim.providerId} submitted ${claim.prevClaimCount} claims in past 14 days (3.8× historical baseline)`
        : `Provider submission velocity is within 1.2× normal historical average`;
    }

    return {
      ...rule,
      triggered,
      details,
    };
  });
}

// ── Mock SHAP Explainability Factors ──
export function getMockShapFactors(claim) {
  if (!claim) return [];

  return [
    {
      id: "amount",
      factor: "High claim amount",
      description: "Claim amount is significantly higher than similar cases",
      iconType: "amount",
      impact: "danger",
    },
    {
      id: "duration",
      factor: "Unusual admission duration",
      description: "Length of stay is shorter than expected for this procedure",
      iconType: "duration",
      impact: "danger",
    },
    {
      id: "procedure",
      factor: "Procedure combination",
      description: "Uncommon combination of procedures in a single claim",
      iconType: "procedure",
      impact: "danger",
    },
    {
      id: "provider",
      factor: "Provider historical pattern",
      description: "Provider shows higher than average claim amounts for similar cases",
      iconType: "provider",
      impact: "danger",
    },
    {
      id: "frequency",
      factor: "Patient claim frequency",
      description: "Higher claim frequency in recent months",
      iconType: "frequency",
      impact: "danger",
    },
  ];
}

// ── Mock Similar Past Cases (RAG) ──
export function getMockSimilarCases(claim) {
  return [
    {
      caseId: "Case #VM-2024-1182",
      similarity: "94% Match",
      procedure: claim?.procedureCodes?.[0] || "CPT-99223",
      drg: claim?.drgCode || "DRG-470",
      description: "Similar high-cost inpatient claim with short admission duration and identical DRG code.",
      outcome: "Confirmed Fraud",
      action: "Recovered $38,400 after clinical documentation audit.",
      statusType: "danger",
    },
    {
      caseId: "Case #VM-2023-0761",
      similarity: "88% Match",
      procedure: claim?.procedureCodes?.[1] || "CPT-94002",
      drg: claim?.drgCode || "DRG-470",
      description: "Multiple high-cost procedure codes submitted in single claim under same attending physician.",
      outcome: "Confirmed Fraud",
      action: "Provider placed under mandatory pre-payment claims review.",
      statusType: "danger",
    },
    {
      caseId: "Case #VM-2024-0419",
      similarity: "76% Match",
      procedure: claim?.procedureCodes?.[0] || "CPT-71045",
      drg: claim?.drgCode || "DRG-470",
      description: "Emergency admission with multi-system complications justifying elevated billing amounts.",
      outcome: "Legitimate / Approved",
      action: "Adjudicated and paid after secondary physician verification.",
      statusType: "success",
    },
  ];
}

// ── Mock AI Assistant Synthesis ──
export function getMockAiSummary(claim, analysis) {
  if (!claim) return "";
  const isHigh = (analysis?.score || 0) >= 60 || analysis?.status === "FLAGGED";
  if (isHigh) {
    return `This claim is flagged as high risk due to a combination of an unusually high claim amount ($${claim.claimAmount.toLocaleString()}), length of stay (${claim.duration} days), and uncommon procedure combinations for DRG ${claim.drgCode}. Similar past fraudulent cases show comparable patterns. It is recommended to verify the medical necessity of the procedures, check supporting documentation, and confirm admission and discharge records.`;
  }
  return `This claim demonstrates standard clinical and billing consistency with regional ${claim.drgCode} benchmarks. Billed charges of $${claim.claimAmount.toLocaleString()} align with the expected peer distribution, and length of stay (${claim.duration} days) is consistent with primary ICD codes. No adverse billing velocity or provider anomalies detected.`;
}
