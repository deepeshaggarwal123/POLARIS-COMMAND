// ============================================================
// POLARIS — SIH 2026 Centralized Demo Data
// Synthetic operational data for demonstration purposes only.
// ============================================================

export type ExpeditionStatus = "ACTIVE" | "PLANNED" | "COMPLETED" | "SUSPENDED";
export type CargoStatus = "PACKED" | "DISPATCHED" | "STAGING" | "LOADED" | "IN_TRANSIT" | "ARRIVED" | "DELIVERED" | "DELAYED";
export type PersonnelStatus = "ACTIVE" | "OVERDUE" | "CHECKED_IN" | "EMERGENCY" | "STANDBY";
export type AssetStatus = "OPERATIONAL" | "WARNING" | "CRITICAL" | "MAINTENANCE" | "OFFLINE";
export type IncidentStatus = "OPEN" | "RESPONDING" | "RESOLVED" | "CLOSED";
export type InventoryStatus = "HEALTHY" | "WARNING" | "CRITICAL" | "STOCKOUT";
export type Priority = "LOW" | "NORMAL" | "MEDIUM" | "HIGH" | "CRITICAL";

// ────────────────────────────────────────────────────────────
// EXPEDITIONS
// ────────────────────────────────────────────────────────────
export interface Expedition {
  id: string;
  name: string;
  fullName: string;
  station: string;
  status: ExpeditionStatus;
  crew: number;
  maxCrew: number;
  startDate: string;
  endDate: string;
  leader: string;
  missionType: string;
  priority: Priority;
  region: string;
  objective: string;
  readiness: number;
  cargoReadiness: number;
  inventoryReadiness: number;
  assetReadiness: number;
  emergencyReadiness: number;
}

export const EXPEDITIONS: Expedition[] = [
  {
    id: "ISEA-2027",
    name: "ISEA-2027",
    fullName: "International Scientific Expedition Antarctica 2027",
    station: "Bharati Station",
    status: "ACTIVE",
    crew: 42,
    maxCrew: 45,
    startDate: "2027-01-10",
    endDate: "2027-03-30",
    leader: "Dr. Anand Sharma",
    missionType: "Scientific Research",
    priority: "CRITICAL",
    region: "Larsemann Hills, East Antarctica",
    objective: "Atmospheric CO₂ sampling, ice core drilling, marine biodiversity survey",
    readiness: 82,
    cargoReadiness: 91,
    inventoryReadiness: 91,
    assetReadiness: 89,
    emergencyReadiness: 82,
  },
  {
    id: "ISA-2026B",
    name: "ISA-2026B",
    fullName: "India Southern Antarctica Expedition 2026 Batch B",
    station: "Maitri Station",
    status: "PLANNED",
    crew: 28,
    maxCrew: 35,
    startDate: "2026-11-15",
    endDate: "2027-01-05",
    leader: "Dr. Priya Nair",
    missionType: "Geological Survey",
    priority: "HIGH",
    region: "Schirmacher Oasis, Queen Maud Land",
    objective: "Geological mapping of Schirmacher Oasis, permafrost monitoring",
    readiness: 67,
    cargoReadiness: 72,
    inventoryReadiness: 78,
    assetReadiness: 80,
    emergencyReadiness: 75,
  },
  {
    id: "ARC-2027-H",
    name: "ARC-2027-H",
    fullName: "Arctic Research Campaign 2027 — Himadri",
    station: "Himadri Station",
    status: "PLANNED",
    crew: 18,
    maxCrew: 20,
    startDate: "2027-06-01",
    endDate: "2027-08-31",
    leader: "Dr. Rohit Menon",
    missionType: "Climate Research",
    priority: "HIGH",
    region: "Ny-Ålesund, Svalbard, Arctic",
    objective: "Arctic sea ice extent monitoring, permafrost thaw measurement",
    readiness: 55,
    cargoReadiness: 60,
    inventoryReadiness: 65,
    assetReadiness: 70,
    emergencyReadiness: 68,
  },
];

// ────────────────────────────────────────────────────────────
// CARGO
// ────────────────────────────────────────────────────────────
export interface CargoItem {
  id: string;
  description: string;
  category: string;
  priority: Priority;
  origin: string;
  currentLocation: string;
  destination: string;
  status: CargoStatus;
  eta: string;
  condition: string;
  weight: string;
  carrier: string;
  expedition: string;
  timeline: { stage: string; timestamp: string; done: boolean; active: boolean }[];
  notes: string;
}

