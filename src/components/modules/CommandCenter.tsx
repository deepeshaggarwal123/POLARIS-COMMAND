"use client";
import React from "react";
import { useApp } from "@/store/appStore";
import { Users, Package, Archive, Wrench, ShieldAlert, ChevronRight, AlertTriangle, CheckCircle2, Activity, MapPin } from "lucide-react";

function KpiCard({ label, value, sub, icon: Icon, color, onClick }: { label: string; value: string; sub: string; icon: React.ElementType; color: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`bg-white/70 border border-slate-300/50 rounded-xl p-4 flex items-start gap-4 hover:border-${color}-500/40 hover:bg-slate-100/50 transition-all text-left w-full group`}>
      <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center shrink-0`}>
        <Icon size={20} className={`text-${color}-400`} />
      </div>
      <div>
        <p className="text-slate-600 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
    </button>
  );
}

const SEVERITY_COLOR: Record<string, string> = { CRITICAL: "red", HIGH: "amber", MEDIUM: "yellow", LOW: "slate" };
const SEVERITY_BG: Record<string, string> = { CRITICAL: "bg-red-500/10 border-red-500/30 text-red-400", HIGH: "bg-amber-500/10 border-amber-500/30 text-amber-400", MEDIUM: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400", LOW: "bg-slate-500/10 border-slate-500/30 text-slate-600" };

export default function CommandCenter() {
  const { state, navigate } = useApp();

  const activePersonnel = state.personnel.filter(p => p.expedition === "ISEA-2027" && (p.status === "ACTIVE" || p.status === "CHECKED_IN" || p.status === "OVERDUE")).length;
  const cargoActive = state.cargo.filter(c => c.expedition === "ISEA-2027" && c.status !== "DELIVERED").length;
  const cargoTotal = state.cargo.filter(c => c.expedition === "ISEA-2027").length;
  const assetsOk = state.assets.filter(a => a.status === "OPERATIONAL").length;
  const assetsTotal = state.assets.length;
  const incidentOpen = state.incidents.filter(i => i.status === "OPEN").length;

  // Expedition readiness from state
  const expedition = state.expeditions.find(e => e.id === "ISEA-2027");
  const invReadiness = expedition?.inventoryReadiness ?? 91;
  const emergReadiness = expedition?.emergencyReadiness ?? 82;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 tracking-widest">POLARIS</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-500">PS 26062 · MoES / NCPOR</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Polar Expedition Command Center</h1>
          <p className="text-slate-600 text-sm mt-1">ISEA-2027 — International Scientific Expedition Antarctica 2027</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-green-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            MISSION ACTIVE
          </span>
          <span className="text-slate-600 text-xs italic">Prototype · Synthetic Operational Data</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard label="Personnel" value={`${activePersonnel}/45`} sub="Field deployed" icon={Users} color="blue" onClick={() => navigate("PERSONNEL")} />
        <KpiCard label="Cargo Active" value={`${cargoActive}/${cargoTotal}`} sub="In transit / staged" icon={Package} color="cyan" onClick={() => navigate("CARGO")} />
        <KpiCard label="Inventory" value={`${invReadiness}%`} sub="Station readiness" icon={Archive} color="emerald" onClick={() => navigate("INVENTORY")} />
        <KpiCard label="Assets Op." value={`${assetsOk}/${assetsTotal}`} sub="Operational assets" icon={Wrench} color="violet" onClick={() => navigate("ASSETS")} />
        <KpiCard label="Emergency" value={`${emergReadiness}%`} sub={incidentOpen > 0 ? `${incidentOpen} active incident${incidentOpen > 1 ? "s" : ""}` : "Readiness"} icon={ShieldAlert} color={incidentOpen > 0 ? "red" : "emerald"} onClick={() => navigate("EMERGENCY")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Queue */}
        <div className="lg:col-span-1 bg-white/60 border border-slate-300/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-blue-900">Operational Risk Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Active alerts requiring attention</p>
            </div>
            {state.risks.length > 0 && (
              <span className="w-5 h-5 bg-red-500 text-slate-900 text-[10px] font-bold rounded-full flex items-center justify-center">{state.risks.length}</span>
            )}
          </div>
          <div className="divide-y divide-slate-800">
            {state.risks.length === 0 && (
              <div className="px-4 py-6 flex items-center gap-2 text-green-700">
                <CheckCircle2 size={16} /> <span className="text-sm">All systems nominal</span>
              </div>
            )}
            {state.risks.map(risk => {
              const moduleMap: Record<string, () => void> = {
                Personnel: () => navigate("PERSONNEL"),
                Cargo: () => navigate("CARGO"),
                Inventory: () => navigate("INVENTORY"),
                Assets: () => navigate("ASSETS"),
                Emergency: () => navigate("EMERGENCY"),
              };
              return (
                <button key={risk.id} onClick={moduleMap[risk.module]} className="w-full px-4 py-3 hover:bg-slate-100/40 transition-colors text-left group">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold border ${SEVERITY_BG[risk.severity]}`}>{risk.severity}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{risk.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{risk.description}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 shrink-0 mt-1 group-hover:text-blue-700 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 bg-white/60 border border-slate-300/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-blue-900">Polar Operations Map — Bharati Station Sector</h2>
            <p className="text-xs text-slate-500">Larsemann Hills, East Antarctica · Simulated operational view</p>
          </div>
          <PolarMap vikramOverdue={state.personnel.find(p => p.id === "PER-001")?.status === "OVERDUE"} incidentActive={state.incidents.some(i => i.id === "INC-001" && i.status !== "RESOLVED")} responding={state.incidents.some(i => i.id === "INC-001" && i.status === "RESPONDING")} />
          <div className="px-4 py-2 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />Station</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />Incident</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Personnel</span>
            <span className="flex items-center gap-1.5"><span className="w-8 border-t border-dashed border-blue-400" />Cargo Route</span>
          </div>
        </div>
      </div>

      {/* Mission readiness bars */}
      <div className="bg-white/60 border border-slate-300/50 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">ISEA-2027 Mission Readiness</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { label: "Personnel", value: 93 },
            { label: "Cargo", value: 91 },
            { label: "Inventory", value: 91 },
            { label: "Assets", value: 89 },
            { label: "Emergency", value: 82 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{item.label}</span>
                <span className={item.value >= 85 ? "text-green-700" : item.value >= 70 ? "text-amber-400" : "text-red-400"}>{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${item.value >= 85 ? "bg-emerald-500" : item.value >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 border border-slate-300/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-blue-900">Recent Operational Activity</h2>
          <button onClick={() => navigate("AUDIT LOG")} className="text-xs text-blue-700 hover:text-blue-800">View all →</button>
        </div>
        <div className="divide-y divide-slate-800">
          {state.auditLog.slice(0, 6).map(evt => (
            <div key={evt.id} className="px-4 py-2.5 flex items-start gap-3">
              <Activity size={12} className={`mt-1 shrink-0 ${evt.status === "SUCCESS" ? "text-green-700" : evt.status === "WARNING" ? "text-amber-400" : evt.status === "ERROR" ? "text-red-400" : "text-slate-500"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 truncate">{evt.action}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{evt.timestamp} · {evt.module}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PolarMap({ vikramOverdue, incidentActive, responding }: { vikramOverdue: boolean; incidentActive: boolean; responding: boolean }) {
  return (
    <svg viewBox="0 0 600 360" className="w-full h-56 lg:h-72" style={{ background: "linear-gradient(135deg, #030d16 0%, #041524 50%, #051a2c 100%)" }}>
      {/* Grid */}
      {[60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={360} stroke="#0e2a3d" strokeWidth={1} />)}
      {[60, 120, 180, 240, 300].map(y => <line key={`h${y}`} x1={0} y1={y} x2={600} y2={y} stroke="#0e2a3d" strokeWidth={1} />)}

      {/* Cargo route line */}
      <line x1={600} y1={100} x2={260} y2={180} stroke="#0ea5e9" strokeWidth={2} strokeDasharray="8 4" opacity={0.6} />
      <text x={490} y={120} fill="#0ea5e9" fontSize={9} opacity={0.7}>M/V Bharati Sewa</text>

      {/* Himadri */}
      <circle cx={120} cy={80} r={8} fill="#10b981" opacity={0.8} />
      <circle cx={120} cy={80} r={14} fill="none" stroke="#10b981" strokeWidth={1} opacity={0.3} />
      <text x={135} y={78} fill="#34d399" fontSize={11} fontWeight="bold">Himadri</text>
      <text x={135} y={90} fill="#6b7280" fontSize={9}>Svalbard, Arctic</text>

      {/* Maitri */}
      <circle cx={420} cy={100} r={8} fill="#f59e0b" opacity={0.8} />
      <circle cx={420} cy={100} r={14} fill="none" stroke="#f59e0b" strokeWidth={1} opacity={0.3} />
      <text x={435} y={98} fill="#fbbf24" fontSize={11} fontWeight="bold">Maitri</text>
      <text x={435} y={110} fill="#6b7280" fontSize={9}>Queen Maud Land</text>

      {/* Bharati — main */}
      <circle cx={260} cy={180} r={12} fill="#0ea5e9" opacity={0.9} />
      <circle cx={260} cy={180} r={20} fill="none" stroke="#0ea5e9" strokeWidth={1.5} opacity={0.4} />
      <circle cx={260} cy={180} r={30} fill="none" stroke="#0ea5e9" strokeWidth={0.5} opacity={0.2} />
      <text x={280} y={177} fill="#7dd3fc" fontSize={12} fontWeight="bold">Bharati Station</text>
      <text x={280} y={190} fill="#6b7280" fontSize={9}>Larsemann Hills</text>

      {/* GEN-07 warning at Bharati */}
      <rect x={225} y={200} width={32} height={16} rx={3} fill="#78350f" opacity={0.8} />
      <text x={229} y={212} fill="#fbbf24" fontSize={8} fontWeight="bold">GEN-07</text>

      {/* Field Camp Alpha (Vikram Rao) */}
      <line x1={260} y1={180} x2={360} y2={265} stroke="#6b7280" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
      <text x={300} y={230} fill="#6b7280" fontSize={8} transform="rotate(-30 300 230)">14.2 km</text>

      {/* Vikram Rao at Field Camp Alpha */}
      {vikramOverdue ? (
        <>
          <circle cx={360} cy={265} r={8} fill="#ef4444" opacity={0.3}>
            <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={360} cy={265} r={6} fill="#ef4444" />
          <text x={370} y={262} fill="#fca5a5" fontSize={9} fontWeight="bold">Vikram Rao</text>
          <text x={370} y={274} fill="#ef4444" fontSize={8}>OVERDUE · 42 min</text>
        </>
      ) : (
        <>
          <circle cx={360} cy={265} r={6} fill="#10b981" />
          <text x={370} y={270} fill="#6ee7b7" fontSize={9}>Field Camp Alpha</text>
        </>
      )}

      {/* Rescue vehicle route after dispatch */}
      {responding && (
        <>
          <line x1={260} y1={190} x2={355} y2={258} stroke="#10b981" strokeWidth={2} strokeDasharray="6 3">
            <animate attributeName="stroke-dashoffset" values="0;-18" dur="1s" repeatCount="indefinite" />
          </line>
          <circle cx={310} cy={222} r={5} fill="#10b981">
            <animateMotion dur="4s" repeatCount="indefinite" path="M0,0 L100,75" />
          </circle>
          <text x={265} y={215} fill="#34d399" fontSize={8}>RV-02 DISPATCHED</text>
        </>
      )}

      {/* ANT-1024 cargo position (delayed at staging) */}
      <circle cx={540} cy={80} r={5} fill="#f59e0b" opacity={0.8} />
      <text x={510} y={70} fill="#fbbf24" fontSize={8}>ANT-1024</text>
      <text x={505} y={80} fill="#f59e0b" fontSize={7}>Cape Town (DELAYED)</text>
    </svg>
  );
}
