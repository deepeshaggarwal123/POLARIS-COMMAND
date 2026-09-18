"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Activity, AlertTriangle, Archive, BarChart3, Bell, Check, CheckCircle2,
  ChevronRight, CircleDot, Clock, CloudSnow, Compass, Cpu, Crosshair,
  Database, Download, Eye, Filter, Flame, Gauge, HeartPulse, Info,
  LayoutDashboard, MapPin, Menu, Navigation, Package, Play, Plus,
  Radio, RefreshCw, Route, Search, Send, Server, Settings, Shield,
  ShieldAlert, ShieldCheck, Sparkles, Thermometer, Truck, UserCheck,
  Users, Wind, Wrench, X, Zap
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, CartesianGrid
} from "recharts";
import PipelineModule from "./PipelineModule";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";


type PageKey =
  | "Command Center"
  | "Expeditions"
  | "Cargo & Logistics"
  | "Inventory"
  | "Personnel Movement"
  | "Asset Management"
  | "Emergency Response"
  | "AI Polar Copilot"
  | "Reports"
  | "Settings"
  | "Mission Pipeline";

type StationKey = "BHARATI" | "MAITRI" | "HIMADRI";

interface ExpeditionItem {
  id: string;
  name: string;
  station: string;
  status: "ACTIVE" | "PLANNED" | "COMPLETED";
  crew: number;
  readiness: number;
  cargo: string;
  duration: string;
  lead: string;
  objective: string;
}

interface CargoItem {
  id: string;
  item: string;
  category: "Fuel" | "Medical" | "Rations" | "Spares" | "Science";
  dest: string;
  status: "In Transit" | "Delayed" | "Delivered" | "Staged";
  eta: string;
  priority: "CRITICAL" | "HIGH" | "NORMAL";
  weight: string;
  carrier: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  qty: string;
  currentUnits: number;
  maxUnits: number;
  days: number;
  burnDaily: number;
  risk: "HEALTHY" | "WATCH" | "HIGH RISK";
}

interface PersonnelItem {
  id: string;
  name: string;
  role: string;
  loc: string;
  check: string;
  status: "ACTIVE" | "FIELD" | "OVERDUE" | "STANDBY";
  heartRate: number;
  temp: string;
  battery: number;
  coords: string;
}

interface AssetItem {
  id: string;
  name: string;
  type: string;
  loc: string;
  health: number;
  status: "OPERATIONAL" | "WARNING" | "MAINTENANCE";
  due: string;
  temp: number;
  runtime: string;
  fuel: number;
}

const STATIONS_DATA: Record<StationKey, {
  name: string;
  region: string;
  coords: string;
  temp: string;
  wind: string;
  barometer: string;
  status: string;
  readiness: number;
  activeCrew: number;
  satellite: string;
}> = {
  BHARATI: {
    name: "Bharati Station",
    region: "Larsemann Hills, East Antarctica",
    coords: "69°24'28\" S, 76°11'14\" E",
    temp: "-34°C",
    wind: "38 kts SW",
    barometer: "984 hPa",
    status: "OPERATIONAL",
    readiness: 89,
    activeCrew: 42,
    satellite: "IRIDIUM-NEXT 99.8%",
  },
  MAITRI: {
    name: "Maitri Station",
    region: "Schirmacher Oasis, Queen Maud Land",
    coords: "70°45'58\" S, 11°43'56\" E",
    temp: "-39°C",
    wind: "46 kts SE (Blizzard Warning)",
    barometer: "978 hPa",
    status: "ELEVATED ALERT",
    readiness: 84,
    activeCrew: 36,
    satellite: "INMARSAT POLAR 97.4%",
  },
  HIMADRI: {
    name: "Himadri Station",
    region: "Ny-Ålesund, Svalbard, Arctic",
    coords: "78°55'00\" N, 11°56'00\" E",
    temp: "-18°C",
    wind: "22 kts N",
    barometer: "1004 hPa",
    status: "OPERATIONAL",
    readiness: 94,
    activeCrew: 18,
    satellite: "STARLINK POLAR 99.9%",
  },
};

const INITIAL_EXPEDITIONS: ExpeditionItem[] = [
  {
    id: "EXP-01",
    name: "ISEA-2027 Polar Push",
    station: "Bharati Station",
    status: "ACTIVE",
    crew: 42,
    readiness: 89,
    cargo: "94%",
    duration: "15 Nov 2026 – 28 Feb 2027",
    lead: "Dr. Arjun Mehta",
    objective: "Deep ice core sampling and atmospheric greenhouse trace measurement.",
  },
  {
    id: "EXP-02",
    name: "ARCTIC-44 Winter Observation",
    station: "Himadri Station",
    status: "ACTIVE",
    crew: 18,
    readiness: 94,
    cargo: "82%",
    duration: "01 Jan 2027 – 15 Apr 2027",
    lead: "Dr. Sunita Sharma",
    objective: "Arctic fjord marine ecosystem biodiversity monitoring under polar night.",
  },
  {
    id: "EXP-03",
    name: "MRE-2028 Traverse Mission",
    station: "Maitri Station",
    status: "PLANNED",
    crew: 24,
    readiness: 71,
    cargo: "64%",
    duration: "10 Nov 2027 – 20 Jan 2028",
    lead: "Cmdr. Rajesh Verma",
    objective: "Inland plateau seismic acoustic survey and geomagnetic mapping.",
  },
  {
    id: "EXP-04",
    name: "POLAR-GLACIER Hydro Study",
    station: "Bharati Station",
    status: "COMPLETED",
    crew: 15,
    readiness: 100,
    cargo: "100%",
    duration: "Oct 2025 – Feb 2026",
    lead: "Dr. K. Ramanathan",
    objective: "Sub-glacial lake hydrological dynamics and radar sounding.",
  },
];

const INITIAL_CARGO: CargoItem[] = [
  {
    id: "ANT-1024",
    item: "Generator Cooling Pump Unit",
    category: "Spares",
    dest: "Bharati",
    status: "Delayed",
    eta: "18 Dec 2026",
    priority: "CRITICAL",
    weight: "480 kg",
    carrier: "MV Vasiliy Golovnin",
  },
  {
    id: "ANT-1041",
    item: "High-Altitude Medical Cryo-Kits",
    category: "Medical",
    dest: "Maitri",
    status: "In Transit",
    eta: "21 Dec 2026",
    priority: "HIGH",
    weight: "120 kg",
    carrier: "Basler BT-67 Air Cargo",
  },
  {
    id: "ANT-1055",
    item: "Winter Ration Packs (Freeze-Dried)",
    category: "Rations",
    dest: "Bharati",
    status: "Delivered",
    eta: "14 Dec 2026",
    priority: "NORMAL",
    weight: "3,200 kg",
    carrier: "Heavy Traverse Sledge-1",
  },
  {
    id: "ANT-1072",
    item: "Satellite Communication Transceiver",
    category: "Science",
    dest: "Himadri",
    status: "In Transit",
    eta: "23 Dec 2026",
    priority: "HIGH",
    weight: "85 kg",
    carrier: "Polar Twin Otter",
  },
  {
    id: "ANT-1090",
    item: "Polar Grade Low-Temp Diesel (Batch 4)",
    category: "Fuel",
    dest: "Bharati",
    status: "In Transit",
    eta: "20 Dec 2026",
    priority: "CRITICAL",
    weight: "12,000 L",
    carrier: "Fuel Bladder Convoy Beta",
  },
  {
    id: "ANT-1102",
    item: "Snowcat Track Replacement Shoes",
    category: "Spares",
    dest: "Maitri",
    status: "Staged",
    eta: "28 Dec 2026",
    priority: "NORMAL",
    weight: "620 kg",
    carrier: "Cape Town Staging Depot",
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "INV-01",
    name: "Polar Grade Diesel (Fuel)",
    category: "Energy",
    qty: "8,420 L",
    currentUnits: 8420,
    maxUnits: 12500,
    days: 16.7,
    burnDaily: 504,
    risk: "HIGH RISK",
  },
  {
    id: "INV-02",
    name: "Medical Oxygen & Trauma Packs",
    category: "Healthcare",
    qty: "1,284 units",
    currentUnits: 1284,
    maxUnits: 1400,
    days: 42.0,
    burnDaily: 30,
    risk: "HEALTHY",
  },
  {
    id: "INV-03",
    name: "High-Calorie Polar Rations",
    category: "Sustenance",
    qty: "4,860 kg",
    currentUnits: 4860,
    maxUnits: 6500,
    days: 31.5,
    burnDaily: 154,
    risk: "HEALTHY",
  },
  {
    id: "INV-04",
    name: "Mechanical & Heating Spares",
    category: "Maintenance",
    qty: "384 units",
    currentUnits: 384,
    maxUnits: 800,
    days: 12.0,
    burnDaily: 32,
    risk: "HIGH RISK",
  },
  {
    id: "INV-05",
    name: "Pressurized Oxygen Cylinders",
    category: "Life Support",
    qty: "760 cyl",
    currentUnits: 760,
    maxUnits: 950,
    days: 27.2,
    burnDaily: 28,
    risk: "WATCH",
  },
  {
    id: "INV-06",
    name: "Aviation Fuel (Jet A-1 Anti-Freeze)",
    category: "Mobility",
    qty: "5,100 L",
    currentUnits: 5100,
    maxUnits: 6000,
    days: 34.0,
    burnDaily: 150,
    risk: "HEALTHY",
  },
];

const INITIAL_PERSONNEL: PersonnelItem[] = [
  {
    id: "PER-01",
    name: "Dr. Arjun Mehta",
    role: "Expedition Research Lead",
    loc: "Bharati Station - Lab 2",
    check: "5 min ago",
    status: "ACTIVE",
    heartRate: 72,
    temp: "36.6°C",
    battery: 94,
    coords: "69°24'28\" S, 76°11'14\" E",
  },
  {
    id: "PER-02",
    name: "Rahul Singh",
    role: "Senior Field Engineer",
    loc: "Traverse Corridor (12.4 km NE)",
    check: "14 min ago",
    status: "FIELD",
    heartRate: 84,
    temp: "36.4°C",
    battery: 78,
    coords: "69°21'05\" S, 76°19'40\" E",
  },
  {
    id: "PER-03",
    name: "Vikram Rao",
    role: "Heavy Vehicle Operator",
    loc: "Ridge Alpha (14.2 km from Base)",
    check: "48 min ago",
    status: "OVERDUE",
    heartRate: 88,
    temp: "35.9°C",
    battery: 41,
    coords: "69°19'12\" S, 76°23'02\" E",
  },
  {
    id: "PER-04",
    name: "Dr. Neha Kapoor",
    role: "Chief Medical Officer",
    loc: "Bharati Station - Infirmary",
    check: "2 min ago",
    status: "ACTIVE",
    heartRate: 68,
    temp: "36.8°C",
    battery: 98,
    coords: "69°24'28\" S, 76°11'14\" E",
  },
  {
    id: "PER-05",
    name: "Tenzing Norbu",
    role: "Polar Guide & Safety Specialist",
    loc: "Field Alpha Shelter (6.8 km)",
    check: "10 min ago",
    status: "FIELD",
    heartRate: 76,
    temp: "36.5°C",
    battery: 89,
    coords: "69°22'18\" S, 76°15'33\" E",
  },
  {
    id: "PER-06",
    name: "Priya Nair",
    role: "Atmospheric Scientist",
    loc: "Observation Mast Tower",
    check: "8 min ago",
    status: "ACTIVE",
    heartRate: 70,
    temp: "36.7°C",
    battery: 91,
    coords: "69°24'35\" S, 76°11'02\" E",
  },
];