export const CARGO_ITEMS: CargoItem[] = [
  {
    id: "ANT-1024",
    description: "Generator Cooling Pump (GEN-07 Replacement)",
    category: "Spare Parts",
    priority: "CRITICAL",
    origin: "NCPOR Goa",
    currentLocation: "Antarctic Staging Hub, Cape Town",
    destination: "Bharati Station",
    status: "DELAYED",
    eta: "+36 hours behind schedule",
    condition: "Good",
    weight: "48 kg",
    carrier: "M/V Bharati Sewa",
    expedition: "ISEA-2027",
    timeline: [
      { stage: "PACKED", timestamp: "Jan 02 08:00", done: true, active: false },
      { stage: "DISPATCHED", timestamp: "Jan 04 14:30", done: true, active: false },
      { stage: "STAGING HUB", timestamp: "Jan 07 09:00", done: true, active: false },
      { stage: "LOADED", timestamp: "Jan 08 — DELAYED", done: false, active: true },
      { stage: "IN TRANSIT", timestamp: "—", done: false, active: false },
      { stage: "STATION ARRIVAL", timestamp: "—", done: false, active: false },
      { stage: "DELIVERED", timestamp: "—", done: false, active: false },
    ],
    notes: "Delayed due to port congestion at Cape Town. Priority escalated. GEN-07 running degraded.",
  },
  {
    id: "ANT-1025",
    description: "Medical Resupply Kit — Batch 3",
    category: "Medical",
    priority: "HIGH",
    origin: "NCPOR Goa",
    currentLocation: "In Transit — M/V Bharati Sewa",
    destination: "Bharati Station",
    status: "IN_TRANSIT",
    eta: "Jan 12 est.",
    condition: "Excellent",
    weight: "120 kg",
    carrier: "M/V Bharati Sewa",
    expedition: "ISEA-2027",
    timeline: [
      { stage: "PACKED", timestamp: "Jan 01 10:00", done: true, active: false },
      { stage: "DISPATCHED", timestamp: "Jan 04 14:30", done: true, active: false },
      { stage: "STAGING HUB", timestamp: "Jan 07 09:00", done: true, active: false },
      { stage: "LOADED", timestamp: "Jan 07 17:00", done: true, active: false },
      { stage: "IN TRANSIT", timestamp: "Jan 08 06:00", done: true, active: true },
      { stage: "STATION ARRIVAL", timestamp: "Jan 12 est.", done: false, active: false },
      { stage: "DELIVERED", timestamp: "—", done: false, active: false },
    ],
    notes: "Shipment on track.",
  },
  {
    id: "ANT-1026",
    description: "Emergency Rations Pack — 90 person-days",
    category: "Food",
    priority: "HIGH",
    origin: "NCPOR Goa",
    currentLocation: "Bharati Station",
    destination: "Bharati Station",
    status: "DELIVERED",
    eta: "Delivered Jan 5",
    condition: "Excellent",
    weight: "320 kg",
    carrier: "IL-76 Polar Charter",
    expedition: "ISEA-2027",
    timeline: [
      { stage: "PACKED", timestamp: "Dec 28 09:00", done: true, active: false },
      { stage: "DISPATCHED", timestamp: "Dec 29 11:00", done: true, active: false },
      { stage: "STAGING HUB", timestamp: "Dec 31 08:00", done: true, active: false },
      { stage: "LOADED", timestamp: "Dec 31 16:00", done: true, active: false },
      { stage: "IN TRANSIT", timestamp: "Jan 01 07:00", done: true, active: false },
      { stage: "STATION ARRIVAL", timestamp: "Jan 05 14:30", done: true, active: false },
      { stage: "DELIVERED", timestamp: "Jan 05 16:00", done: true, active: true },
    ],
    notes: "Delivered on schedule.",
  },
  {
    id: "ANT-1027",
    description: "Fuel Drums — Diesel (3,000 L)",
    category: "Fuel",
    priority: "CRITICAL",
    origin: "NCPOR Goa",
    currentLocation: "Cape Town Port",
    destination: "Bharati Station",
    status: "STAGING",
    eta: "Jan 15 est.",
    condition: "Good",
    weight: "2,580 kg",
    carrier: "M/V Bharati Sewa",
    expedition: "ISEA-2027",
    timeline: [
      { stage: "PACKED", timestamp: "Jan 05 08:00", done: true, active: false },
      { stage: "DISPATCHED", timestamp: "Jan 06 12:00", done: true, active: false },
      { stage: "STAGING HUB", timestamp: "Jan 08 10:00", done: true, active: true },
      { stage: "LOADED", timestamp: "—", done: false, active: false },
      { stage: "IN TRANSIT", timestamp: "—", done: false, active: false },
      { stage: "STATION ARRIVAL", timestamp: "Jan 15 est.", done: false, active: false },
      { stage: "DELIVERED", timestamp: "—", done: false, active: false },
    ],
    notes: "Critical replenishment. Bharati diesel at 16.7 days.",
  },
  {
    id: "ANT-1028",
    description: "Scientific Instruments — Ice Core Drill Set",
    category: "Science",
    priority: "NORMAL",
    origin: "IIT Bombay",
    currentLocation: "In Transit — IL-76",
    destination: "Bharati Station",
    status: "IN_TRANSIT",
    eta: "Jan 11 est.",
    condition: "Good",
    weight: "210 kg",
    carrier: "IL-76 Polar Charter",
    expedition: "ISEA-2027",
    timeline: [
      { stage: "PACKED", timestamp: "Jan 04 10:00", done: true, active: false },
      { stage: "DISPATCHED", timestamp: "Jan 06 08:00", done: true, active: false },
      { stage: "STAGING HUB", timestamp: "Jan 07 18:00", done: true, active: false },
      { stage: "LOADED", timestamp: "Jan 08 09:00", done: true, active: false },
      { stage: "IN TRANSIT", timestamp: "Jan 09 00:00", done: true, active: true },
      { stage: "STATION ARRIVAL", timestamp: "Jan 11 est.", done: false, active: false },
      { stage: "DELIVERED", timestamp: "—", done: false, active: false },
    ],
    notes: "On schedule.",
  },
  {
    id: "MAI-0312",
    description: "Generator Parts — Maitri Backup",
    category: "Spare Parts",
    priority: "HIGH",
    origin: "NCPOR Goa",
    currentLocation: "In Transit",
    destination: "Maitri Station",
    status: "IN_TRANSIT",
    eta: "Jan 20 est.",
    condition: "Good",
    weight: "95 kg",
    carrier: "Charter Flight",
    expedition: "ISA-2026B",
    timeline: [
      { stage: "PACKED", timestamp: "Jan 07 08:00", done: true, active: false },
      { stage: "DISPATCHED", timestamp: "Jan 08 10:00", done: true, active: false },
      { stage: "STAGING HUB", timestamp: "Jan 09 14:00", done: true, active: false },
      { stage: "LOADED", timestamp: "Jan 09 20:00", done: true, active: false },
      { stage: "IN TRANSIT", timestamp: "Jan 10 04:00", done: true, active: true },
      { stage: "STATION ARRIVAL", timestamp: "Jan 20 est.", done: false, active: false },
      { stage: "DELIVERED", timestamp: "—", done: false, active: false },
    ],
    notes: "On schedule.",
  },
  {
    id: "ANT-1029",
    description: "Batteries — Lithium Pack Array",
    category: "Electronics",
    priority: "NORMAL",
    origin: "NCPOR Goa",
    currentLocation: "NCPOR Goa Warehouse",
    destination: "Bharati Station",
    status: "PACKED",
    eta: "Jan 25 est.",
    condition: "New",
    weight: "180 kg",
    carrier: "TBD",
    expedition: "ISEA-2027",
    timeline: [
      { stage: "PACKED", timestamp: "Jan 08 09:00", done: true, active: true },
      { stage: "DISPATCHED", timestamp: "—", done: false, active: false },
      { stage: "STAGING HUB", timestamp: "—", done: false, active: false },
      { stage: "LOADED", timestamp: "—", done: false, active: false },
      { stage: "IN TRANSIT", timestamp: "—", done: false, active: false },
      { stage: "STATION ARRIVAL", timestamp: "Jan 25 est.", done: false, active: false },
      { stage: "DELIVERED", timestamp: "—", done: false, active: false },
    ],
    notes: "Awaiting dispatch.",
  },
];

