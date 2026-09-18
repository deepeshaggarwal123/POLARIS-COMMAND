"use client";
import React, { useState } from "react";
import { useApp } from "@/store/appStore";
import { Users, MapPin, Clock, AlertTriangle, CheckCircle2, X, Radio } from "lucide-react";
import { PersonnelMember } from "@/data/demoData";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-green-700 border-emerald-500/30",
  CHECKED_IN: "bg-blue-100 text-blue-700 border-cyan-500/30",
  OVERDUE: "bg-red-500/15 text-red-400 border-red-500/40",
  EMERGENCY: "bg-red-700/20 text-red-300 border-red-600/50",
  STANDBY: "bg-slate-500/10 text-textSecondary border-slate-500/30",
};

const LOCATIONS = [
  "Bharati Station", "Maitri Station", "Himadri Station",
  "Field Camp Alpha", "Field Camp Beta", "Ridge Alpha", "Research Lab",
  "Medical Bay", "Generator Room", "Cargo Bay", "Observation Deck",
];

export default function Personnel() {
  const { state, dispatch, showToast } = useApp();
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<PersonnelMember | null>(null);
  const [moveTo, setMoveTo] = useState("");
  const [showMove, setShowMove] = useState(false);

  const filtered = state.personnel.filter(p =>
    filter === "ALL" ? true : filter === "OVERDUE" ? p.status === "OVERDUE" : filter === "ACTIVE" ? p.status === "ACTIVE" || p.status === "CHECKED_IN" : true
  );

  const handleCheckIn = (id: string) => {
    dispatch({ type: "PERSONNEL_CHECKIN", id });
    showToast("Check-in recorded successfully");
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: "CHECKED_IN", lastCheckIn: "Just now" } : null);
  };

  const handleMove = (id: string) => {
    if (!moveTo) { showToast("Select a destination"); return; }
    dispatch({ type: "UPDATE_PERSONNEL_STATUS", id, status: "ACTIVE", location: moveTo });
    showToast(`${selected?.name} movement recorded → ${moveTo}`);
    setShowMove(false);
    setMoveTo("");
    if (selected) setSelected(prev => prev ? { ...prev, currentLocation: moveTo, status: "ACTIVE" } : null);
  };

  const handleMarkOverdue = (id: string) => {
    dispatch({ type: "UPDATE_PERSONNEL_STATUS", id, status: "OVERDUE" });
    showToast("Personnel marked as OVERDUE — incident log updated");
  };

  const overduePersonnel = state.personnel.filter(p => p.status === "OVERDUE");

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Personnel Movement</h1>
          <p className="text-textSecondary text-sm mt-0.5">Real-time personnel tracking, movement management, and check-in monitoring</p>
        </div>
        <div className="flex items-center gap-1 bg-pureWhite/60 border border-softBeige/40 rounded-lg p-1">
          {["ALL", "OVERDUE", "ACTIVE"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-cyan-600/40 text-blue-800 border border-cyan-500/30" : "text-textSecondary hover:text-textMain"}`}>
              {f} {f === "OVERDUE" && overduePersonnel.length > 0 && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* OVERDUE ALERT BANNER */}
      {overduePersonnel.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/40 rounded-xl animate-pulse">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-bold text-sm">OVERDUE PERSONNEL ALERT</p>
            {overduePersonnel.map(p => (
              <p key={p.id} className="text-red-200 text-xs mt-0.5">
                <strong>{p.name}</strong> — Last check-in: {p.lastCheckIn} — Location: {p.currentLocation}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-softBeige text-xs text-textSecondary uppercase tracking-wider">
                {["Name", "Role", "Expedition", "Current Location", "Last Check-In", "Status", "Communication", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-warmBeige transition-colors cursor-pointer ${p.status === "OVERDUE" ? "bg-red-500/5" : ""}`} onClick={() => setSelected(p)}>
                  <td className="px-4 py-3">
                    <p className="text-textMain font-medium">{p.name}</p>
                    <p className="text-textSecondary text-xs">{p.team}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{p.role}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-blue-700">{p.expedition}</span></td>
                  <td className="px-4 py-3 text-xs text-textSecondary max-w-[150px]">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={11} className="text-textSecondary mt-0.5 shrink-0" />
                      <span className="truncate">{p.currentLocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className={p.minutesSinceCheckIn > 30 ? "text-red-400" : "text-textSecondary"} />
                      <span className={`text-xs ${p.minutesSinceCheckIn > 30 ? "text-red-400 font-bold" : "text-textSecondary"}`}>{p.lastCheckIn}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[p.status]} ${p.status === "OVERDUE" ? "animate-pulse" : ""}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Radio size={11} className="text-textSecondary" />
                      <span className="text-xs text-textSecondary truncate max-w-[100px]">{p.communication}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleCheckIn(p.id)} className="px-2 py-1 text-xs bg-emerald-900/30 hover:bg-emerald-800/40 text-green-700 rounded border border-emerald-800/30 transition-colors">
                        Check In
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Map */}
      <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-softBeige">
          <h2 className="text-sm font-semibold text-blue-900">Personnel Position Map — Simulated</h2>
          <p className="text-xs text-textSecondary">Bharati Station Operational Sector</p>
        </div>
        <svg viewBox="0 0 500 220" className="w-full h-48" style={{ background: "#030d16" }}>
          {[50, 100, 150, 200, 250, 300, 350, 400, 450].map(x => <line key={x} x1={x} y1={0} x2={x} y2={220} stroke="#0e2030" strokeWidth={1} />)}
          {[55, 110, 165].map(y => <line key={y} x1={0} y1={y} x2={500} y2={y} stroke="#0e2030" strokeWidth={1} />)}
          {/* Bharati */}
          <circle cx={180} cy={110} r={18} fill="#0ea5e9" opacity={0.15} /><circle cx={180} cy={110} r={10} fill="#0ea5e9" /><text x={195} y={108} fill="#7dd3fc" fontSize={11} fontWeight="bold">Bharati Station</text>
          {/* Personnel dots */}
          {state.personnel.filter(p => p.currentLocation.includes("Bharati") || p.currentLocation.includes("Research") || p.currentLocation.includes("Generator") || p.currentLocation.includes("Medical") || p.currentLocation.includes("Cargo") || p.currentLocation.includes("Command")).map((p, i) => (
            <g key={p.id}><circle cx={160 + (i % 5) * 12} cy={135 + Math.floor(i / 5) * 12} r={4} fill={p.status === "OVERDUE" ? "#ef4444" : "#10b981"} /><title>{p.name}</title></g>
          ))}
          {/* Vikram at Field Camp Alpha */}
          {state.personnel.find(p => p.id === "PER-001" && p.status === "OVERDUE") && (
            <>
              <line x1={180} y1={120} x2={330} y2={185} stroke="#6b7280" strokeWidth={1} strokeDasharray="4 3" />
              <text x={240} y={155} fill="#9ca3af" fontSize={8} transform="rotate(-20 240 155)">14.2 km</text>
              <circle cx={330} cy={185} r={6} fill="#ef4444" opacity={0.3}><animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" /></circle>
              <circle cx={330} cy={185} r={5} fill="#ef4444" />
              <text x={340} y={183} fill="#fca5a5" fontSize={9} fontWeight="bold">Vikram Rao</text>
              <text x={340} y={194} fill="#ef4444" fontSize={8}>OVERDUE · Field Camp Alpha</text>
            </>
          )}
          {/* Legend */}
          <circle cx={15} cy={205} r={4} fill="#10b981" /><text x={22} y={209} fill="#6b7280" fontSize={9}>Active</text>
          <circle cx={65} cy={205} r={4} fill="#ef4444" /><text x={72} y={209} fill="#6b7280" fontSize={9}>Overdue</text>
        </svg>
      </div>

      {/* Personnel Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-end p-4">
          <div className="w-full max-w-lg bg-warmWhite border border-softBeige/50 rounded-xl overflow-y-auto max-h-full shadow-2xl">
            <div className="sticky top-0 bg-warmWhite border-b border-softBeige px-5 py-4 flex justify-between items-start">
              <div>
                <p className="text-textMain font-bold text-lg">{selected.name}</p>
                <p className="text-textSecondary text-sm">{selected.role} · {selected.team}</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[selected.status]} ${selected.status === "OVERDUE" ? "animate-pulse" : ""}`}>{selected.status}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-textSecondary hover:text-blue-900"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[["Expedition", selected.expedition], ["Station", selected.station], ["Current Location", selected.currentLocation], ["Previous Location", selected.previousLocation], ["Last Check-In", selected.lastCheckIn], ["Communication", selected.communication]].map(([k, v]) => (
                  <div key={k}><p className="text-textSecondary">{k}</p><p className="text-textMain font-medium">{v}</p></div>
                ))}
              </div>

              {/* Movement History */}
              <div>
                <h3 className="text-sm font-semibold text-textMain mb-2">Movement History</h3>
                <div className="space-y-1.5">
                  {selected.movementHistory.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span className="text-textSecondary">{m.location}</span>
                      <span className="ml-auto text-textSecondary">{m.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button onClick={() => handleCheckIn(selected.id)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-green-800 rounded-lg text-sm font-medium transition-colors">
                  <CheckCircle2 size={16} /> Record Check-In
                </button>
                <div>
                  <button onClick={() => setShowMove(!showMove)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 text-blue-800 rounded-lg text-sm font-medium transition-colors">
                    <MapPin size={16} /> Simulate Movement
                  </button>
                  {showMove && (
                    <div className="mt-2 flex gap-2">
                      <select value={moveTo} onChange={e => setMoveTo(e.target.value)} className="flex-1 px-3 py-2 bg-slate-100 border border-softBeige rounded-lg text-sm text-textMain focus:outline-none focus:border-cyan-500">
                        <option value="">Select destination…</option>
                        {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                      </select>
                      <button onClick={() => handleMove(selected.id)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-textMain rounded-lg text-sm font-medium">Confirm</button>
                    </div>
                  )}
                </div>
                {selected.status !== "OVERDUE" && (
                  <button onClick={() => { handleMarkOverdue(selected.id); setSelected(null); }} className="w-full py-2.5 bg-red-900/20 hover:bg-red-900/30 border border-red-800/30 text-red-400 rounded-lg text-sm font-medium transition-colors">
                    Mark Overdue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
