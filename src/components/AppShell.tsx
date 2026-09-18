"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard, Route, Package, Archive, Users, Wrench,
  ShieldAlert, Cpu, BarChart3, ClipboardList, Bell, Search, X,
  RefreshCw, CloudSnow, LogOut, Menu, ChevronRight, Wifi, WifiOff,
  CheckCircle2, AlertTriangle, Info, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp, PageKey } from "@/store/appStore";

// Lazy module imports
import CommandCenter from "./modules/CommandCenter";
import Expeditions from "./modules/Expeditions";
import Cargo from "./modules/Cargo";
import Inventory from "./modules/Inventory";
import Personnel from "./modules/Personnel";
import Assets from "./modules/Assets";
import Emergency from "./modules/Emergency";
import AICopilot from "./modules/AICopilot";
import Analytics from "./modules/Analytics";
import AuditLog from "./modules/AuditLog";

const NAV_ITEMS: { key: PageKey; icon: React.ElementType; label: string }[] = [
  { key: "COMMAND CENTER", icon: LayoutDashboard, label: "Command Center" },
  { key: "EXPEDITIONS", icon: Route, label: "Expeditions" },
  { key: "CARGO", icon: Package, label: "Cargo" },
  { key: "INVENTORY", icon: Archive, label: "Inventory" },
  { key: "PERSONNEL", icon: Users, label: "Personnel" },
  { key: "ASSETS", icon: Wrench, label: "Assets" },
  { key: "EMERGENCY", icon: ShieldAlert, label: "Emergency" },
  { key: "AI COPILOT", icon: Cpu, label: "AI Copilot" },
  { key: "ANALYTICS", icon: BarChart3, label: "Analytics" },
  { key: "AUDIT LOG", icon: ClipboardList, label: "Audit Log" },
];

