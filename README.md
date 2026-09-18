# 🏔️ POLARIS COMMAND
### Integrated Polar Expedition Logistics & Asset Management System

> **Smart India Hackathon 2026** — Problem Statement PS 26062  
> **Organization:** Ministry of Earth Sciences (MoES) / NCPOR  
> **Theme:** Smart Automation

---

## 📌 Overview

**POLARIS COMMAND** is a centralized digital command platform for managing Indian polar expeditions. It integrates Expedition Planning, Cargo Tracking, Inventory Management, Personnel Movement, Emergency Response, and AI-assisted decision support into a single system — powered by synthetic operational data.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend (Main)** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Frontend (Alt)** | React 19, Vite, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, SQLAlchemy, SQLite, Uvicorn |
| **State Management** | React Context + useReducer |
| **Icons / Charts** | Lucide React, Recharts |

---

## 📦 Prerequisites

Make sure the following are installed on your machine:

- **Node.js** v18+ → https://nodejs.org
- **npm** v9+
- **Python** 3.10+ → https://python.org
- **Git** → https://git-scm.com

---

## ⚡ Quick Start — Run Everything

### Step 1: Clone the Repository

```bash
git clone https://github.com/deepeshaggarwal123/POLARIS-COMMAND.git
cd POLARIS-COMMAND
```

---

### Step 2: Run the Main App (Next.js)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

🌐 Open **http://localhost:3000** in your browser.

> **Login:** Use any username and password — auth is simulated via localStorage.

---

### Step 3: Run the Python Backend (Optional)

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with demo data (first time only)
python seed.py

# Start the FastAPI backend server
uvicorn main:app --reload
```

🌐 API: **http://localhost:8000**  
📖 Swagger Docs: **http://localhost:8000/docs**

---

### Step 4: Run the Vite Frontend (Optional)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

🌐 Open **http://localhost:5173** in your browser.

---

## 🔨 Build for Production

### Next.js Build

```bash
npm run build
npm start
```

### Vite Build

```bash
cd frontend
npm run build
npm run preview
```

---

## 🧩 Modules

| Module | Description |
|---|---|
| 🧭 **Command Center** | Mission KPI dashboard, operational risk queue |
| 🗺️ **Expedition Planning** | Create & manage polar expeditions with AI resource calculator |
| 📦 **Cargo Tracking** | Real-time cargo tracking with QR scan simulation |
| 🏔️ **Inventory Management** | Inventory levels, consumption tracking, AI replenishment forecasting |
| 👥 **Personnel Movement** | Real-time personnel tracking, check-in monitoring, simulated map |
| 🚨 **Emergency Response** | Incident command center, AI response analysis, dispatch |
| ⚙️ **Asset Management** | IoT telemetry, health monitoring, maintenance scheduling |
| 🤖 **AI Copilot** | Conversational AI assistant for operational queries |
| 📊 **Analytics** | Mission performance charts and visualizations |
| 📋 **Audit Log** | Immutable record of all operational actions and system events |

---

## 📁 Project Structure

```
POLARIS-COMMAND/
├── src/                            # Next.js main application
│   ├── app/
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Register page
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Entry point
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── modules/                # All feature modules
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
│   │   ├── AppShell.tsx            # Navigation sidebar
│   │   └── Dashboard.tsx           # Main dashboard wrapper
│   ├── data/
│   │   └── demoData.ts             # Synthetic operational data
│   └── store/
│       └── appStore.tsx            # Global state (Context + Reducer)
├── backend/                        # FastAPI Python backend
│   ├── main.py                     # API entry point
│   ├── models.py                   # SQLAlchemy database models
│   ├── database.py                 # DB engine + session
│   ├── seed.py                     # Database seeder
│   └── requirements.txt            # Python dependencies
├── frontend/                       # Vite React frontend (alternative)
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml              # PostgreSQL/PostGIS via Docker
├── package.json                    # Next.js dependencies
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🐳 Docker (PostgreSQL — Optional)

If you want to use PostgreSQL instead of SQLite:

```bash
# Start PostgreSQL container
docker compose up -d

# Check running containers
docker ps
```

Then update `backend/database.py` to use:
```python
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://polar_user:polar_password@localhost:5432/polarops"
```

---

## 📋 All Available Commands

### Next.js (Root)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm start            # Start production server
```

### Vite Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run oxlint
```

### Python Backend
```bash
cd backend
python -m venv venv                    # Create virtual env
venv\Scripts\activate                  # Activate (Windows)
source venv/bin/activate               # Activate (Mac/Linux)
pip install -r requirements.txt        # Install dependencies
python seed.py                         # Seed database
uvicorn main:app --reload              # Start backend (port 8000)
uvicorn main:app --host 0.0.0.0 --port 8000   # Start on all interfaces
```

### Git
```bash
git clone https://github.com/deepeshaggarwal123/POLARIS-COMMAND.git
git pull origin master                 # Pull latest changes
git add .                              # Stage all files
git commit -m "message"               # Commit
git push origin master                 # Push to GitHub
```

---

## 🌟 Key Features

- ✅ **Fully Offline-Ready** — No external API calls, all data is synthetic and local
- ✅ **Cross-Module Intelligence** — GEN-07 asset warning linked to ANT-1024 delayed cargo
- ✅ **AI Recommendations** — Inventory forecasting, emergency response, expedition planning
- ✅ **QR Code Simulation** — Cargo identification via simulated QR scanning
- ✅ **Live Telemetry** — Asset temperature/fuel/vibration live updates
- ✅ **Audit Trail** — Every action logged with timestamp and actor
- ✅ **Personnel Map** — SVG-based simulated personnel position map
- ✅ **Responsive UI** — Blue/Green themed, works on desktop and tablet

---

## 📸 Demo Walkthrough

1. **Command Center** — View active ISEA-2027 KPIs and Operational Risk Queue
2. **Expedition** — Open `ISEA-2027` → view readiness. Create new expedition → see AI Resource Calculator
3. **Cargo** — View `ANT-1024` (Generator Cooling Pump) as DELAYED → Simulate QR Scan
4. **Inventory** — View `INV-001` (Bharati Diesel) at WARNING → Run AI Forecast
5. **Personnel** — View `Vikram Rao` OVERDUE at Field Camp Alpha → Simulate Check-In
6. **Emergency** — Open incident for Vikram Rao → AI Response Analysis → **DISPATCH RESPONSE**
7. **Assets** — View `GEN-07` critical temperature warning (cross-linked to ANT-1024)
8. **AI Copilot** — Ask questions from preset list
9. **Analytics + Audit Log** — View charts and action history

---

## 👥 Team

**Team POLARIS** — Smart India Hackathon 2026  
Stations: **Bharati** (Antarctica) · **Maitri** (Antarctica) · **Himadri** (Arctic)

---

## 📄 License

Prototype developed for Smart India Hackathon 2026.  
*Synthetic Data Only — Not real NCPOR operational figures.*

---

<div align="center">
🇮🇳 <strong>Smart India Hackathon 2026 — Ministry of Earth Sciences / NCPOR</strong><br/>
<em>Prototype Mode · Synthetic Operational Data · PS 26062</em>
</div>