// ────────────────────────────────────────────────────────────
// INVENTORY
// ────────────────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  station: string;
  currentStock: number;
  unit: string;
  dailyConsumption: number;
  daysRemaining: number;
  reorderLevel: number;
  maxCapacity: number;
  status: InventoryStatus;
  expedition: string;
  lastUpdated: string;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Diesel Fuel",
    category: "Fuel",
    station: "Bharati Station",
    currentStock: 24800,
    unit: "L",
    dailyConsumption: 1485,
    daysRemaining: 16.7,
    reorderLevel: 20000,
    maxCapacity: 80000,
    status: "WARNING",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-002",
    name: "Food Rations",
    category: "Food",
    station: "Bharati Station",
    currentStock: 1350,
    unit: "kg",
    dailyConsumption: 45,
    daysRemaining: 30,
    reorderLevel: 500,
    maxCapacity: 2000,
    status: "HEALTHY",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-003",
    name: "Medical Supplies",
    category: "Medical",
    station: "Bharati Station",
    currentStock: 18,
    unit: "kits",
    dailyConsumption: 0.2,
    daysRemaining: 90,
    reorderLevel: 5,
    maxCapacity: 40,
    status: "HEALTHY",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-004",
    name: "Generator Parts",
    category: "Spare Parts",
    station: "Bharati Station",
    currentStock: 2,
    unit: "units",
    dailyConsumption: 0.03,
    daysRemaining: 66.7,
    reorderLevel: 3,
    maxCapacity: 15,
    status: "WARNING",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-005",
    name: "Emergency Rations",
    category: "Food",
    station: "Bharati Station",
    currentStock: 90,
    unit: "person-days",
    dailyConsumption: 0,
    daysRemaining: 999,
    reorderLevel: 30,
    maxCapacity: 150,
    status: "HEALTHY",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-006",
    name: "Diesel Fuel",
    category: "Fuel",
    station: "Maitri Station",
    currentStock: 31200,
    unit: "L",
    dailyConsumption: 890,
    daysRemaining: 35.1,
    reorderLevel: 15000,
    maxCapacity: 60000,
    status: "HEALTHY",
    expedition: "ISA-2026B",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-007",
    name: "Scientific Consumables",
    category: "Science",
    station: "Bharati Station",
    currentStock: 450,
    unit: "units",
    dailyConsumption: 12,
    daysRemaining: 37.5,
    reorderLevel: 100,
    maxCapacity: 1000,
    status: "HEALTHY",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-008",
    name: "Batteries",
    category: "Electronics",
    station: "Bharati Station",
    currentStock: 24,
    unit: "packs",
    dailyConsumption: 0.5,
    daysRemaining: 48,
    reorderLevel: 10,
    maxCapacity: 50,
    status: "HEALTHY",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-009",
    name: "Oxygen Cylinders",
    category: "Medical",
    station: "Bharati Station",
    currentStock: 12,
    unit: "cylinders",
    dailyConsumption: 0.3,
    daysRemaining: 40,
    reorderLevel: 5,
    maxCapacity: 30,
    status: "HEALTHY",
    expedition: "ISEA-2027",
    lastUpdated: "Jan 10 06:00",
  },
  {
    id: "INV-010",
    name: "Diesel Fuel",
    category: "Fuel",
    station: "Himadri Station",
    currentStock: 8400,
    unit: "L",
    dailyConsumption: 420,
    daysRemaining: 20,
    reorderLevel: 5000,
    maxCapacity: 25000,
    status: "WARNING",
    expedition: "ARC-2027-H",
    lastUpdated: "Jan 10 06:00",
  },
];

