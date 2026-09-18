# 🏔️ POLARIS COMMAND
### Integrated Polar Expedition Logistics & Asset Management System

> **Smart India Hackathon 2026** — Problem Statement PS 26062
> **Organization:** Ministry of Earth Sciences (MoES) / NCPOR
> **Theme:** Smart Automation

---

## 📌 Overview

**POLARIS COMMAND** is a centralized digital command platform for managing Indian polar expeditions (Antarctic & Arctic). It integrates Expedition Planning, Cargo Tracking, Inventory Management, Personnel Movement, Emergency Response, and AI-assisted decision support into a single cohesive system — powered by synthetic operational data and deterministic AI recommendations.

The system is designed for **offline-ready deployment** at Indian polar stations (Bharati, Maitri, Himadri) where internet connectivity is limited or unavailable.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **State Management** | React Context + Reducer (useReducer) |
| **UI Components** | Lucide React Icons, Recharts |
| **Data** | Synthetic demo data (fully offline) |
| **Backend (Optional)** | FastAPI, SQLAlchemy, SQLite |
| **Package Manager** | npm |

---

## 🧩 Modules

| Module | Description |
|---|---|
| 🧭 **Command Center** | Mission KPI dashboard, operational risk queue, cross-module overview |
| 🗺️ **Expedition Planning** | Create & manage polar expeditions — allocation, resources, readiness |
| 📦 **Cargo Tracking** | Real-time cargo tracking with QR scan simulation |
| 🏔️ **Inventory Management** | Station inventory levels, consumption tracking, AI replenishment forecasting |
| 👥 **Personnel Movement** | Real-time personnel tracking, check-in monitoring, simulated map |
| 🚨 **Emergency Response** | Incident command center, AI response analysis, resource dispatch |
| ⚙️ **Asset Management** | IoT telemetry, health monitoring, maintenance scheduling |
| 🤖 **AI Copilot** | Conversational AI assistant for operational queries |
| 📊 **Analytics** | Mission performance charts and data visualizations |
| 📋 **Audit Log** | Immutable record of all operational actions |

---

## 🖥️ Running the Project

### Prerequisites
- **Node.js** v18+
- **npm** v9+

### Quick Start (Next.js — Main App)

\\\ash
git clone https://github.com/deepeshaggarwal123/POLARIS-COMMAND.git
cd POLARIS-COMMAND
npm install
npm run dev
\\\

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 **Login:** Use any credentials — authentication is simulated via localStorage.

---

### Optional: Python Backend

\\\ash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
\\\

API available at [http://localhost:8000](http://localhost:8000)

---

## 📸 Presentation Scenario

1. **Command Center** — View active ISEA-2027 mission KPIs and the Operational Risk Queue
2. **Expedition** — Open ISEA-2027, view readiness metrics. Create a new expedition to see the AI Resource Calculator
3. **Cargo** — View ANT-1024 (Generator Cooling Pump) marked as DELAYED. Simulate a QR scan for instant identification
4. **Inventory** — Notice INV-001 (Bharati Diesel) at WARNING level. Run AI Forecast to see projected shortages
5. **Personnel** — Notice Vikram Rao is OVERDUE at Field Camp Alpha. Simulate check-in to update the map
6. **Emergency** — Open the active incident for Vikram Rao. Watch AI Response Analysis generate a protocol. Click DISPATCH RESPONSE
7. **Assets** — Check GEN-07 to see its critical temperature warning (linked to delayed ANT-1024 cargo)
8. **AI Copilot** — Ask questions from the preset list to see real-time operational awareness
9. **Analytics & Audit Log** — View charts and the immutable record of all actions

---

## 📁 Project Structure

\\\
POLARIS-COMMAND/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── modules/            # Feature modules
│   │   │   ├── CommandCenter.tsx
│   │   │   ├── Expeditions.tsx
│   │   │   ├── Cargo.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── Personnel.tsx
│   │   │   ├── Emergency.tsx
│   │   │   ├── Assets.tsx
│   │   │   ├── AICopilot.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── AuditLog.tsx
│   │   ├── AppShell.tsx
│   │   └── Dashboard.tsx
│   ├── data/
│   │   └── demoData.ts         # Synthetic operational data
│   └── store/
│       └── appStore.tsx        # Global state management
├── backend/                    # FastAPI backend (optional)
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── seed.py
│   └── requirements.txt
├── next.config.js
├── tailwind.config.ts
└── package.json
\\\

---

## 🌟 Key Features

- ✅ Fully Offline-Ready — No external API calls, all data is synthetic and local
- ✅ Cross-Module Intelligence — GEN-07 asset warning linked to ANT-1024 delayed cargo
- ✅ AI-Assisted Recommendations — Inventory forecasting, emergency response, expedition planning
- ✅ QR Code Simulation — Cargo identification via simulated QR scanning
- ✅ Live Telemetry Simulation — Asset temperature/fuel/vibration updates
- ✅ Audit Trail — Every action logged with timestamp and actor
- ✅ Personnel Map — SVG-based simulated map showing personnel positions
- ✅ Responsive Design — Works on desktop and tablet viewports

---

## 👥 Team

**Team POLARIS** — Smart India Hackathon 2026
Indian polar stations supported: **Bharati Station** (Antarctica), **Maitri Station** (Antarctica), **Himadri Station** (Arctic)

---

## 📄 License

Developed as a prototype for Smart India Hackathon 2026.
*Synthetic Data Only — Not real NCPOR operational figures.*

---

🇮🇳 Developed for Smart India Hackathon 2026 — Ministry of Earth Sciences
Prototype Mode · Synthetic Operational Data