const INITIAL_ASSETS: AssetItem[] = [
  {
    id: "GEN-07",
    name: "Station Primary Generator Unit 2",
    type: "Diesel Power Plant",
    loc: "Bharati Power Core",
    health: 64,
    status: "WARNING",
    due: "In 4 days",
    temp: 84,
    runtime: "2,840 hrs",
    fuel: 63,
  },
  {
    id: "SV-04",
    name: "PistenBully Snowcat 300 Polar",
    type: "Tracked Over-Snow Transport",
    loc: "Field Alpha Shelter",
    health: 88,
    status: "OPERATIONAL",
    due: "In 21 days",
    temp: 68,
    runtime: "1,120 hrs",
    fuel: 85,
  },
  {
    id: "COM-12",
    name: "X-Band Satellite Radome Dish",
    type: "Telemetry Uplink",
    loc: "Maitri Comms Dome",
    health: 96,
    status: "OPERATIONAL",
    due: "In 45 days",
    temp: 42,
    runtime: "4,680 hrs",
    fuel: 100,
  },
  {
    id: "MED-03",
    name: "Autonomous Life Support Pod",
    type: "Emergency Medical Facility",
    loc: "Bharati Station",
    health: 91,
    status: "OPERATIONAL",
    due: "In 30 days",
    temp: 21,
    runtime: "890 hrs",
    fuel: 98,
  },
  {
    id: "UAV-02",
    name: "Arctic Scout Recon Drone",
    type: "VTOL Thermal Imaging UAV",
    loc: "SAR Hangar Alpha",
    health: 95,
    status: "OPERATIONAL",
    due: "In 15 days",
    temp: -5,
    runtime: "140 hrs",
    fuel: 100,
  },
  {
    id: "WTP-01",
    name: "Snow Melt Water Treatment Plant",
    type: "Hydration Utility",
    loc: "Bharati Station",
    health: 82,
    status: "OPERATIONAL",
    due: "In 12 days",
    temp: 48,
    runtime: "3,410 hrs",
    fuel: 78,
  },
];

const TELEMETRY_HISTORY: Record<string, { time: string; temp: number; rpm: number; fuel: number; power: number }[]> = {
  "GEN-07": [
    { time: "06:00", temp: 72, rpm: 2800, fuel: 74, power: 88 },
    { time: "08:00", temp: 75, rpm: 2820, fuel: 71, power: 89 },
    { time: "10:00", temp: 78, rpm: 2830, fuel: 68, power: 86 },
    { time: "12:00", temp: 81, rpm: 2850, fuel: 66, power: 84 },
    { time: "14:00", temp: 84, rpm: 2870, fuel: 63, power: 82 },
    { time: "16:00", temp: 86, rpm: 2890, fuel: 61, power: 79 },
  ],
  "SV-04": [
    { time: "06:00", temp: 60, rpm: 1800, fuel: 96, power: 92 },
    { time: "08:00", temp: 64, rpm: 2100, fuel: 92, power: 90 },
    { time: "10:00", temp: 67, rpm: 2250, fuel: 89, power: 91 },
    { time: "12:00", temp: 68, rpm: 2200, fuel: 87, power: 89 },
    { time: "14:00", temp: 70, rpm: 2150, fuel: 85, power: 88 },
    { time: "16:00", temp: 68, rpm: 2100, fuel: 85, power: 88 },
  ],
};

const READINESS_MONTHLY = [
  { month: "Aug", readiness: 74, fuel: 92, crew: 38 },
  { month: "Sep", readiness: 79, fuel: 88, crew: 40 },
  { month: "Oct", readiness: 83, fuel: 82, crew: 42 },
  { month: "Nov", readiness: 86, fuel: 76, crew: 42 },
  { month: "Dec", readiness: 89, fuel: 68, crew: 42 },
  { month: "Jan (Proj)", readiness: 93, fuel: 85, crew: 42 },
];

const SUPPLY_BURN_DATA = [
  { category: "Diesel Fuel (L)", burned: 504, restock: 650, reserve: 8420 },
  { category: "Food Rations (kg)", burned: 154, restock: 200, reserve: 4860 },
  { category: "Aviation Fuel (L)", burned: 150, restock: 300, reserve: 5100 },
  { category: "Oxygen (cyl)", burned: 28, restock: 50, reserve: 760 },
  { category: "Medical Packs", burned: 30, restock: 60, reserve: 1284 },
];