// ────────────────────────────────────────────────────────────
// PERSONNEL
// ────────────────────────────────────────────────────────────
export interface PersonnelMember {
  id: string;
  name: string;
  role: string;
  team: string;
  expedition: string;
  station: string;
  currentLocation: string;
  previousLocation: string;
  lastCheckIn: string;
  minutesSinceCheckIn: number;
  status: PersonnelStatus;
  communication: string;
  emergencyContact: string;
  movementHistory: { location: string; timestamp: string }[];
}

export const PERSONNEL: PersonnelMember[] = [
  {
    id: "PER-001",
    name: "Vikram Rao",
    role: "Field Geologist",
    team: "Geology Alpha",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Field Camp Alpha (14.2 km from Bharati)",
    previousLocation: "Bharati Station",
    lastCheckIn: "42 minutes ago",
    minutesSinceCheckIn: 42,
    status: "OVERDUE",
    communication: "Satellite — Last Signal Weak",
    emergencyContact: "Dr. Anand Sharma",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 05:30" },
      { location: "Field Camp Alpha", timestamp: "Jan 10 06:45" },
      { location: "Bharati Station", timestamp: "Jan 10 09:00" },
      { location: "Field Camp Alpha (14.2 km)", timestamp: "Jan 10 10:15" },
    ],
  },
  {
    id: "PER-002",
    name: "Dr. Anand Sharma",
    role: "Expedition Leader",
    team: "Command",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Bharati Station — Command Room",
    previousLocation: "Bharati Station",
    lastCheckIn: "8 minutes ago",
    minutesSinceCheckIn: 8,
    status: "ACTIVE",
    communication: "Satellite + VSAT",
    emergencyContact: "NCPOR HQ",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 06:00" },
    ],
  },
  {
    id: "PER-003",
    name: "Dr. Meera Krishnan",
    role: "Marine Biologist",
    team: "Science Alpha",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Research Lab — Bharati",
    previousLocation: "Bharati Station",
    lastCheckIn: "15 minutes ago",
    minutesSinceCheckIn: 15,
    status: "ACTIVE",
    communication: "VSAT",
    emergencyContact: "Dr. Anand Sharma",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 07:00" },
      { location: "Research Lab", timestamp: "Jan 10 08:30" },
    ],
  },
  {
    id: "PER-004",
    name: "Sgt. Ramesh Pillai",
    role: "Station Security",
    team: "Security",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Bharati Station — Perimeter",
    previousLocation: "Bharati Station",
    lastCheckIn: "5 minutes ago",
    minutesSinceCheckIn: 5,
    status: "ACTIVE",
    communication: "Radio",
    emergencyContact: "Dr. Anand Sharma",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 06:00" },
    ],
  },
  {
    id: "PER-005",
    name: "Dr. Priya Nair",
    role: "Expedition Leader",
    team: "Command",
    expedition: "ISA-2026B",
    station: "Maitri Station",
    currentLocation: "Maitri Station — Command",
    previousLocation: "Maitri Station",
    lastCheckIn: "12 minutes ago",
    minutesSinceCheckIn: 12,
    status: "ACTIVE",
    communication: "VSAT",
    emergencyContact: "NCPOR HQ",
    movementHistory: [
      { location: "Maitri Station", timestamp: "Jan 10 06:00" },
    ],
  },
  {
    id: "PER-006",
    name: "Engineer Suresh Babu",
    role: "Mechanical Engineer",
    team: "Engineering",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Generator Room — Bharati",
    previousLocation: "Bharati Station",
    lastCheckIn: "20 minutes ago",
    minutesSinceCheckIn: 20,
    status: "ACTIVE",
    communication: "Radio",
    emergencyContact: "Dr. Anand Sharma",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 06:00" },
      { location: "Generator Room", timestamp: "Jan 10 09:00" },
    ],
  },
  {
    id: "PER-007",
    name: "Dr. Aisha Patel",
    role: "Medical Officer",
    team: "Medical Alpha",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Medical Bay — Bharati",
    previousLocation: "Bharati Station",
    lastCheckIn: "18 minutes ago",
    minutesSinceCheckIn: 18,
    status: "ACTIVE",
    communication: "Radio + VSAT",
    emergencyContact: "Dr. Anand Sharma",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 06:00" },
      { location: "Medical Bay", timestamp: "Jan 10 08:00" },
    ],
  },
  {
    id: "PER-008",
    name: "Lt. Kiran Joshi",
    role: "Logistics Officer",
    team: "Logistics",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    currentLocation: "Cargo Bay — Bharati",
    previousLocation: "Bharati Station",
    lastCheckIn: "10 minutes ago",
    minutesSinceCheckIn: 10,
    status: "ACTIVE",
    communication: "Radio",
    emergencyContact: "Dr. Anand Sharma",
    movementHistory: [
      { location: "Bharati Station", timestamp: "Jan 10 07:00" },
      { location: "Cargo Bay", timestamp: "Jan 10 08:30" },
    ],
  },
];

