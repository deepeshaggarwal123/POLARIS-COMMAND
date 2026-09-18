"use client";
import React, { createContext, useContext, useReducer, useCallback } from "react";
import {
  EXPEDITIONS, CARGO_ITEMS, INVENTORY_ITEMS, PERSONNEL, ASSETS, INCIDENTS,
  INITIAL_AUDIT_LOG, INITIAL_RISKS, INITIAL_NOTIFICATIONS,
  Expedition, CargoItem, InventoryItem, PersonnelMember, Asset, Incident,
  AuditEvent, OperationalRisk, AppNotification,
} from "@/data/demoData";

// ────────────────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────────────────
export type PageKey =
  | "COMMAND CENTER" | "EXPEDITIONS" | "CARGO" | "INVENTORY"
  | "PERSONNEL" | "ASSETS" | "EMERGENCY" | "AI COPILOT"
  | "ANALYTICS" | "AUDIT LOG";

export interface AppState {
  page: PageKey;
  expeditions: Expedition[];
  cargo: CargoItem[];
  inventory: InventoryItem[];
  personnel: PersonnelMember[];
  assets: Asset[];
  incidents: Incident[];
  auditLog: AuditEvent[];
  risks: OperationalRisk[];
  notifications: AppNotification[];
  toast: string | null;
  syncQueue: number;
  syncStatus: "idle" | "syncing" | "synced";
  demoStep: number;
  demoActive: boolean;
  searchQuery: string;
  notificationPanelOpen: boolean;
  searchOpen: boolean;
}

const initialState: AppState = {
  page: "COMMAND CENTER",
  expeditions: EXPEDITIONS,
  cargo: CARGO_ITEMS,
  inventory: INVENTORY_ITEMS,
  personnel: PERSONNEL,
  assets: ASSETS,
  incidents: INCIDENTS,
  auditLog: INITIAL_AUDIT_LOG,
  risks: INITIAL_RISKS,
  notifications: INITIAL_NOTIFICATIONS,
  toast: null,
  syncQueue: 3,
  syncStatus: "idle",
  demoStep: 0,
  demoActive: false,
  searchQuery: "",
  notificationPanelOpen: false,
  searchOpen: false,
};

// ────────────────────────────────────────────────────────────
// ACTIONS
// ────────────────────────────────────────────────────────────
type Action =
  | { type: "SET_PAGE"; page: PageKey }
  | { type: "SET_TOAST"; message: string | null }
  | { type: "UPDATE_CARGO_STATUS"; id: string; status: CargoItem["status"] }
  | { type: "UPDATE_PERSONNEL_STATUS"; id: string; status: PersonnelMember["status"]; location?: string }
  | { type: "PERSONNEL_CHECKIN"; id: string }
  | { type: "UPDATE_ASSET_HEALTH"; id: string; health: number }
  | { type: "RUN_INVENTORY_FORECAST"; id: string }
  | { type: "CREATE_REPLENISHMENT"; id: string; qty: number }
  | { type: "TRIGGER_INCIDENT"; incidentId: string }
  | { type: "DISPATCH_RESPONSE"; incidentId: string }
  | { type: "RESOLVE_INCIDENT"; incidentId: string }
  | { type: "ADD_AUDIT_EVENT"; event: Omit<AuditEvent, "id"> }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "SYNC_NOW" }
  | { type: "SYNC_COMPLETE" }
  | { type: "SET_SEARCH"; query: string }
  | { type: "TOGGLE_NOTIFICATION_PANEL" }
  | { type: "TOGGLE_SEARCH" }
  | { type: "CREATE_EXPEDITION"; expedition: Expedition }
  | { type: "START_DEMO" }
  | { type: "RESET_DEMO" };

let auditCounter = INITIAL_AUDIT_LOG.length + 1;
const mkAuditId = () => `AUD-${String(auditCounter++).padStart(3, "0")}`;

