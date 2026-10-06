# RoBust-Claim — Health Insurance Fraud Detection & Adjudication System

RoBust-Claim is an enterprise-grade AI-powered healthcare fraud detection and investigation platform designed for healthcare payers, forensic auditors, and Special Investigation Units (SIUs). The platform combines deterministic clinical heuristic evaluations, adversarial robustness modeling, explainable AI (SHAP), semantic case retrieval (RAG), and assistive LLM clinical narratives into a unified investigation console.

---

## 🌟 Key Features

- **Executive Claim Dossier**: Detailed multi-quadrant inspection across Patient Demographics, Provider & Facility metrics, Diagnostic & Procedure Coding (ICD-10 / CPT / DRG), and Financial Timeline analysis.
- **Dynamic Risk Assessment**: Real-time fraud scoring percentage, dynamic risk percentile benchmarking (e.g. 87th, 91st), and triage risk status.
- **Adversarial Robustness Modeling**: Evaluates neural model resilience against boundary manipulation and subtle feature perturbations (`Stable` vs. `Sensitive`).
- **Tabbed Topic Investigation Console**:
  - **Overview**: 4-quadrant clinical specifics and Key Risk Indicator widgets.
  - **Explainable Insight (SHAP)**: Top feature attribution factors with visual indicator badges (high claim amount, unusual stay duration, procedure stacking, provider velocity, billing spikes).
  - **Similar Past Cases (RAG)**: Historical vector matches from adjudicated CMS audit archives with similarity matching and recovered fund records.
  - **Triggered Business Rules**: Institutional CMS fraud heuristic catalog evaluating rules **R1 through R6** (Cost outliers, duplicate/near-duplicate claims, excessive stay duration, provider billing frequency spikes).
- **AI Investigation Assistant**: Clinical narrative synthesis summarizing case anomalies, clickable recommended queries, and interactive follow-up Q&A.
- **Adjudication Console**: One-click claim decisions (**Accept Valid Claim**, **Reject Fraudulent Claim**, **Hold for Further Review**) with optional notes and persistent audit log in the Claims History table.

---

## 🚀 Quickstart Guide

Follow these steps to clone the repository, install dependencies, and run the project locally.

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

- Verify Node.js:
  ```bash
  node -v
  ```
- Verify npm:
  ```bash
  npm -v
  ```

---

### 1. Clone the Repository

Clone this repository from GitHub to your local machine:

```bash
git clone https://github.com/kishanthraja3/ROBUST-CLAIM.git
```

Navigate into the project root directory:

```bash
cd ROBUST-CLAIM
```

---

### 2. Install Dependencies

Install all necessary packages and dependencies:

```bash
npm install
```

---

### 3. Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:

```
http://localhost:5173/
```

---

## 🛠️ Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and builds the production bundle into the `dist/` directory. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs the Oxlint linter to detect code syntax issues. |

---

## 📁 Project Structure

```
Robust-Claim/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI components (Sidebar, Topbar, etc.)
│   ├── data/
│   │   └── mockData.js     # Claims catalog, CMS rules (R1-R6), deterministic evaluation
│   ├── pages/
│   │   ├── Dashboard.jsx   # Portfolio metrics, fraud distribution charts, queue status
│   │   ├── Investigation.jsx # Flagship Claim Dossier & Tabbed Investigation Console
│   │   └── ClaimsHistory.jsx # Historical audit log with filters and resolution actions
│   ├── styles/
│   │   └── index.css       # Enterprise design system, variables, and responsive layout
│   ├── App.jsx             # Main application orchestrator & toast notification system
│   └── main.jsx            # React root mount point
├── index.html              # HTML template
├── package.json            # Dependencies and npm scripts
├── vite.config.js          # Vite configuration
└── README.md               # Documentation
```

---

## 🛡️ License

This project is created for healthcare fraud detection research and demonstration purposes.