// ────────────────────────────────────────────────────────────
// ASSETS
// ────────────────────────────────────────────────────────────
export interface Asset {
  id: string;
  name: string;
  type: string;
  station: string;
  health: number;
  status: AssetStatus;
  runtimeHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  expedition: string;
  temperature: number;
  fuelLevel: number;
  vibration: string;
  notes: string;
}

export const ASSETS: Asset[] = [
  {
    id: "GEN-07",
    name: "Generator Unit 7",
    type: "Power Generator",
    station: "Bharati Station",
    health: 64,
    status: "WARNING",
    runtimeHours: 4820,
    lastMaintenance: "Dec 15",
    nextMaintenance: "OVERDUE",
    expedition: "ISEA-2027",
    temperature: 89,
    fuelLevel: 42,
    vibration: "HIGH",
    notes: "Cooling pump degraded. ANT-1024 replacement shipment delayed. Manual monitoring required.",
  },
  {
    id: "GEN-01",
    name: "Generator Unit 1",
    type: "Power Generator",
    station: "Bharati Station",
    health: 94,
    status: "OPERATIONAL",
    runtimeHours: 2100,
    lastMaintenance: "Jan 02",
    nextMaintenance: "Feb 15",
    expedition: "ISEA-2027",
    temperature: 72,
    fuelLevel: 78,
    vibration: "LOW",
    notes: "Primary power generator. Fully operational.",
  },
  {
    id: "RV-02",
    name: "Rescue Vehicle 2",
    type: "Snow Crawler",
    station: "Bharati Station",
    health: 88,
    status: "OPERATIONAL",
    runtimeHours: 1200,
    lastMaintenance: "Jan 01",
    nextMaintenance: "Feb 01",
    expedition: "ISEA-2027",
    temperature: 65,
    fuelLevel: 90,
    vibration: "LOW",
    notes: "Nearest rescue asset to Field Camp Alpha.",
  },
  {
    id: "RV-01",
    name: "Rescue Vehicle 1",
    type: "Snow Crawler",
    station: "Bharati Station",
    health: 72,
    status: "MAINTENANCE",
    runtimeHours: 3200,
    lastMaintenance: "Dec 30",
    nextMaintenance: "Jan 15",
    expedition: "ISEA-2027",
    temperature: 68,
    fuelLevel: 55,
    vibration: "MEDIUM",
    notes: "Undergoing scheduled maintenance. Not available for deployment.",
  },
  {
    id: "DRONE-03",
    name: "Reconnaissance Drone 3",
    type: "UAV",
    station: "Bharati Station",
    health: 97,
    status: "OPERATIONAL",
    runtimeHours: 340,
    lastMaintenance: "Jan 05",
    nextMaintenance: "Mar 01",
    expedition: "ISEA-2027",
    temperature: 55,
    fuelLevel: 95,
    vibration: "NONE",
    notes: "High-endurance reconnaissance UAV.",
  },
  {
    id: "VSAT-01",
    name: "VSAT Communication Terminal",
    type: "Communication",
    station: "Bharati Station",
    health: 99,
    status: "OPERATIONAL",
    runtimeHours: 8760,
    lastMaintenance: "Jan 01",
    nextMaintenance: "Jul 01",
    expedition: "ISEA-2027",
    temperature: 48,
    fuelLevel: 100,
    vibration: "NONE",
    notes: "99.8% uptime. Satellite: INMARSAT POLAR.",
  },
  {
    id: "SLED-02",
    name: "Research Sled 2",
    type: "Field Vehicle",
    station: "Bharati Station",
    health: 81,
    status: "OPERATIONAL",
    runtimeHours: 780,
    lastMaintenance: "Dec 28",
    nextMaintenance: "Feb 28",
    expedition: "ISEA-2027",
    temperature: 60,
    fuelLevel: 70,
    vibration: "LOW",
    notes: "Currently assigned to Geology Alpha team.",
  },
  {
    id: "GEN-MAI-01",
    name: "Maitri Generator 1",
    type: "Power Generator",
    station: "Maitri Station",
    health: 91,
    status: "OPERATIONAL",
    runtimeHours: 3500,
    lastMaintenance: "Jan 03",
    nextMaintenance: "Mar 03",
    expedition: "ISA-2026B",
    temperature: 74,
    fuelLevel: 65,
    vibration: "LOW",
    notes: "Primary power. Stable.",
  },
];