export default function AppShell() {
  const router = useRouter();
  const { state, dispatch, showToast, navigate } = useApp();
  const [authChecking, setAuthChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem("polaris_auth");
    if (!auth) router.push("/login");
    else setAuthChecking(false);
  }, [router]);

  useEffect(() => {
    if (state.searchOpen && searchRef.current) searchRef.current.focus();
  }, [state.searchOpen]);

  const handleLogout = () => {
    localStorage.removeItem("polaris_auth");
    router.push("/login");
  };

  const handleSync = () => {
    dispatch({ type: "SYNC_NOW" });
    setTimeout(() => {
      dispatch({ type: "SYNC_COMPLETE" });
      showToast(`${state.syncQueue} actions synchronized successfully`);
    }, 2000);
  };

  const unreadCount = state.notifications.filter(n => !n.read).length;
  const criticalIncidents = state.incidents.filter(i => i.status === "OPEN" && i.severity === "CRITICAL");

  // Global search results
  const searchResults = searchInput.trim().length > 1 ? [
    ...state.expeditions.filter(e => `${e.id} ${e.name} ${e.fullName}`.toLowerCase().includes(searchInput.toLowerCase())).map(e => ({ type: "Expedition", id: e.id, title: e.name, sub: e.fullName, page: "EXPEDITIONS" as PageKey })),
    ...state.cargo.filter(c => `${c.id} ${c.description}`.toLowerCase().includes(searchInput.toLowerCase())).map(c => ({ type: "Cargo", id: c.id, title: c.id, sub: c.description, page: "CARGO" as PageKey })),
    ...state.inventory.filter(i => i.name.toLowerCase().includes(searchInput.toLowerCase())).map(i => ({ type: "Inventory", id: i.id, title: i.name, sub: `${i.station} — ${i.daysRemaining}d remaining`, page: "INVENTORY" as PageKey })),
    ...state.personnel.filter(p => p.name.toLowerCase().includes(searchInput.toLowerCase())).map(p => ({ type: "Personnel", id: p.id, title: p.name, sub: `${p.role} — ${p.status}`, page: "PERSONNEL" as PageKey })),
    ...state.assets.filter(a => `${a.id} ${a.name}`.toLowerCase().includes(searchInput.toLowerCase())).map(a => ({ type: "Asset", id: a.id, title: a.id, sub: `${a.name} — ${a.health}% health`, page: "ASSETS" as PageKey })),
    ...state.incidents.filter(i => `${i.id} ${i.title}`.toLowerCase().includes(searchInput.toLowerCase())).map(i => ({ type: "Incident", id: i.id, title: i.id, sub: i.title, page: "EMERGENCY" as PageKey })),
  ] : [];

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f4f9fd] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-700 font-mono tracking-widest text-sm animate-pulse">VERIFYING CLEARANCE…</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (state.page) {
      case "COMMAND CENTER": return <CommandCenter />;
      case "EXPEDITIONS": return <Expeditions />;
      case "CARGO": return <Cargo />;
      case "INVENTORY": return <Inventory />;
      case "PERSONNEL": return <Personnel />;
      case "ASSETS": return <Assets />;
      case "EMERGENCY": return <Emergency />;
      case "AI COPILOT": return <AICopilot />;
      case "ANALYTICS": return <Analytics />;
      case "AUDIT LOG": return <AuditLog />;
      default: return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f9fd] text-slate-900 flex">
      {/* Toast */}
      {state.toast && (
        <div className="fixed top-5 right-5 z-[100] flex items-center gap-3 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="text-green-700 shrink-0" size={18} />
          <span className="text-sm font-medium">{state.toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-blue-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Brand */}
        <div className="p-5 border-b border-blue-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <CloudSnow size={18} className="text-blue-900" />
            </div>
            <div>
              <p className="text-slate-900 font-bold tracking-wider text-sm">POLARIS</p>
              <p className="text-blue-700/70 text-[10px] tracking-widest">EXPEDITION COMMAND</p>
            </div>
          </div>
        </div>

        {/* Mission pill */}
        <div className="px-4 py-3 border-b border-blue-100">
          <div className="flex items-center gap-2 bg-blue-100 border border-cyan-700/30 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <p className="text-blue-800 text-[11px] font-bold">ISEA-2027</p>
              <p className="text-blue-600/70 text-[10px]">MISSION ACTIVE</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => {
            const isActive = state.page === key;
            const hasCritical = key === "EMERGENCY" && criticalIncidents.length > 0;
            return (
              <button
                key={key}
                onClick={() => { navigate(key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-blue-100 text-blue-800 border border-cyan-500/20"
                    : "text-slate-600 hover:text-slate-800 hover:bg-blue-50"
                }`}
              >
                <Icon size={16} className={isActive ? "text-blue-700" : "text-slate-500 group-hover:text-slate-700"} />
                <span className="flex-1 text-left">{label}</span>
                {hasCritical && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              </button>
            );
          })}
        </nav>

        {/* Station telemetry footer */}
        <div className="p-3 border-t border-blue-200">
          <div className="bg-blue-50 border border-slate-300/50 rounded-lg p-3 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-blue-700 font-medium">Bharati Station</span>
              <span className="text-slate-600">-34°C</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Wind: 38 kts SW</span>
              <span className="text-green-600 flex items-center gap-1"><Wifi size={10} /> IRIDIUM</span>
            </div>
          </div>
          <p className="text-center text-slate-600 text-[10px] mt-2">Prototype · Synthetic Operational Data</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-[#f4f9fd]/95 backdrop-blur-md border-b border-blue-100 flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600 hover:text-blue-900" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-slate-600 text-sm">PS 26062</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-700 text-sm font-medium">Polar Expedition Command</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PROTOTYPE badge */}
            <span className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-amber-900/30 border border-amber-600/30 rounded text-amber-400 text-[10px] font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              PROTOTYPE MODE
            </span>

            {/* Sync status */}
            <button onClick={handleSync} className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
              state.syncStatus === "synced" ? "border-emerald-700/30 bg-emerald-950/30 text-green-700"
              : state.syncStatus === "syncing" ? "border-cyan-700/30 bg-cyan-950/30 text-blue-700"
              : state.syncQueue > 0 ? "border-amber-700/30 bg-amber-950/30 text-amber-400"
              : "border-slate-300/30 bg-blue-50 text-slate-600"
            }`}>
              {state.syncStatus === "syncing" ? <RefreshCw size={11} className="animate-spin" /> : state.syncStatus === "synced" ? <Wifi size={11} /> : <WifiOff size={11} />}
              {state.syncStatus === "syncing" ? "Syncing…" : state.syncStatus === "synced" ? "Synced" : state.syncQueue > 0 ? `${state.syncQueue} pending` : "OFFLINE-SYNC READY"}
            </button>

            {/* Search */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_SEARCH" })}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Search size={16} />
            </button>

            {/* Notifications */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_NOTIFICATION_PANEL" })}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-slate-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logout */}
            <button onClick={handleLogout} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Search overlay */}
        {state.searchOpen && (
          <div className="absolute top-14 left-0 right-0 z-50 bg-[#f4f9fd]/98 border-b border-blue-200 p-4 shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  ref={searchRef}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search expeditions, cargo, personnel, assets…"
                  className="w-full pl-9 pr-10 py-2.5 bg-blue-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button onClick={() => { dispatch({ type: "TOGGLE_SEARCH" }); setSearchInput(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-900">
                  <X size={14} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-slate-300 rounded-lg overflow-hidden">
                  {searchResults.map((r, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 transition-colors text-left border-b border-slate-200 last:border-0"
                      onClick={() => { navigate(r.page); dispatch({ type: "TOGGLE_SEARCH" }); setSearchInput(""); }}>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-cyan-900/50 text-blue-700 rounded">{r.type}</span>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">{r.title}</p>
                        <p className="text-xs text-slate-500">{r.sub}</p>
                      </div>
                      <ChevronRight size={14} className="ml-auto text-slate-600" />
                    </button>
                  ))}
                </div>
              )}
              {searchInput.trim().length > 1 && searchResults.length === 0 && (
                <p className="text-center text-slate-500 text-sm mt-3">No results found for "{searchInput}"</p>
              )}
            </div>
          </div>
        )}

        {/* Notification panel */}
        {state.notificationPanelOpen && (
          <div className="absolute top-14 right-0 z-50 w-80 bg-[#f4f9fd] border border-blue-200 shadow-2xl rounded-bl-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <span className="text-sm font-semibold text-blue-900">Notifications</span>
              <div className="flex items-center gap-2">
                <button onClick={() => dispatch({ type: "MARK_ALL_READ" })} className="text-[11px] text-blue-700 hover:text-blue-800">Mark all read</button>
                <button onClick={() => dispatch({ type: "TOGGLE_NOTIFICATION_PANEL" })} className="text-slate-600 hover:text-blue-900"><X size={14} /></button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
              {state.notifications.map(n => (
                <button key={n.id} className={`w-full text-left px-4 py-3 hover:bg-slate-100/50 transition-colors ${!n.read ? "bg-blue-50" : ""}`}
                  onClick={() => { dispatch({ type: "MARK_NOTIFICATION_READ", id: n.id }); navigate(n.module.toUpperCase() as any); dispatch({ type: "TOGGLE_NOTIFICATION_PANEL" }); }}>
                  <div className="flex items-start gap-2">
                    {n.type === "error" ? <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" /> : n.type === "warning" ? <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" /> : n.type === "success" ? <CheckCircle2 size={14} className="text-green-700 mt-0.5 shrink-0" /> : <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{n.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{n.timestamp}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