export default function Dashboard() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [page, setPage] = useState<PageKey>("Command Center");
  const [station, setStation] = useState<StationKey>("BHARATI");
  const [expeditions, setExpeditions] = useState<ExpeditionItem[]>(INITIAL_EXPEDITIONS);
  const [cargoList, setCargoList] = useState<CargoItem[]>(INITIAL_CARGO);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [personnelList, setPersonnelList] = useState<PersonnelItem[]>(INITIAL_PERSONNEL);
  const [assetList, setAssetList] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [backendStatus, setBackendStatus] = useState<"CONNECTING" | "ONLINE" | "OFFLINE">("CONNECTING");

  // Fetch backend status
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => {
        if (data.status === "offline-ready") {
          setBackendStatus("ONLINE");
        }
      })
      .catch(() => setBackendStatus("OFFLINE"));
  }, []);

  // Check auth status
  useEffect(() => {
    const auth = localStorage.getItem("polaris_auth");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("polaris_auth");
    router.push("/login");
  };

  // Emergency SAR states
  const [incidentActive, setIncidentActive] = useState(true);
  const [sarDispatched, setSarDispatched] = useState(false);
  const [sarStatusText, setSarStatusText] = useState("SAR TEAM STANDBY · READY FOR DEPLOYMENT");
  const [sarTeam, setSarTeam] = useState("Alpha Snowcat + Drone Unit");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search and Copilot
  const [query, setQuery] = useState("");
  const [copilotHistory, setCopilotHistory] = useState<Array<{ role: "user" | "copilot"; text: string; time: string }>>([
    {
      role: "copilot",
      text: "Welcome to POLARIS AI Polar Copilot. Operational systems are synced with station telemetry. How can I assist your polar command today?",
      time: "11:45",
    },
  ]);
  const [copilotInput, setCopilotInput] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const navItems: { name: PageKey; icon: any; count?: number; alert?: boolean }[] = [
    { name: "Command Center", icon: LayoutDashboard },
    { name: "Expeditions", icon: Route, count: expeditions.filter(e => e.status === "ACTIVE").length },
    { name: "Cargo & Logistics", icon: Package, count: cargoList.length },
    { name: "Inventory", icon: Archive, alert: inventoryList.some(i => i.risk === "HIGH RISK") },
    { name: "Personnel Movement", icon: Users, alert: personnelList.some(p => p.status === "OVERDUE") },
    { name: "Asset Management", icon: Wrench, count: assetList.length },
    { name: "Emergency Response", icon: ShieldAlert, alert: incidentActive && !sarDispatched },
    { name: "AI Polar Copilot", icon: Cpu },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings },
    { name: "Mission Pipeline", icon: Route },
  ];

  // Resolve overdue personnel
  const handleCheckInPersonnel = (id: string) => {
    setPersonnelList(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: "ACTIVE",
            check: "Just now",
            loc: "Field Alpha Outpost (Secured)",
          };
        }
        return p;
      })
    );
    showToast("Satellite check-in received! Status updated to ACTIVE (Safe).");
  };

  // Dispatch SAR
  const handleDispatchSAR = () => {
    setSarDispatched(true);
    setSarStatusText("SAR UNIT DISPATCHED · EN ROUTE TO RIDGE ALPHA (ETA 22 MIN)");
    showToast("Emergency Search & Rescue unit deployed with drone recon vector!");
  };

  // Restock inventory item
  const handleRestock = (id: string) => {
    setInventoryList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const added = Math.round(item.maxUnits * 0.25);
          const newUnits = Math.min(item.maxUnits, item.currentUnits + added);
          const newDays = Number((newUnits / item.burnDaily).toFixed(1));
          return {
            ...item,
            currentUnits: newUnits,
            qty: `${newUnits.toLocaleString()} units`,
            days: newDays,
            risk: newDays < 18 ? "HIGH RISK" : newDays < 25 ? "WATCH" : "HEALTHY",
          };
        }
        return item;
      })
    );
    showToast("Requisition order processed! Local reserves updated.");
  };

  // Service asset
  const handleServiceAsset = (id: string) => {
    setAssetList(prev =>
      prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            health: 98,
            status: "OPERATIONAL",
            temp: 68,
            due: "In 60 days",
          };
        }
        return a;
      })
    );
    showToast(`Preventative maintenance logged for ${id}. Health restored to 98%!`);
  };

  // Ask Copilot
  const handleAskCopilot = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user" as const, text: q, time: nowTime };

    const lower = q.toLowerCase();
    let reply = "";

    if (lower.includes("risk") || lower.includes("priority")) {
      reply =
        "Highest Operational Risks for Polar Bases: 1) Diesel fuel reserve at 16.7 days burn capacity. 2) Delayed Cooling Pump (ANT-1024) critical for Generator GEN-07. 3) Vikram Rao overdue check-in at Ridge Alpha (SAR dispatch active). Recommended Action: Approve SAR deployment and order fuel convoy transfer from Bharati East storage.";
    } else if (lower.includes("diesel") || lower.includes("fuel") || lower.includes("stockout")) {
      reply =
        "Polar Diesel Consumption Analysis: Current stock is 8,420 Liters with a daily burn rate of 504 L across generators and heating units. Under current blizzard conditions (-34°C, 38 kts), stockout is projected in 16.7 days. A fuel convoy (ANT-1090) with 12,000 L is staged in transit with ETA 20 Dec.";
    } else if (lower.includes("vikram") || lower.includes("search") || lower.includes("emergency") || lower.includes("sar")) {
      reply =
        "Personnel Situation Report - Vikram Rao: Last satellite ping was 48 min ago at 69°19'12\" S, 76°23'02\" E (14.2 km from Base). Biometric sensor shows 88 bpm heart rate and 35.9°C body temp with 41% beacon battery. Recommended route: Snowcat SV-04 via Valley Traverse with UAV-02 drone thermal sweep.";
    } else if (lower.includes("cargo") || lower.includes("shipment")) {
      reply =
        "Cargo Logistics Briefing: 6 shipments active across the corridor. Critical cargo ANT-1024 (Cooling Pump) is delayed by Southern Ocean pack ice, ETA revised to 18 Dec. Cryo Medical Kits (ANT-1041) arrive 21 Dec via Basler BT-67.";
    } else if (lower.includes("weather") || lower.includes("blizzard")) {
      reply =
        "Polar Weather Alert: Maitri Station is currently experiencing a Blizzard Warning with 46 kt gusts and barometric pressure at 978 hPa. Bharati Station wind is 38 kts SW with temperature -34°C. Non-essential overland traverses are restricted to convoy pairs.";
    } else {
      reply = `Telemetry & Knowledge Base Query: Regarding "${q}" — All polar station systems report green operational telemetry except Generator GEN-07 (cooling pump overdue) and the Ridge Alpha field sector. All data has been logged to the SIH Polaris mission database.`;
    }

    setCopilotHistory(prev => [...prev, userMsg, { role: "copilot", text: reply, time: nowTime }]);
    setCopilotInput("");
  };

  const stationData = STATIONS_DATA[station];

  if (isAuthChecking) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-mono tracking-widest text-sm animate-pulse">VERIFYING CLEARANCE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg text-textMain flex flex-col selection:bg-cyan-500 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-950/90 border border-emerald-400 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="text-green-700" size={20} />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-blue-200/50 bg-blue-50/95 backdrop-blur-md z-40 hidden lg:flex flex-col">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-blue-200/40 bg-gradient-to-r from-sky-950/40 to-emerald-950/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Compass className="text-blue-900" size={22} />
          </div>
          <div className="ml-3">
            <div className="font-black tracking-[0.24em] text-sm text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300">
              POLARIS
            </div>
            <div className="text-[9px] text-green-700/90 tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              EXPEDITION COMMAND
            </div>
          </div>
        </div>

        {/* Station Switcher Widget */}
        <div className="p-3 border-b border-blue-200/30">
          <p className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mb-1.5 px-1">
            Active Station Hub
          </p>
          <div className="grid grid-cols-3 gap-1 bg-blue-50 p-1 rounded-xl border border-blue-300/40">
            {(["BHARATI", "MAITRI", "HIMADRI"] as StationKey[]).map(s => (
              <button
                key={s}
                onClick={() => setStation(s)}
                className={`py-1.5 px-2 text-[10px] font-bold rounded-lg transition-all ${
                  station === s
                    ? "bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain shadow-md shadow-sky-600/30"
                    : "text-textSecondary hover:text-blue-700 hover:bg-sky-950/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <div className="px-3 py-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = page === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setPage(item.name)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600/20 to-emerald-600/20 text-slate-800 border border-sky-400/40 shadow-inner"
                    : "text-textSecondary hover:text-slate-800 hover:bg-sky-950/40 hover:border hover:border-blue-200/40"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sky-500/20 text-blue-800"
                      : "text-textSecondary group-hover:text-green-800 group-hover:bg-emerald-950/40"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span>{item.name}</span>
                {item.count !== undefined && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-sky-900/60 text-blue-700 font-mono border border-blue-300/50">
                    {item.count}
                  </span>
                )}
                {item.alert && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Station Telemetry Footer */}
        <div className="p-3 border-t border-blue-200/40 bg-blue-50">
          <div className="rounded-xl bg-gradient-to-br from-sky-950/80 to-emerald-950/50 border border-blue-300/30 p-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-green-700 flex items-center gap-1.5">
                <Radio size={12} className="text-green-700 animate-pulse" />
                {stationData.satellite}
              </span>
              <span className="text-[9px] font-mono text-blue-700 bg-sky-900/50 px-1.5 py-0.5 rounded border border-blue-300/50">
                {stationData.temp}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-textMain mt-1 truncate">
              {stationData.name}
            </p>
            <p className="text-[9px] text-textSecondary truncate">{stationData.coords}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="lg:ml-64 flex-1 flex flex-col">
        {/* Top Operational Bar */}
        <header className="sticky top-0 z-30 h-16 bg-blue-50/90 backdrop-blur-md border-b border-blue-200/40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <Compass className="text-blue-700" size={22} />
              <span className="font-bold text-sm tracking-wider text-slate-800">POLARIS</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-700">
                POLAR OPERATIONS COMMAND / {stationData.name}
              </p>
              <h1 className="font-extrabold text-base lg:text-lg text-textMain tracking-wide">
                {page}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Backend Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 border border-softBeige/50 bg-warmBeige px-3 py-1.5 rounded-full">
              <span className={`w-2 h-2 rounded-full ${
                backendStatus === "ONLINE" ? "bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" :
                backendStatus === "CONNECTING" ? "bg-yellow-400" : "bg-red-500"
              }`} />
              <span className="text-[10px] font-mono text-textSecondary">
                API: {backendStatus}
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative hidden md:flex items-center">
              <Search size={14} className="absolute left-3 text-blue-600" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search shipments, assets, crew..."
                className="bg-blue-50 border border-blue-300/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-sky-500/60 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 w-52 transition-all"
              />
            </div>

            {/* Weather pill in Blue/Green */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-950 to-emerald-950 border border-blue-300/50 text-xs">
              <CloudSnow size={14} className="text-blue-800" />
              <span className="text-slate-800 font-mono font-bold">{stationData.temp}</span>
              <span className="text-textSecondary">|</span>
              <Wind size={14} className="text-green-800" />
              <span className="text-emerald-200 font-mono text-[11px]">{stationData.wind}</span>
            </div>

            {/* Quick Emergency Indicator */}
            {incidentActive && (
              <button
                onClick={() => setPage("Emergency Response")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/30 via-orange-600/30 to-amber-600/30 border border-red-500/50 text-red-200 text-xs font-bold hover:bg-red-600/40 transition-all animate-pulse"
              >
                <ShieldAlert size={14} className="text-red-400" />
                <span className="hidden sm:inline">ACTIVE INCIDENT</span>
              </button>
            )}

            {/* Mode badge */}
            <span className="hidden lg:flex px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-green-800 text-[10px] font-bold tracking-wider items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE SYSTEM
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 text-textSecondary hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-900/40"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-4 lg:p-7 max-w-[1600px] w-full mx-auto space-y-6 flex-1">
          {page === "Command Center" && (
            <CommandCenterView
              station={station}
              stationData={stationData}
              setPage={setPage}
              expeditions={expeditions}
              cargoList={cargoList}
              inventoryList={inventoryList}
              personnelList={personnelList}
              assetList={assetList}
              sarDispatched={sarDispatched}
            />
          )}

          {page === "Expeditions" && (
            <ExpeditionsView
              expeditions={expeditions}
              setExpeditions={setExpeditions}
              station={station}
              showToast={showToast}
            />
          )}

          {page === "Cargo & Logistics" && (
            <CargoView
              cargoList={cargoList}
              setCargoList={setCargoList}
              searchQuery={query}
              showToast={showToast}
            />
          )}

          {page === "Inventory" && (
            <InventoryView
              inventoryList={inventoryList}
              onRestock={handleRestock}
              showToast={showToast}
            />
          )}

          {page === "Personnel Movement" && (
            <PersonnelView
              personnelList={personnelList}
              onCheckIn={handleCheckInPersonnel}
              showToast={showToast}
            />
          )}

          {page === "Asset Management" && (
            <AssetsView
              assetList={assetList}
              onService={handleServiceAsset}
              showToast={showToast}
            />
          )}

          {page === "Emergency Response" && (
            <EmergencyView
              incidentActive={incidentActive}
              setIncidentActive={setIncidentActive}
              sarDispatched={sarDispatched}
              onDispatchSAR={handleDispatchSAR}
              sarStatusText={sarStatusText}
              sarTeam={sarTeam}
              setSarTeam={setSarTeam}
              showToast={showToast}
            />
          )}

          {page === "AI Polar Copilot" && (
            <CopilotView
              history={copilotHistory}
              input={copilotInput}
              setInput={setCopilotInput}
              onSend={handleAskCopilot}
            />
          )}

          {page === "Reports" && (
            <ReportsView
              readinessData={READINESS_MONTHLY}
              supplyBurnData={SUPPLY_BURN_DATA}
              showToast={showToast}
            />
          )}

          {page === "Settings" && (
            <SettingsView
              station={station}
              setStation={setStation}
              showToast={showToast}
            />
          )}

          {page === "Mission Pipeline" && (
            <PipelineModule />
          )}
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 1: COMMAND CENTER
// -------------------------------------------------------------
function CommandCenterView({
  station,
  stationData,
  setPage,
  expeditions,
  cargoList,
  inventoryList,
  personnelList,
  assetList,
  sarDispatched,
}: {
  station: StationKey;
  stationData: any;
  setPage: (p: PageKey) => void;
  expeditions: ExpeditionItem[];
  cargoList: CargoItem[];
  inventoryList: InventoryItem[];
  personnelList: PersonnelItem[];
  assetList: AssetItem[];
  sarDispatched: boolean;
}) {
  const criticalCargo = cargoList.filter(c => c.status === "Delayed" || c.priority === "CRITICAL");
  const overduePeople = personnelList.filter(p => p.status === "OVERDUE");
  const lowInventory = inventoryList.filter(i => i.risk === "HIGH RISK");
  const warningAssets = assetList.filter(a => a.status !== "OPERATIONAL");

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl glass-blue border border-sky-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-xs uppercase tracking-widest font-bold text-green-700">
              OPERATIONAL OVERVIEW · {stationData.name}
            </p>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-textMain mt-1">
            Polar Operations Sector{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">
              {station}
            </span>
          </h2>
          <p className="text-xs text-slate-800/70 mt-1">
            {stationData.region} · Coordinates: {stationData.coords} · Satlink: {stationData.satellite}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPage("Emergency Response")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-textMain font-bold text-xs shadow-lg shadow-sky-900/50 transition-all"
          >
            <ShieldAlert size={16} />
            EMERGENCY PROTOCOL
          </button>
          <button
            onClick={() => setPage("AI Polar Copilot")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-green text-green-800 border border-emerald-400/40 hover:bg-emerald-950/60 font-bold text-xs transition-all"
          >
            <Cpu size={16} />
            AI RISK CONSULT
          </button>
        </div>
      </div>

      {/* 4 Metric Hero Cards in Blue & Green */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Active Expeditions"
          value={expeditions.filter(e => e.status === "ACTIVE").length.toString().padStart(2, "0")}
          sub="3 Arctic/Antarctic missions"
          icon={Route}
          accent="blue"
        />
        <MetricCard
          label="Cargo In Transit"
          value={cargoList.filter(c => c.status === "In Transit").length.toString().padStart(2, "0")}
          sub={`${criticalCargo.length} high priority parcels`}
          icon={Package}
          accent="green"
        />
        <MetricCard
          label="Field Personnel"
          value={personnelList.length.toString().padStart(2, "0")}
          sub={`${overduePeople.length} require check-in`}
          icon={Users}
          accent={overduePeople.length > 0 ? "blue" : "green"}
        />
        <MetricCard
          label="Operational Readiness"
          value={`${stationData.readiness}%`}
          sub="Full supply line verified"
          icon={Gauge}
          accent="green"
        />
      </div>

      {/* Central Map & Readiness Grid */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Polar Interactive Map */}
        <div className="xl:col-span-2 glass rounded-2xl p-5 border border-sky-500/25 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="font-extrabold text-base text-textMain flex items-center gap-2">
                <Compass className="text-blue-700" size={18} />
                Polar Logistics & Asset Radar Map
              </h3>
              <p className="text-[11px] text-blue-700/70">
                Real-time geospatial tracking across Antarctic stations and Arctic outposts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-900/50 border border-sky-400/40 text-blue-800 text-[10px] font-bold">
                MAPPING SYSTEM V2.6
              </span>
            </div>
          </div>

          {/* Map canvas */}
          <div className="map-bg h-[300px] lg:h-[340px] rounded-xl relative flex items-center justify-center">
            {/* Bharati Node */}
            <div className="absolute left-[28%] top-[38%] group cursor-pointer">
              <div className="relative">
                <MapPin className="text-blue-700 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-bounce" size={26} />
                <span className="absolute -left-4 top-7 text-[10px] font-black bg-sky-950/90 text-slate-800 px-2 py-0.5 rounded border border-sky-400/40 whitespace-nowrap">
                  BHARATI (-34°C)
                </span>
              </div>
            </div>

            {/* Maitri Node */}
            <div className="absolute left-[62%] top-[56%] group cursor-pointer">
              <div className="relative">
                <MapPin className="text-green-700 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" size={26} />
                <span className="absolute -left-3 top-7 text-[10px] font-black bg-emerald-950/90 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/40 whitespace-nowrap">
                  MAITRI (-39°C)
                </span>
              </div>
            </div>

            {/* Himadri Node */}
            <div className="absolute left-[78%] top-[24%] group cursor-pointer">
              <div className="relative">
                <MapPin className="text-blue-700 drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]" size={24} />
                <span className="absolute -left-4 top-7 text-[10px] font-black bg-sky-950/90 text-slate-800 px-2 py-0.5 rounded border border-sky-400/40 whitespace-nowrap">
                  HIMADRI (-18°C)
                </span>
              </div>
            </div>

            {/* Vikram Missing Ping */}
            <div className="absolute left-[44%] top-[48%]">
              <div className="relative">
                <CircleDot className="text-red-400 animate-ping" size={22} />
                <span className="absolute left-6 top-0 text-[9px] font-bold bg-red-950/90 text-red-200 px-1.5 py-0.5 rounded border border-red-500/50 whitespace-nowrap">
                  SOS: VIKRAM RAO (14.2 km)
                </span>
              </div>
            </div>

            {/* Connecting Supply Lines */}
            <div className="map-line-blue w-64 left-[30%] top-[42%] rotate-[18deg]" />
            <div className="map-line-green w-48 left-[45%] top-[50%] rotate-[-22deg]" />
            <div className="map-line-blue w-52 left-[64%] top-[40%] rotate-[-45deg]" />

            {/* Map Telemetry Badges */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-sky-950/80 border border-sky-500/30 text-blue-700 text-[10px] font-semibold">
                  3 ACTIVE STATIONS
                </span>
                <span className="px-2 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-green-800 text-[10px] font-semibold">
                  18 TELEMETRY NODES
                </span>
              </div>
              <div className="text-[10px] text-slate-800/80 bg-black/40 px-2 py-1 rounded border border-blue-200/40">
                Satellite Ping: 12ms · Grid Link: Active
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Radial & Breakdown in Blue & Green */}
        <div className="glass-blue rounded-2xl p-5 border border-sky-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-blue-900">Mission Readiness</h3>
              <p className="text-[11px] text-blue-700/70">Aggregate logistics & life-support</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-green-700">
              <Gauge size={20} />
            </div>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="relative w-44 h-44 rounded-full border-[14px] border-sky-950 flex items-center justify-center shadow-inner">
              <div
                className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-cyan-400 border-r-emerald-400 border-b-cyan-400"
                style={{ transform: "rotate(45deg)" }}
              />
              <div className="text-center z-10">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300">
                  {stationData.readiness}%
                </div>
                <div className="text-[10px] font-bold text-green-700 tracking-widest mt-0.5">
                  OPTIMAL
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <ReadinessRow label="Personnel Deployed" value={98} color="green" />
            <ReadinessRow label="Cargo Supply Pipeline" value={91} color="blue" />
            <ReadinessRow label="Inventory Burn Buffer" value={82} color="green" />
            <ReadinessRow label="Asset & Power Core Health" value={88} color="blue" />
          </div>
        </div>
      </div>

      {/* Operational Alerts & Live Activity Stream */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="glass rounded-2xl p-5 border border-sky-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-blue-600" size={18} />
              <h3 className="font-bold text-sm text-blue-900">Critical Operational Alerts</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-900/60 border border-sky-400/30 text-blue-700 text-[10px] font-bold">
              3 ACTION ITEMS
            </span>
          </div>

          <div className="space-y-2.5">
            <AlertItem
              icon={AlertTriangle}
              title="Personnel check-in overdue: Vikram Rao"
              desc="Last ping 48 mins ago · Ridge Alpha (14.2 km) · SAR standby"
              accent="blue"
              actionText="Inspect SOS"
              onAction={() => setPage("Emergency Response")}
            />
            <AlertItem
              icon={Package}
              title="Critical cargo delayed: ANT-1024 Generator Pump"
              desc="MV Vasiliy Golovnin delayed by pack ice · ETA 18 Dec"
              accent="green"
              actionText="View Cargo"
              onAction={() => setPage("Cargo & Logistics")}
            />
            <AlertItem
              icon={Flame}
              title="Diesel inventory stockout alert in 16.7 days"
              desc="Daily burn 504 L · Resupply convoy Beta staged in transit"
              accent="blue"
              actionText="Open Forecast"
              onAction={() => setPage("Inventory")}
            />
          </div>
        </div>

        {/* Live Operational Log Feed */}
        <div className="glass-green rounded-2xl p-5 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-green-700" size={18} />
              <h3 className="font-bold text-sm text-blue-900">Live Station Telemetry Feed</h3>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-green-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <LogItem
              time="11:42:10"
              station="Bharati"
              msg="Satellite telemetry handshake completed with IRIDIUM-NEXT."
              tone="green"
            />
            <LogItem
              time="11:38:04"
              station="Maitri"
              msg="Blizzard wind velocity increased to 46 knots. Surface traverse curfew active."
              tone="blue"
            />
            <LogItem
              time="11:31:52"
              station="Bharati"
              msg="Generator GEN-07 operating temperature stabilized at 84°C."
              tone="green"
            />
            <LogItem
              time="11:20:18"
              station="Himadri"
              msg="Oceanographic glider Alpha deployed into Kongsfjorden fjord."
              tone="blue"
            />
            <LogItem
              time="11:14:02"
              station="SAR"
              msg="Emergency locator beacon broadcast detected on 406 MHz (Vikram Rao)."
              tone="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 2: EXPEDITIONS
// -------------------------------------------------------------
function ExpeditionsView({
  expeditions,
  setExpeditions,
  station,
  showToast,
}: {
  expeditions: ExpeditionItem[];
  setExpeditions: React.Dispatch<React.SetStateAction<ExpeditionItem[]>>;
  station: StationKey;
  showToast: (m: string) => void;
}) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PLANNED" | "COMPLETED">("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStation, setNewStation] = useState("Bharati Station");
  const [newCrew, setNewCrew] = useState("20");
  const [newLead, setNewLead] = useState("");
  const [newObj, setNewObj] = useState("");

  const filtered = useMemo(() => {
    if (filter === "ALL") return expeditions;
    return expeditions.filter(e => e.status === filter);
  }, [expeditions, filter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newExp: ExpeditionItem = {
      id: `EXP-0${expeditions.length + 1}`,
      name: newName,
      station: newStation,
      status: "ACTIVE",
      crew: parseInt(newCrew) || 12,
      readiness: 85,
      cargo: "80%",
      duration: "Dec 2026 – Mar 2027",
      lead: newLead || "Lead Polar Researcher",
      objective: newObj || "Polar environmental & ice monitoring mission.",
    };

    setExpeditions(prev => [newExp, ...prev]);
    setModalOpen(false);
    setNewName("");
    setNewLead("");
    setNewObj("");
    showToast(`New Expedition ${newName} registered successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Expedition Missions & Operations</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Organize scientific missions, assign polar stations, track readiness milestones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-blue-50 p-1 rounded-xl border border-blue-300/40 text-xs">
            {(["ALL", "ACTIVE", "PLANNED", "COMPLETED"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filter === tab
                    ? "bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain shadow"
                    : "text-textSecondary hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-textMain text-xs font-black shadow-lg shadow-sky-900/40"
          >
            <Plus size={16} />
            NEW EXPEDITION
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5">
        {filtered.map(exp => (
          <div
            key={exp.id}
            className="glass rounded-2xl p-5 border border-sky-500/20 hover:border-sky-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${
                      exp.status === "ACTIVE"
                        ? "bg-emerald-950/80 text-green-800 border-emerald-400/40"
                        : exp.status === "PLANNED"
                        ? "bg-sky-950/80 text-blue-700 border-sky-400/40"
                        : "bg-slate-100/80 text-textSecondary border-slate-600"
                    }`}
                  >
                    {exp.status}
                  </span>
                  <h3 className="text-lg font-black text-textMain mt-2.5">{exp.name}</h3>
                  <p className="text-xs text-blue-800 font-semibold">{exp.station}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-900/40 text-blue-700 border border-blue-300/30">
                  <Route size={20} />
                </div>
              </div>

              <p className="text-xs text-textSecondary mt-3 line-clamp-2 leading-relaxed">
                {exp.objective}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-blue-200/40 text-xs">
                <MiniBox label="Commander" value={exp.lead} />
                <MiniBox label="Crew Size" value={`${exp.crew} personnel`} />
                <MiniBox label="Cargo Ready" value={exp.cargo} />
                <MiniBox label="Duration" value={exp.duration} />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-blue-200/30">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-blue-700 font-semibold">Mission Operational Readiness</span>
                <span className="font-mono text-green-800 font-bold">{exp.readiness}%</span>
              </div>
              <div className="h-2 rounded-full bg-sky-950 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400"
                  style={{ width: `${exp.readiness}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Expedition Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-blue rounded-2xl p-6 shadow-2xl border border-sky-400/40">
            <div className="flex items-center justify-between pb-4 border-b border-blue-300/50">
              <h3 className="font-extrabold text-lg text-textMain flex items-center gap-2">
                <Plus className="text-blue-700" />
                Plan New Polar Expedition
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-textSecondary hover:text-blue-900"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Expedition Code & Name
                </label>
                <input
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. ISEA-2028 Continental Deep Core"
                  className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3.5 py-2.5 text-sm text-textMain outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Station Hub
                  </label>
                  <select
                    value={newStation}
                    onChange={e => setNewStation(e.target.value)}
                    className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3 py-2.5 text-xs text-textMain outline-none"
                  >
                    <option value="Bharati Station">Bharati Station (Antarctica)</option>
                    <option value="Maitri Station">Maitri Station (Antarctica)</option>
                    <option value="Himadri Station">Himadri Station (Arctic)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Crew Size
                  </label>
                  <input
                    type="number"
                    value={newCrew}
                    onChange={e => setNewCrew(e.target.value)}
                    className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3 py-2.5 text-xs text-textMain outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Mission Lead / Principal Investigator
                </label>
                <input
                  value={newLead}
                  onChange={e => setNewLead(e.target.value)}
                  placeholder="e.g. Dr. A. Sharma"
                  className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3.5 py-2.5 text-xs text-textMain outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Primary Scientific Objective
                </label>
                <textarea
                  rows={3}
                  value={newObj}
                  onChange={e => setNewObj(e.target.value)}
                  placeholder="Outline mission scope, survey equipment, and target timeline..."
                  className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3.5 py-2.5 text-xs text-textMain outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-300/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-blue-300 text-blue-700 hover:bg-sky-950 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain font-black text-xs shadow-lg"
                >
                  SAVE & REGISTER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 3: CARGO & LOGISTICS
// -------------------------------------------------------------
function CargoView({
  cargoList,
  setCargoList,
  searchQuery,
  showToast,
}: {
  cargoList: CargoItem[];
  setCargoList: React.Dispatch<React.SetStateAction<CargoItem[]>>;
  searchQuery: string;
  showToast: (m: string) => void;
}) {
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newCat, setNewCat] = useState<CargoItem["category"]>("Fuel");
  const [newDest, setNewDest] = useState("Bharati");
  const [newPriority, setNewPriority] = useState<CargoItem["priority"]>("HIGH");
  const [newWeight, setNewWeight] = useState("500 kg");

  const filtered = useMemo(() => {
    return cargoList.filter(item => {
      const matchQuery =
        !searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dest.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCat === "ALL" || item.category === filterCat;
      return matchQuery && matchCat;
    });
  }, [cargoList, searchQuery, filterCat]);

  const handleAddCargo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const newEntry: CargoItem = {
      id: `ANT-${Math.floor(1000 + Math.random() * 9000)}`,
      item: newItem,
      category: newCat,
      dest: newDest,
      status: "In Transit",
      eta: "26 Dec 2026",
      priority: newPriority,
      weight: newWeight,
      carrier: "Heavy Polar Convoy Alpha",
    };

    setCargoList(prev => [newEntry, ...prev]);
    setModalOpen(false);
    setNewItem("");
    showToast(`Shipment ${newEntry.id} logged into Polar Supply Manifest.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Cargo & Supply Chain Logistics</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Cold-chain tracking, heavy traverse shipments, icebreaker air-drops
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-blue-50 p-1 rounded-xl border border-blue-300/40 text-xs">
            {["ALL", "Fuel", "Medical", "Rations", "Spares", "Science"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterCat === cat
                    ? "bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain shadow"
                    : "text-textSecondary hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain text-xs font-black shadow-lg shadow-sky-900/40"
          >
            <Plus size={16} />
            DISPATCH SHIPMENT
          </button>
        </div>
      </div>

      {/* Cargo Table */}
      <div className="glass rounded-2xl overflow-hidden border border-sky-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50 border-b border-blue-300/40 text-[10px] uppercase font-bold tracking-widest text-blue-700">
              <tr>
                <th className="py-3.5 px-4">Shipment ID</th>
                <th className="py-3.5 px-4">Manifest Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">ETA</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Carrier / Vessel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-900/30">
              {filtered.map(x => (
                <tr key={x.id} className="hover:bg-sky-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-800">{x.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-900">{x.item}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-sky-900/50 text-slate-800 font-mono text-[10px] border border-blue-300/40">
                      {x.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-textSecondary">{x.dest}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        x.status === "Delivered"
                          ? "bg-emerald-950/80 text-green-800 border-emerald-400/40"
                          : x.status === "Delayed"
                          ? "bg-red-950/80 text-red-300 border-red-400/40"
                          : "bg-sky-950/80 text-blue-700 border-sky-400/40"
                      }`}
                    >
                      {x.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-textSecondary">{x.eta}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        x.priority === "CRITICAL"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : x.priority === "HIGH"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-sky-500/20 text-blue-700 border border-sky-500/30"
                      }`}
                    >
                      {x.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-textSecondary text-[11px]">{x.carrier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Timeline & Route Progress */}
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 border border-sky-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-textMain text-sm">
              Critical Shipment Tracking · ANT-1024 (Cooling Pump)
            </h3>
            <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-400/40 text-[10px] font-bold">
              DELAYED BY SEA ICE
            </span>
          </div>
          <div className="space-y-4 mt-4">
            {[
              { title: "Loaded at Cape Town Logistics Port", time: "08 Dec · Cleared Customs", done: true },
              { title: "Departed aboard Icebreaker MV Vasiliy Golovnin", time: "11 Dec · Southern Ocean Transit", done: true },
              { title: "Heavy Pack-Ice Advisory Encountered", time: "14 Dec · Speed reduced to 4 knots", done: true },
              { title: "Estimated Ice Shelf Arrival & Offload", time: "18 Dec · Helicopter sling planned", done: false },
            ].map((step, i) => (
              <div key={step.title} className="flex items-start gap-3">
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${
                    step.done
                      ? "bg-emerald-500/20 border-emerald-400 text-green-700"
                      : "bg-sky-950 border-blue-400 text-sky-600"
                  }`}
                >
                  {step.done ? <Check size={10} /> : <CircleDot size={10} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-900">{step.title}</p>
                  <p className="text-[10px] text-blue-700/70">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-blue rounded-2xl p-5 border border-sky-500/30 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-textMain text-sm">Polar Supply Route Corridors</h3>
            <p className="text-[11px] text-blue-700/70 mt-1">
              Active sea routes and ski-equipped aircraft corridors
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-sky-950/60 border border-blue-300/40">
                <p className="text-[10px] uppercase font-bold text-blue-600">Cape Town — Bharati</p>
                <p className="text-base font-bold text-textMain mt-1">4,380 nm</p>
                <p className="text-[10px] text-green-800">Transit: 12-14 days</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-950/60 border border-blue-300/40">
                <p className="text-[10px] uppercase font-bold text-green-700">Maitri — Bharati Traverse</p>
                <p className="text-base font-bold text-textMain mt-1">3,120 km</p>
                <p className="text-[10px] text-blue-700">Over-ice Sledge: 8 days</p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 mt-4 flex items-center gap-3">
            <ShieldCheck className="text-green-700 flex-shrink-0" size={20} />
            <p className="text-xs text-emerald-200">
              Cold-chain compliance sensors report 100% stable temperatures across all medical & biological shipments.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-blue rounded-2xl p-6 shadow-2xl border border-sky-400/40">
            <div className="flex items-center justify-between pb-4 border-b border-blue-300/50">
              <h3 className="font-extrabold text-lg text-blue-900">Log Supply Shipment</h3>
              <button onClick={() => setModalOpen(false)} className="text-textSecondary hover:text-blue-900">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCargo} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Item Description
                </label>
                <input
                  required
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  placeholder="e.g. Winter Survival Rations (High Protein)"
                  className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3.5 py-2.5 text-sm text-textMain outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCat}
                    onChange={e => setNewCat(e.target.value as any)}
                    className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3 py-2.5 text-xs text-textMain outline-none"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Medical">Medical</option>
                    <option value="Rations">Rations</option>
                    <option value="Spares">Spares</option>
                    <option value="Science">Science</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3 py-2.5 text-xs text-textMain outline-none"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Target Station
                  </label>
                  <select
                    value={newDest}
                    onChange={e => setNewDest(e.target.value)}
                    className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3 py-2.5 text-xs text-textMain outline-none"
                  >
                    <option value="Bharati">Bharati</option>
                    <option value="Maitri">Maitri</option>
                    <option value="Himadri">Himadri</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Cargo Weight
                  </label>
                  <input
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                    className="w-full bg-blue-50 border border-blue-300/60 rounded-xl px-3 py-2.5 text-xs text-textMain outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-blue-300/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-blue-300 text-blue-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain font-black text-xs"
                >
                  DISPATCH CARGO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 4: INVENTORY & PREDICTIVE RESUPPLY
// -------------------------------------------------------------
function InventoryView({
  inventoryList,
  onRestock,
  showToast,
}: {
  inventoryList: InventoryItem[];
  onRestock: (id: string) => void;
  showToast: (m: string) => void;
}) {
  const [crewMultiplier, setCrewMultiplier] = useState(42);
  const [stormDays, setStormDays] = useState(5);
  const [aiForecastActive, setAiForecastActive] = useState(false);

  // Dynamic calculation based on crew size
  const simulatedBurnRate = useMemo(() => {
    return (crewMultiplier * 12).toFixed(0);
  }, [crewMultiplier]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Inventory & AI Predictive Resupply</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Track station stocks, calculate burn curves, and simulate harsh weather contingencies
          </p>
        </div>
        <button
          onClick={() => {
            setAiForecastActive(true);
            showToast("AI Resupply Model generated for 90-day winter cycle!");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-textMain text-xs font-black shadow-lg shadow-sky-900/40"
        >
          <Cpu size={16} />
          RUN AI PREDICTION ENGINE
        </button>
      </div>

      {/* Stock Cards Grid in Blue & Green */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {inventoryList.map(item => {
          const percent = Math.round((item.currentUnits / item.maxUnits) * 100);
          return (
            <div
              key={item.id}
              className="glass rounded-2xl p-5 border border-sky-500/20 flex flex-col justify-between hover:border-sky-400/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-800 uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-textMain mt-1">{item.name}</h3>
                    <p className="text-xs text-slate-800/70 font-mono mt-0.5">
                      {item.currentUnits.toLocaleString()} / {item.maxUnits.toLocaleString()} units
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      item.risk === "HEALTHY"
                        ? "bg-emerald-950/80 text-green-800 border-emerald-400/40"
                        : item.risk === "WATCH"
                        ? "bg-sky-950/80 text-blue-700 border-sky-400/40"
                        : "bg-red-950/80 text-red-300 border-red-400/40"
                    }`}
                  >
                    {item.risk}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-textSecondary">Current Stock Level</span>
                    <span className="font-mono text-blue-800 font-bold">{percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent < 30
                          ? "bg-gradient-to-r from-red-500 to-amber-500"
                          : percent < 60
                          ? "bg-gradient-to-r from-sky-500 to-cyan-400"
                          : "bg-gradient-to-r from-cyan-400 to-emerald-400"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-blue-200/40 text-xs">
                  <div className="p-2 rounded-lg bg-sky-950/50 border border-blue-300/40">
                    <p className="text-[9px] uppercase font-bold text-blue-600">Days Remaining</p>
                    <p className="text-base font-extrabold text-textMain mt-0.5">{item.days} days</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                    <p className="text-[9px] uppercase font-bold text-green-700">Daily Burn</p>
                    <p className="text-base font-extrabold text-emerald-200 mt-0.5">
                      {item.burnDaily} / day
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200/30">
                <button
                  onClick={() => onRestock(item.id)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-600/30 to-emerald-600/30 hover:from-sky-600 hover:to-emerald-600 border border-sky-400/30 text-textMain text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  QUICK REQUISITION RESTOCK
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Simulation Parameters & AI Forecast */}
      <div className="glass-blue rounded-2xl p-6 border border-sky-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-lg text-textMain flex items-center gap-2">
              <Cpu className="text-blue-700" />
              Dynamic Station Consumption Simulator
            </h3>
            <p className="text-xs text-blue-700/80">
              Simulate stockout curves based on crew count adjustments and prolonged blizzard lockdowns
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-green-800 border border-emerald-400/30 text-[10px] font-bold">
            MONTE CARLO SIMULATOR READY
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-3">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-300/50 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Station Crew Personnel Count</span>
              <span className="font-mono text-blue-800">{crewMultiplier} crew</span>
            </div>
            <input
              type="range"
              min={20}
              max={80}
              value={crewMultiplier}
              onChange={e => setCrewMultiplier(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <p className="text-[10px] text-textSecondary">
              Simulated ration & energy consumption:{" "}
              <span className="text-green-800 font-bold">{simulatedBurnRate} units/day</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-300/50 space-y-2">
            <div className="flex justify-between text-xs font-bold text-emerald-200">
              <span>Projected Blizzard Lockdown Duration</span>
              <span className="font-mono text-green-800">{stormDays} days</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={stormDays}
              onChange={e => setStormDays(parseInt(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <p className="text-[10px] text-textSecondary">
              Heating reserve requirement factor:{" "}
              <span className="text-blue-800 font-bold">+{stormDays * 4}% fuel load</span>
            </p>
          </div>
        </div>

        {/* AI Forecast Result Box */}
        {(aiForecastActive || crewMultiplier > 45) && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950 via-[#051c2c] to-emerald-950 border border-cyan-400/40 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-blue-800 mt-1">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-widest">
                AI PREDICTIVE ADVISORY
              </span>
              <h4 className="text-base font-black text-textMain mt-1">
                Diesel fuel depletion window shifts to 14.1 days with {crewMultiplier} active crew.
              </h4>
              <p className="text-xs text-slate-800/80 mt-1 leading-relaxed">
                Under {stormDays} days of blizzard conditions, heating loads will increase generator fuel burn by 18%.
                Recommended Protocol: Deploy convoy Beta bladders before Day 10 of current weather window.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 5: PERSONNEL MOVEMENT & SAFETY
// -------------------------------------------------------------
function PersonnelView({
  personnelList,
  onCheckIn,
  showToast,
}: {
  personnelList: PersonnelItem[];
  onCheckIn: (id: string) => void;
  showToast: (m: string) => void;
}) {
  const overdueCount = personnelList.filter(p => p.status === "OVERDUE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Personnel Movement & Field Safety</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Biometric vitals, GPS satellite locator tags, automated 30-min check-in monitors
          </p>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 ? (
            <span className="px-3 py-1 rounded-full bg-red-950 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={14} />
              {overdueCount} OVERDUE CHECK-IN
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-green-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              ALL PERSONNEL SECURE
            </span>
          )}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Personnel List */}
        <div className="xl:col-span-2 glass rounded-2xl p-5 border border-sky-500/20 space-y-3">
          <h3 className="font-extrabold text-sm text-textMain mb-2">Live Personnel Roster</h3>
          {personnelList.map(person => (
            <div
              key={person.id}
              className="p-4 rounded-xl bg-sky-950/30 border border-blue-200/40 hover:border-sky-500/40 transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-[220px]">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    person.status === "OVERDUE"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : person.status === "FIELD"
                      ? "bg-sky-500/20 text-blue-800 border border-sky-500/40"
                      : "bg-emerald-500/20 text-green-800 border border-emerald-500/40"
                  }`}
                >
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="font-black text-sm text-blue-900">{person.name}</h4>
                  <p className="text-[11px] text-blue-700/80">{person.role}</p>
                  <p className="text-[10px] text-textSecondary mt-0.5">{person.loc}</p>
                </div>
              </div>

              {/* Vitals in Blue & Green */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-center">
                  <span className="text-[9px] text-textSecondary block">HEART RATE</span>
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    <HeartPulse size={12} className="text-green-700" />
                    {person.heartRate} bpm
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-textSecondary block">BODY TEMP</span>
                  <span className="font-bold text-blue-700">{person.temp}</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-textSecondary block">BEACON BATTERY</span>
                  <span className="font-bold text-blue-800">{person.battery}%</span>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      person.status === "ACTIVE"
                        ? "bg-emerald-950/80 text-green-800 border-emerald-400/40"
                        : person.status === "FIELD"
                        ? "bg-sky-950/80 text-blue-700 border-sky-400/40"
                        : "bg-red-950/80 text-red-300 border-red-400/40 animate-pulse"
                    }`}
                  >
                    {person.status}
                  </span>
                  <p className="text-[9px] text-textSecondary mt-1">{person.check}</p>
                </div>

                {person.status === "OVERDUE" && (
                  <button
                    onClick={() => onCheckIn(person.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-textMain text-[10px] font-black shadow-md flex items-center gap-1"
                  >
                    <UserCheck size={14} />
                    PING CHECK-IN
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Personnel Radar Map */}
        <div className="glass-blue rounded-2xl p-5 border border-sky-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-blue-900">Personnel Spatial Locator</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-green-800 text-[10px] font-bold border border-emerald-500/30">
                GPS LOCK: 100%
              </span>
            </div>
            <p className="text-[11px] text-blue-700/70 mt-1">
              Relative to Bharati Station Main Geodesic Dome
            </p>
          </div>

          <div className="map-bg h-[300px] rounded-xl relative my-4 flex items-center justify-center">
            {/* Center Station */}
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
            <span className="absolute text-[10px] font-black text-slate-800 mt-8">BASE</span>

            {/* Field members */}
            {personnelList.map((p, idx) => {
              const leftPercent = 20 + (idx * 14) % 70;
              const topPercent = 25 + (idx * 16) % 60;
              return (
                <div
                  key={p.id}
                  className="absolute"
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                >
                  <div className="relative group cursor-pointer">
                    <MapPin
                      size={20}
                      className={p.status === "OVERDUE" ? "text-red-400 animate-bounce" : "text-green-700"}
                    />
                    <div className="absolute left-5 -top-1 hidden group-hover:block bg-black/90 p-1.5 rounded border border-sky-500 text-[9px] whitespace-nowrap z-20">
                      <p className="font-bold text-blue-900">{p.name}</p>
                      <p className="text-blue-700">{p.loc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-300/40 text-xs space-y-1">
            <div className="flex justify-between text-textSecondary">
              <span>Automatic Safety Ping Interval</span>
              <span className="font-mono text-blue-800">Every 15 min</span>
            </div>
            <div className="flex justify-between text-textSecondary">
              <span>Emergency Satellite Gateway</span>
              <span className="font-mono text-green-700">COSPAS-SARSAT 406</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 6: ASSET MANAGEMENT & TELEMETRY
// -------------------------------------------------------------
function AssetsView({
  assetList,
  onService,
  showToast,
}: {
  assetList: AssetItem[];
  onService: (id: string) => void;
  showToast: (m: string) => void;
}) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>("GEN-07");
  const selectedAsset = assetList.find(a => a.id === selectedAssetId) || assetList[0];
  const telemetryData = TELEMETRY_HISTORY[selectedAssetId] || TELEMETRY_HISTORY["GEN-07"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Asset Equipment & Telemetry Telematics</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Real-time mechanical health, RPM telemetry, thermal stress curves
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-950 to-emerald-950 border border-sky-500/40 text-xs font-bold text-blue-800 flex items-center gap-2">
          <Activity size={14} className="text-green-700" />
          6 CRITICAL UNITS MONITORED
        </span>
      </div>

      {/* Asset Grid in Blue & Green */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {assetList.map(asset => (
          <div
            key={asset.id}
            onClick={() => setSelectedAssetId(asset.id)}
            className={`cursor-pointer rounded-2xl p-5 transition-all border ${
              selectedAssetId === asset.id
                ? "glass-blue border-cyan-400 shadow-lg shadow-cyan-900/40"
                : "glass border-sky-500/20 hover:border-sky-400/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-800 uppercase">
                  {asset.id} · {asset.type}
                </span>
                <h3 className="text-base font-black text-textMain mt-1">{asset.name}</h3>
                <p className="text-xs text-slate-800/70 mt-0.5">{asset.loc}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  asset.status === "OPERATIONAL"
                    ? "bg-emerald-950/80 text-green-800 border-emerald-400/40"
                    : "bg-amber-950/80 text-amber-300 border-amber-400/40"
                }`}
              >
                {asset.status}
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-textSecondary uppercase font-bold">Health Score</p>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300">
                  {asset.health}%
                </div>
              </div>
              <div className="text-right text-xs font-mono">
                <span className="text-[10px] text-textSecondary block">Core Temp</span>
                <span className="font-bold text-blue-700">{asset.temp}°C</span>
              </div>
            </div>

            <div className="mt-3 h-2 rounded-full bg-sky-950 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  asset.health > 80
                    ? "bg-gradient-to-r from-sky-400 to-emerald-400"
                    : "bg-gradient-to-r from-amber-500 to-red-400"
                }`}
                style={{ width: `${asset.health}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-textSecondary mt-4 pt-3 border-t border-blue-200/30">
              <span>Runtime: {asset.runtime}</span>
              <span className="text-blue-800 font-semibold">{asset.due}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Asset Detailed Telemetry Visualizer */}
      <div className="glass-blue rounded-2xl p-6 border border-sky-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
              LIVE TELEMETRY STREAM
            </span>
            <h3 className="text-xl font-black text-textMain mt-1">
              {selectedAsset.name} ({selectedAsset.id})
            </h3>
            <p className="text-xs text-slate-800/70">
              Installed at {selectedAsset.loc} · Maintenance: {selectedAsset.due}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onService(selectedAsset.id)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-textMain font-bold text-xs shadow-md"
            >
              PERFORM PREVENTATIVE SERVICE
            </button>
          </div>
        </div>

        {/* 4 Stats in Blue & Green */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniBox label="Operating Temperature" value={`${selectedAsset.temp}°C`} />
          <MiniBox label="Telemetry Telematics" value="ONLINE · 100 Hz" />
          <MiniBox label="Fuel / Reserve Level" value={`${selectedAsset.fuel}%`} />
          <MiniBox label="Reliability Index" value={`${selectedAsset.health}/100`} />
        </div>

        {/* Recharts Line Chart */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wider">
            6-Hour Continuous Vibration & Thermal Performance Curve
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid stroke="#0e304f" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#38bdf8" fontSize={11} />
                <YAxis stroke="#38bdf8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#061d30",
                    borderColor: "#0284c7",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  name="Temperature (°C)"
                  dot={{ fill: "#0284c7", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="#34d399"
                  strokeWidth={3}
                  name="Efficiency (%)"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 7: EMERGENCY RESPONSE & SEARCH AND RESCUE
// -------------------------------------------------------------
function EmergencyView({
  incidentActive,
  setIncidentActive,
  sarDispatched,
  onDispatchSAR,
  sarStatusText,
  sarTeam,
  setSarTeam,
  showToast,
}: {
  incidentActive: boolean;
  setIncidentActive: (val: boolean) => void;
  sarDispatched: boolean;
  onDispatchSAR: () => void;
  sarStatusText: string;
  sarTeam: string;
  setSarTeam: (t: string) => void;
  showToast: (m: string) => void;
}) {
  const [incidentModal, setIncidentModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Emergency Response & SAR Command</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Search and rescue coordination, drone vectors, medical evacuation logistics
          </p>
        </div>
        <button
          onClick={() => setIncidentModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-textMain text-xs font-black shadow-lg"
        >
          <ShieldAlert size={16} />
          DECLARE NEW EMERGENCY INCIDENT
        </button>
      </div>

      {/* Primary Active Incident Card */}
      <div className="glass-blue rounded-2xl p-6 border border-sky-400/50 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/50 text-red-400">
              <AlertTriangle size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-extrabold border border-red-500/40">
                  INCIDENT #SAR-882
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-green-800 text-[10px] font-extrabold border border-emerald-400/40">
                  {sarDispatched ? "RESCUE DISPATCH ACTIVE" : "CRITICAL STANDBY"}
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-textMain mt-1.5">
                Personnel & Vehicle Overdue: Vikram Rao
              </h3>
              <p className="text-xs text-slate-800/80 mt-1">
                Location: 14.2 km NE of Bharati Station · Terrain: Crevasse Hazard Ridge Alpha
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-textSecondary uppercase font-bold">Ambient Windchill</p>
            <p className="text-2xl font-mono font-black text-red-300">-46°C Effective</p>
            <p className="text-[10px] text-blue-700">Survival Window: ~4.5 hours</p>
          </div>
        </div>

        {/* 4 Emergency Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-blue-300/40">
          <MiniBox label="Last Satellite Ping" value="48 mins ago (406 MHz)" />
          <MiniBox label="Assigned Team" value={sarTeam} />
          <MiniBox label="Nearest Support Outpost" value="Field Alpha (6.8 km)" />
          <MiniBox label="Thermal UAV Drone" value="UAV-02 In Flight Vector" />
        </div>

        {/* AI SAR Recommendation */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950 to-emerald-950 border border-cyan-400/40">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
            <Cpu size={16} />
            POLAR AI TACTICAL SAR ROUTE RECOMMENDATION
          </div>
          <p className="text-xs text-slate-900 mt-2 leading-relaxed">
            Fastest safe vector: Dispatch PistenBully SV-04 via Valley Traverse Waypoint Beta-4 to avoid
            crevasse zone C-2. Deploy UAV-02 drone equipped with Forward-Looking Infrared (FLIR) ahead of
            ground team. Medical team to prepare hypothermia rewarming protocol.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-green-800 font-mono font-bold">
            <Activity className="animate-spin" size={16} />
            {sarStatusText}
          </div>

          <button
            disabled={sarDispatched}
            onClick={onDispatchSAR}
            className={`px-6 py-3 rounded-xl font-black text-xs transition-all shadow-xl ${
              sarDispatched
                ? "bg-emerald-600/30 text-green-800 border border-emerald-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 via-sky-600 to-emerald-600 hover:opacity-90 text-textMain shadow-sky-900/50"
            }`}
          >
            {sarDispatched ? "✓ SAR TEAMS IN FIELD DEPLOYMENT" : "DEPLOY SEARCH & RESCUE UNIT NOW"}
          </button>
        </div>
      </div>

      {/* Incident Map & Team Manifest */}
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 border border-sky-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-textMain text-sm">SAR Tactical Vector Map</h3>
            <span className="text-[10px] font-mono text-blue-800">GRID SECTOR 76°E</span>
          </div>

          <div className="map-bg h-[260px] rounded-xl relative flex items-center justify-center my-2">
            {/* Bharati base */}
            <div className="absolute left-[20%] top-[65%]">
              <MapPin className="text-blue-700" size={24} />
              <span className="text-[9px] font-bold text-slate-800 block">BHARATI</span>
            </div>

            {/* Field Alpha Outpost */}
            <div className="absolute left-[45%] top-[50%]">
              <MapPin className="text-green-700" size={22} />
              <span className="text-[9px] font-bold text-green-800 block">FIELD ALPHA</span>
            </div>

            {/* Vikram Missing Target */}
            <div className="absolute left-[75%] top-[30%]">
              <CircleDot className="text-red-400 animate-ping" size={24} />
              <span className="text-[9px] font-black text-red-200 block">VIKRAM (TARGET)</span>
            </div>

            {/* Vector arrow */}
            <div className="map-line-green w-48 left-[22%] top-[68%] rotate-[-24deg]" />
            <div className="map-line-blue w-48 left-[48%] top-[52%] rotate-[-30deg]" />
          </div>

          <div className="text-[10px] text-textSecondary">
            Estimated Ground Travel Time: 34 minutes · Drone Flight Time: 9 minutes
          </div>
        </div>

        <div className="glass-green rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-textMain text-sm">Emergency Medical Facility Status</h3>
            <p className="text-[11px] text-green-800/80 mt-1">
              Bharati Station Medical Bay 1 & Trauma Isolation
            </p>

            <div className="space-y-2.5 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-sky-950/50 border border-blue-300/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900">Trauma Unit Capacity</p>
                  <p className="text-[10px] text-textSecondary">2 Heated Resuscitation Bays Ready</p>
                </div>
                <span className="text-green-700 font-bold font-mono">100% READY</span>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/50 border border-blue-300/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900">Oxygen Cylinder Pressure</p>
                  <p className="text-[10px] text-textSecondary">760 Cylinders @ 200 bar</p>
                </div>
                <span className="text-blue-800 font-bold font-mono">OPTIMAL</span>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/50 border border-blue-300/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900">Attending Medical Officer</p>
                  <p className="text-[10px] text-textSecondary">Dr. Neha Kapoor (Active at Base)</p>
                </div>
                <span className="text-green-700 font-bold">ON CALL</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/30 mt-4 text-[11px] text-emerald-200">
            Blood plasma warming equipment pre-activated for hypothermia triage.
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 8: AI POLAR COPILOT
// -------------------------------------------------------------
function CopilotView({
  history,
  input,
  setInput,
  onSend,
}: {
  history: Array<{ role: "user" | "copilot"; text: string; time: string }>;
  input: string;
  setInput: (s: string) => void;
  onSend: (msg: string) => void;
}) {
  const suggestions = [
    "What are the top operational risks right now?",
    "Calculate diesel fuel stockout date with 42 crew",
    "Search and Rescue plan for Vikram Rao at Ridge Alpha",
    "Which cargo shipments are delayed by sea ice?",
    "Station power grid status and Generator GEN-07 health",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-blue-900">POLARIS AI Polar Copilot</h2>
        <p className="text-xs text-blue-700/80 mt-1">
          Intelligent polar operational decision support connected to telemetry, supply chain, and SAR
        </p>
      </div>

      <div className="glass-blue rounded-2xl border border-sky-500/30 flex flex-col h-[560px] overflow-hidden shadow-2xl">
        {/* Chat header */}
        <div className="p-4 border-b border-blue-300/50 bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/30">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-textMain flex items-center gap-1.5">
                Polar Intelligence Engine
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-green-700 font-semibold">
                Trained on NCPOR Polar Expeditions & Antarctica Operations
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-blue-800 bg-sky-950 px-2 py-1 rounded border border-blue-300/40">
            MODEL: POLARIS-NEO-V2
          </span>
        </div>

        {/* Message stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-textMain font-medium ml-8"
                    : "glass-green border border-emerald-400/40 text-sky-50 font-normal mr-8"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 opacity-70 text-[10px]">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.role === "user" ? "Polar Commander" : "Polar Copilot"}
                  </span>
                  <span>{msg.time}</span>
                </div>
                <p className="text-sm leading-6">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-blue-50 border-t border-blue-200/40 flex flex-wrap gap-1.5">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSend(s)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-sky-950 hover:bg-sky-900 text-slate-800 border border-blue-300/50 hover:border-cyan-400 transition-all font-medium truncate max-w-xs"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-blue-50 border-t border-blue-300/50 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") onSend(input);
            }}
            placeholder="Ask Polar Copilot about risks, weather, cargo routes, inventory..."
            className="flex-1 bg-blue-50 border border-blue-300/60 rounded-xl px-4 py-2.5 text-xs text-textMain placeholder-sky-400/50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
          />
          <button
            onClick={() => onSend(input)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 text-slate-950 font-black text-xs hover:opacity-95 shadow-md flex items-center gap-1.5"
          >
            <span>SEND</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 9: REPORTS & ANALYTICS
// -------------------------------------------------------------
function ReportsView({
  readinessData,
  supplyBurnData,
  showToast,
}: {
  readinessData: any[];
  supplyBurnData: any[];
  showToast: (m: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Reports & Mission Analytics</h2>
          <p className="text-xs text-blue-700/80 mt-1">
            Historical readiness trajectories, supply burn velocities, executive mission summaries
          </p>
        </div>
        <button
          onClick={() => showToast("Operational Briefing PDF generated and ready for export!")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain font-bold text-xs shadow-lg"
        >
          <Download size={16} />
          EXPORT BRIEFING REPORT
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Average Station Readiness" value="89.4%" sub="+5.2% vs last winter" icon={Gauge} accent="green" />
        <MetricCard label="Total Fuel Reserve Buffer" value="13,520 L" sub="Diesel & Jet A-1 combined" icon={Flame} accent="blue" />
        <MetricCard label="Expedition Safety Score" value="99.2%" sub="0 lost-time incidents" icon={ShieldCheck} accent="green" />
        <MetricCard label="Logistics On-Time Rate" value="91.6%" sub="24 completed sea routes" icon={Package} accent="blue" />
      </div>

      {/* Chart 1: Readiness Over Time in Blue & Green */}
      <div className="glass-blue rounded-2xl p-6 border border-sky-500/30">
        <h3 className="font-extrabold text-sm text-textMain mb-1">
          Historical Mission Readiness Trend (Aug 2026 – Jan 2027)
        </h3>
        <p className="text-[11px] text-blue-700/70 mb-4">
          Composite score factoring food, fuel, personnel health and station power reliability
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={readinessData}>
              <defs>
                <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#0e304f" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#38bdf8" fontSize={11} />
              <YAxis stroke="#38bdf8" fontSize={11} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#061d30",
                  borderColor: "#0284c7",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="readiness"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#readinessGrad)"
                name="Readiness (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Supply Burn Velocities */}
      <div className="glass rounded-2xl p-6 border border-sky-500/20">
        <h3 className="font-extrabold text-sm text-textMain mb-1">
          Weekly Supply Burn Rate vs. Restock Cadence
        </h3>
        <p className="text-[11px] text-blue-700/70 mb-4">
          Comparing daily consumption against scheduled supply drops across critical resource tiers
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplyBurnData}>
              <CartesianGrid stroke="#0e304f" strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="#38bdf8" fontSize={11} />
              <YAxis stroke="#38bdf8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#061d30",
                  borderColor: "#059669",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="burned" fill="#0284c7" name="Daily Burn Rate" radius={[6, 6, 0, 0]} />
              <Bar dataKey="restock" fill="#10b981" name="Target Restock Increment" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 10: SETTINGS & STATIONS
// -------------------------------------------------------------
function SettingsView({
  station,
  setStation,
  showToast,
}: {
  station: StationKey;
  setStation: (s: StationKey) => void;
  showToast: (m: string) => void;
}) {
  const [meshRadio, setMeshRadio] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [telemetryRate, setTelemetryRate] = useState("10 sec");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-blue-900">System Settings & Station Nodes</h2>
        <p className="text-xs text-blue-700/80 mt-1">
          Hardware links, low-bandwidth satellite fallback, and station deployment parameters
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Active Station Selection */}
        <div className="glass-blue rounded-2xl p-5 border border-sky-500/30 space-y-4">
          <h3 className="font-extrabold text-sm text-textMain flex items-center gap-2">
            <Compass className="text-blue-700" />
            Primary Station Selection
          </h3>
          <p className="text-xs text-slate-800/70">
            Switch telemetry and operational displays to the active polar base:
          </p>

          <div className="space-y-2">
            {(["BHARATI", "MAITRI", "HIMADRI"] as StationKey[]).map(s => {
              const data = STATIONS_DATA[s];
              const isSelected = station === s;
              return (
                <div
                  key={s}
                  onClick={() => {
                    setStation(s);
                    showToast(`Active base switched to ${data.name}!`);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-sky-600/30 to-emerald-600/30 border-cyan-400"
                      : "bg-sky-950/40 border-blue-200/40 hover:border-sky-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-textMain text-xs">{data.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isSelected ? "bg-emerald-500 text-slate-950" : "text-blue-700"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                  <p className="text-[10px] text-textSecondary mt-1">{data.region}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Communication & Mesh Settings */}
        <div className="glass rounded-2xl p-5 border border-sky-500/20 space-y-4">
          <h3 className="font-extrabold text-sm text-textMain flex items-center gap-2">
            <Radio className="text-green-700" />
            Polar Network & Mesh Radio
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-950/40 border border-blue-300/40">
              <div>
                <p className="font-bold text-blue-900">VHF Mesh Radio Fallback</p>
                <p className="text-[10px] text-textSecondary">P2P emergency link between traverse sledges</p>
              </div>
              <button
                onClick={() => setMeshRadio(!meshRadio)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  meshRadio ? "bg-emerald-500 text-slate-950" : "bg-slate-100 text-textSecondary"
                }`}
              >
                {meshRadio ? "ENABLED" : "OFF"}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-950/40 border border-blue-300/40">
              <div>
                <p className="font-bold text-blue-900">Offline Local SQLite Store</p>
                <p className="text-[10px] text-textSecondary">Stores logs locally during satellite blackouts</p>
              </div>
              <button
                onClick={() => setOfflineSync(!offlineSync)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  offlineSync ? "bg-emerald-500 text-slate-950" : "bg-slate-100 text-textSecondary"
                }`}
              >
                {offlineSync ? "ACTIVE" : "OFF"}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-950/40 border border-blue-300/40">
              <div>
                <p className="font-bold text-blue-900">Telemetry Polling Rate</p>
                <p className="text-[10px] text-textSecondary">Bandwidth-conscious telemetry refresh</p>
              </div>
              <select
                value={telemetryRate}
                onChange={e => setTelemetryRate(e.target.value)}
                className="bg-blue-50 border border-blue-300 text-slate-800 text-xs rounded-lg px-2 py-1 outline-none"
              >
                <option value="5 sec">5 sec (High)</option>
                <option value="10 sec">10 sec (Normal)</option>
                <option value="30 sec">30 sec (Low Bandwidth)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="p-4 rounded-xl glass-green border border-emerald-500/30 text-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold text-blue-900">POLARIS Operational Command — SIH Prototype 2026</p>
          <p className="text-[10px] text-green-800">
            Compliant with NCPOR Indian Antarctic Research Programme (IARP) operational specs
          </p>
        </div>
        <button
          onClick={() => showToast("Diagnostic ping returned 100% telemetry fidelity across all stations!")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-textMain font-bold text-xs shadow-md"
        >
          RUN DIAGNOSTIC SELF-TEST
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// REUSABLE HELPER UI COMPONENTS
// -------------------------------------------------------------
function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string;
  sub: string;
  icon: any;
  accent?: "blue" | "green";
}) {
  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        accent === "blue" ? "glass-blue border-sky-500/30" : "glass-green border-emerald-500/30"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-textSecondary">{label}</p>
          <p className="text-3xl font-black text-textMain mt-1.5">{value}</p>
          <p className="text-[11px] text-slate-800/70 mt-1">{sub}</p>
        </div>
        <div
          className={`p-2.5 rounded-xl ${
            accent === "blue"
              ? "bg-sky-500/20 text-blue-800 border border-sky-400/30"
              : "bg-emerald-500/20 text-green-800 border border-emerald-400/30"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function ReadinessRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "green";
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-slate-800/80 font-medium">{label}</span>
        <span className="font-mono font-bold text-blue-900">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-sky-950 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            color === "green"
              ? "bg-gradient-to-r from-emerald-500 to-teal-300"
              : "bg-gradient-to-r from-sky-500 to-cyan-300"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function AlertItem({
  icon: Icon,
  title,
  desc,
  accent,
  actionText,
  onAction,
}: {
  icon: any;
  title: string;
  desc: string;
  accent: "blue" | "green";
  actionText: string;
  onAction: () => void;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
        accent === "blue"
          ? "bg-sky-950/40 border-blue-300/30"
          : "bg-emerald-950/40 border-emerald-700/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            accent === "blue" ? "text-blue-800 bg-sky-900/40" : "text-green-800 bg-emerald-900/40"
          }`}
        >
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-blue-900">{title}</p>
          <p className="text-[10px] text-textSecondary">{desc}</p>
        </div>
      </div>
      <button
        onClick={onAction}
        className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-800 border border-blue-400/40 flex items-center gap-1 transition-all"
      >
        <span>{actionText}</span>
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

function LogItem({
  time,
  station,
  msg,
  tone,
}: {
  time: string;
  station: string;
  msg: string;
  tone: "blue" | "green";
}) {
  return (
    <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-sky-950/30 transition-all">
      <span className="font-mono text-[10px] text-textSecondary whitespace-nowrap mt-0.5">{time}</span>
      <span
        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
          tone === "green"
            ? "bg-emerald-950 text-green-800 border border-emerald-500/30"
            : "bg-sky-950 text-blue-800 border border-sky-500/30"
        }`}
      >
        {station}
      </span>
      <p className="text-textMain text-xs flex-1 leading-snug">{msg}</p>
    </div>
  );
}

function MiniBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-sky-950/50 border border-blue-300/40">
      <p className="text-[9px] uppercase font-bold text-blue-600 tracking-wider">{label}</p>
      <p className="text-xs font-bold text-textMain mt-0.5 truncate">{value}</p>
    </div>
  );
}