// ────────────────────────────────────────────────────────────
// INCIDENTS / EMERGENCY
// ────────────────────────────────────────────────────────────
export interface Incident {
  id: string;
  type: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: Priority;
  location: string;
  personnelInvolved: string[];
  reportedAt: string;
  expedition: string;
  station: string;
  weatherConditions: string;
  nearestStation: string;
  availableRescueVehicles: string[];
  medicalTeam: string;
  communicationStatus: string;
  aiRecommendation: string[];
  aiReasoning: string[];
  dispatchedAt?: string;
  resolvedAt?: string;
  respondingTeam?: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    type: "PERSONNEL_MISSING",
    title: "Overdue Personnel Check-in — Vikram Rao",
    description: "Field Geologist Vikram Rao has not checked in for 42 minutes. Last known position is Field Camp Alpha, 14.2 km from Bharati Station. Weak satellite signal detected.",
    status: "OPEN",
    severity: "CRITICAL",
    location: "Field Camp Alpha, 14.2 km from Bharati Station",
    personnelInvolved: ["Vikram Rao"],
    reportedAt: "Jan 10 10:57",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    weatherConditions: "Wind 38 kts SW, Temp -34°C, Visibility 2 km",
    nearestStation: "Bharati Station (14.2 km)",
    availableRescueVehicles: ["RV-02 (Snow Crawler — Fully Operational)"],
    medicalTeam: "Medical Team Alpha — Dr. Aisha Patel",
    communicationStatus: "Weak satellite signal — last beacon received 42 min ago",
    aiRecommendation: [
      "Dispatch Rescue Vehicle RV-02 to Field Camp Alpha immediately",
      "Alert Medical Team Alpha (Dr. Aisha Patel) at Bharati",
      "Establish continuous satellite communication watch",
      "Deploy Reconnaissance Drone 3 for aerial search along last known route",
      "Escalate to NCPOR HQ if contact not restored within 30 minutes",
    ],
    aiReasoning: [
      "RV-02 is the nearest available rescue asset, fully operational at 90% fuel",
      "Medical Team Alpha (Dr. Aisha Patel) is on-station and immediately deployable",
      "Vikram Rao's last beacon was 14.2 km SE — within RV-02's 45-min operational range",
      "DRONE-03 has 95% charge and can cover the search corridor in 12 minutes",
      "Weather window (38 kts, -34°C) is within operational safety limits for now",
    ],
  },
  {
    id: "INC-002",
    type: "EQUIPMENT_FAILURE",
    title: "GEN-07 Cooling Pump Degraded",
    description: "Generator GEN-07 cooling pump operating below specification. Temperature elevated to 89°C. Replacement part ANT-1024 delayed by 36 hours.",
    status: "OPEN",
    severity: "HIGH",
    location: "Generator Room, Bharati Station",
    personnelInvolved: ["Engineer Suresh Babu"],
    reportedAt: "Jan 10 09:30",
    expedition: "ISEA-2027",
    station: "Bharati Station",
    weatherConditions: "N/A — Indoor",
    nearestStation: "Bharati Station (on-site)",
    availableRescueVehicles: [],
    medicalTeam: "N/A",
    communicationStatus: "Normal",
    aiRecommendation: [
      "Reduce GEN-07 load to 60% until replacement arrives",
      "Switch primary load to GEN-01",
      "Engineer Suresh Babu to monitor GEN-07 hourly",
      "Expedite ANT-1024 shipment — escalate to port authority",
    ],
    aiReasoning: [
      "GEN-07 temperature at 89°C exceeds safe threshold of 82°C",
      "GEN-01 has 94% health and can absorb load",
      "ANT-1024 delayed 36h — manual mitigation required in interim",
    ],
    dispatchedAt: undefined,
    resolvedAt: undefined,
  },
];