function addAudit(state: AppState, event: Omit<AuditEvent, "id">): AuditEvent[] {
  return [{ ...event, id: mkAuditId() }, ...state.auditLog].slice(0, 200);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.page, notificationPanelOpen: false, searchOpen: false };

    case "SET_TOAST":
      return { ...state, toast: action.message };

    case "UPDATE_CARGO_STATUS": {
      const cargo = state.cargo.map(c => c.id === action.id ? { ...c, status: action.status } : c);
      const risks = action.status === "DELIVERED"
        ? state.risks.filter(r => r.entityId !== action.id)
        : state.risks;
      return {
        ...state, cargo, risks,
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Operator", module: "Cargo", action: `Cargo ${action.id} status updated to ${action.status}`, target: action.id, status: "SUCCESS" }),
        syncQueue: state.syncQueue + 1,
      };
    }

    case "UPDATE_PERSONNEL_STATUS": {
      const personnel = state.personnel.map(p =>
        p.id === action.id ? {
          ...p,
          status: action.status,
          currentLocation: action.location || p.currentLocation,
          movementHistory: action.location
            ? [...p.movementHistory, { location: action.location, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]
            : p.movementHistory,
        } : p
      );
      const isResolved = action.status === "ACTIVE" || action.status === "CHECKED_IN";
      const risks = isResolved ? state.risks.filter(r => r.entityId !== action.id) : state.risks;
      return {
        ...state, personnel, risks,
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Operator", module: "Personnel", action: `${personnel.find(p => p.id === action.id)?.name} status updated to ${action.status}${action.location ? ` — moved to ${action.location}` : ""}`, target: action.id, status: isResolved ? "SUCCESS" : "WARNING" }),
        syncQueue: state.syncQueue + 1,
      };
    }

    case "PERSONNEL_CHECKIN": {
      const p = state.personnel.find(p => p.id === action.id);
      if (!p) return state;
      const updated = state.personnel.map(per =>
        per.id === action.id ? { ...per, status: "CHECKED_IN" as const, lastCheckIn: "Just now", minutesSinceCheckIn: 0, movementHistory: [...per.movementHistory, { location: per.currentLocation, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] } : per
      );
      return {
        ...state,
        personnel: updated,
        risks: state.risks.filter(r => r.entityId !== action.id),
        incidents: state.incidents.map(i => i.personnelInvolved.includes(p.name) && i.status === "OPEN" ? { ...i, status: "RESOLVED" as const, resolvedAt: new Date().toLocaleTimeString() } : i),
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: p.name, module: "Personnel", action: `${p.name} checked in successfully`, target: action.id, status: "SUCCESS" }),
        syncQueue: state.syncQueue + 1,
      };
    }

    case "UPDATE_ASSET_HEALTH": {
      const assets = state.assets.map(a =>
        a.id === action.id ? {
          ...a, health: action.health,
          status: action.health >= 80 ? "OPERATIONAL" as const : action.health >= 50 ? "WARNING" as const : "CRITICAL" as const,
          nextMaintenance: action.health >= 80 ? "Scheduled" : "OVERDUE",
        } : a
      );
      return {
        ...state, assets,
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Operator", module: "Assets", action: `Asset ${action.id} health check run — ${action.health}%`, target: action.id, status: action.health < 60 ? "WARNING" : "SUCCESS" }),
      };
    }

    case "CREATE_REPLENISHMENT": {
      const item = state.inventory.find(i => i.id === action.id);
      if (!item) return state;
      const newStock = item.currentStock + action.qty;
      const newDays = Math.round(newStock / item.dailyConsumption);
      const inventory = state.inventory.map(i =>
        i.id === action.id ? { ...i, currentStock: newStock, daysRemaining: newDays, status: newDays > 25 ? "HEALTHY" as const : "WARNING" as const } : i
      );
      return {
        ...state, inventory,
        risks: state.risks.filter(r => r.entityId !== action.id),
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Operator", module: "Inventory", action: `Replenishment request created for ${item.name} — ${action.qty} ${item.unit}`, target: action.id, status: "SUCCESS" }),
        syncQueue: state.syncQueue + 1,
      };
    }

    case "TRIGGER_INCIDENT": {
      const incident = state.incidents.find(i => i.id === action.incidentId);
      if (!incident) return state;
      return {
        ...state,
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Commander", module: "Emergency", action: `Incident ${action.incidentId} triggered — AI analysis requested`, target: action.incidentId, status: "WARNING" }),
      };
    }

    case "DISPATCH_RESPONSE": {
      const incidents = state.incidents.map(i =>
        i.id === action.incidentId ? {
          ...i, status: "RESPONDING" as const,
          dispatchedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          respondingTeam: "RV-02 + Medical Team Alpha + DRONE-03",
        } : i
      );
      const notifications: AppNotification[] = [{
        id: `NOT-${Date.now()}`, type: "success", title: "Rescue Dispatched",
        message: "RV-02, Medical Team Alpha and DRONE-03 dispatched for INC-001.",
        module: "Emergency", entityId: action.incidentId,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false,
      }, ...state.notifications];
      return {
        ...state, incidents, notifications,
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Commander", module: "Emergency", action: `RESPONSE DISPATCHED — RV-02 + Medical Team Alpha + DRONE-03 deployed for ${action.incidentId}`, target: action.incidentId, status: "SUCCESS" }),
        syncQueue: state.syncQueue + 1,
      };
    }

    case "RESOLVE_INCIDENT": {
      const incidents = state.incidents.map(i =>
        i.id === action.incidentId ? { ...i, status: "RESOLVED" as const, resolvedAt: new Date().toLocaleTimeString() } : i
      );
      return {
        ...state, incidents,
        risks: state.risks.filter(r => r.id !== "RISK-001"),
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Commander", module: "Emergency", action: `Incident ${action.incidentId} resolved`, target: action.incidentId, status: "SUCCESS" }),
      };
    }

    case "ADD_AUDIT_EVENT":
      return { ...state, auditLog: [{ ...action.event, id: mkAuditId() }, ...state.auditLog] };

    case "MARK_NOTIFICATION_READ":
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) };

    case "MARK_ALL_READ":
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };

    case "SYNC_NOW":
      return { ...state, syncStatus: "syncing" };

    case "SYNC_COMPLETE":
      return { ...state, syncStatus: "synced", syncQueue: 0 };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };

    case "TOGGLE_NOTIFICATION_PANEL":
      return { ...state, notificationPanelOpen: !state.notificationPanelOpen, searchOpen: false };

    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen, notificationPanelOpen: false };

    case "CREATE_EXPEDITION": {
      return {
        ...state,
        expeditions: [action.expedition, ...state.expeditions],
        auditLog: addAudit(state, { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Commander", module: "Expeditions", action: `New expedition ${action.expedition.id} created — ${action.expedition.fullName}`, target: action.expedition.id, status: "SUCCESS" }),
        syncQueue: state.syncQueue + 1,
      };
    }

    case "START_DEMO":
      return { ...state, demoActive: true, demoStep: 1 };

    case "RESET_DEMO":
      return { ...initialState };

    default:
      return state;
  }
}

// ────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  showToast: (msg: string) => void;
  navigate: (page: PageKey) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = useCallback((msg: string) => {
    dispatch({ type: "SET_TOAST", message: msg });
    setTimeout(() => dispatch({ type: "SET_TOAST", message: null }), 4000);
  }, []);

  const navigate = useCallback((page: PageKey) => {
    dispatch({ type: "SET_PAGE", page });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, navigate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