// ────────────────────────────────────────────────────────────
// ACTIVITY / AUDIT LOG
// ────────────────────────────────────────────────────────────
export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  module: string;
  action: string;
  target: string;
  status: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
}

export const INITIAL_AUDIT_LOG: AuditEvent[] = [
  { id: "AUD-001", timestamp: "Jan 10 06:00", actor: "System", module: "System", action: "POLARIS operational session started — ISEA-2027 active", target: "ISEA-2027", status: "INFO" },
  { id: "AUD-002", timestamp: "Jan 10 06:05", actor: "Dr. Anand Sharma", module: "Command Center", action: "Expedition ISEA-2027 readiness reviewed", target: "ISEA-2027", status: "SUCCESS" },
  { id: "AUD-003", timestamp: "Jan 10 09:30", actor: "Engineer Suresh Babu", module: "Assets", action: "GEN-07 health warning logged — cooling pump temperature exceeded threshold", target: "GEN-07", status: "WARNING" },
  { id: "AUD-004", timestamp: "Jan 10 09:35", actor: "System", module: "Cargo", action: "ANT-1024 status updated to DELAYED — Cape Town port congestion", target: "ANT-1024", status: "WARNING" },
  { id: "AUD-005", timestamp: "Jan 10 10:00", actor: "Lt. Kiran Joshi", module: "Inventory", action: "Inventory audit completed — Diesel at 16.7 days flagged WARNING", target: "INV-001", status: "WARNING" },
  { id: "AUD-006", timestamp: "Jan 10 10:15", actor: "System", module: "Personnel", action: "Vikram Rao departed Bharati Station for Field Camp Alpha", target: "PER-001", status: "INFO" },
  { id: "AUD-007", timestamp: "Jan 10 10:57", actor: "System", module: "Personnel", action: "OVERDUE ALERT — Vikram Rao check-in overdue by 42 minutes", target: "PER-001", status: "WARNING" },
  { id: "AUD-008", timestamp: "Jan 10 10:58", actor: "System", module: "Emergency", action: "Incident INC-001 auto-generated — Personnel overdue", target: "INC-001", status: "WARNING" },
];

// ────────────────────────────────────────────────────────────
// OPERATIONAL RISKS (derived)
// ────────────────────────────────────────────────────────────
export interface OperationalRisk {
  id: string;
  severity: Priority;
  title: string;
  description: string;
  module: string;
  entityId: string;
}

export const INITIAL_RISKS: OperationalRisk[] = [
  {
    id: "RISK-001",
    severity: "CRITICAL",
    title: "Personnel Overdue — Vikram Rao",
    description: "Field Geologist Vikram Rao has not checked in for 42 min. Last position: Field Camp Alpha, 14.2 km from Bharati.",
    module: "Personnel",
    entityId: "PER-001",
  },
  {
    id: "RISK-002",
    severity: "HIGH",
    title: "Cargo Delayed — ANT-1024",
    description: "Generator Cooling Pump delayed by +36 hours. GEN-07 health declining.",
    module: "Cargo",
    entityId: "ANT-1024",
  },
  {
    id: "RISK-003",
    severity: "HIGH",
    title: "Inventory Warning — Bharati Diesel",
    description: "Diesel at Bharati Station predicted to reach critical level within 16.7 days.",
    module: "Inventory",
    entityId: "INV-001",
  },
  {
    id: "RISK-004",
    severity: "MEDIUM",
    title: "Asset Health Warning — GEN-07",
    description: "GEN-07 temperature at 89°C. Cooling pump replacement part delayed.",
    module: "Assets",
    entityId: "GEN-07",
  },
];

// ────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  module: string;
  entityId: string;
  timestamp: string;
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "NOT-001", type: "error", title: "Personnel Overdue", message: "Vikram Rao has not checked in for 42 minutes.", module: "Personnel", entityId: "PER-001", timestamp: "10:57", read: false },
  { id: "NOT-002", type: "warning", title: "Cargo Delayed", message: "ANT-1024 (Generator Cooling Pump) delayed +36 hours.", module: "Cargo", entityId: "ANT-1024", timestamp: "09:35", read: false },
  { id: "NOT-003", type: "warning", title: "Inventory Warning", message: "Bharati diesel at 16.7 days remaining.", module: "Inventory", entityId: "INV-001", timestamp: "10:00", read: false },
  { id: "NOT-004", type: "warning", title: "Asset Warning", message: "GEN-07 health at 64%. Cooling pump temperature elevated.", module: "Assets", entityId: "GEN-07", timestamp: "09:30", read: false },
];
