"use client";
import React, { useState } from "react";
import { useApp } from "@/store/appStore";
import { Route, Plus, X, Cpu, ChevronRight, CheckCircle2, AlertTriangle, Users, Package, Wrench, Calendar } from "lucide-react";
import { Expedition } from "@/data/demoData";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 border-emerald-500/30 text-green-700",
  PLANNED: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  COMPLETED: "bg-slate-500/10 border-slate-500/30 text-textSecondary",
  SUSPENDED: "bg-amber-500/10 border-amber-500/30 text-amber-400",
};
const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: "text-red-400", HIGH: "text-amber-400", NORMAL: "text-textSecondary", LOW: "text-textSecondary",
};

export default function Expeditions() {
  const { state, dispatch, showToast } = useApp();
  const [selected, setSelected] = useState<Expedition | null>(null);
  const [creating, setCreating] = useState(false);
  const [aiReqs, setAiReqs] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", region: "", station: "Bharati Station", missionType: "Scientific Research", priority: "HIGH", startDate: "", endDate: "", leader: "", objective: "" });

  const handleAIGenerate = () => {
    setAiLoading(true);
    setTimeout(() => { setAiLoading(false); setAiReqs(true); showToast("AI requirements generated for expedition plan"); }, 1800);
  };

  const handleCreate = () => {
    if (!form.id || !form.name || !form.leader) { showToast("Please fill all required fields"); return; }
    const newExp: Expedition = { ...form, priority: form.priority as any, fullName: form.name, status: "PLANNED", crew: 0, maxCrew: 30, readiness: 50, cargoReadiness: 50, inventoryReadiness: 50, assetReadiness: 50, emergencyReadiness: 50 };
    dispatch({ type: "CREATE_EXPEDITION", expedition: newExp });
    showToast(`Expedition ${form.id} created successfully`);
    setCreating(false);
    setAiReqs(false);
    setForm({ id: "", name: "", region: "", station: "Bharati Station", missionType: "Scientific Research", priority: "HIGH", startDate: "", endDate: "", leader: "", objective: "" });
  };

  const exp = selected;
  const expPersonnel = exp ? state.personnel.filter(p => p.expedition === exp.id) : [];
  const expAssets = exp ? state.assets.filter(a => a.expedition === exp.id) : [];
  const expCargo = exp ? state.cargo.filter(c => c.expedition === exp.id) : [];
  const expRisks = state.risks;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Expedition Planning</h1>
          <p className="text-textSecondary text-sm mt-0.5">Manage and plan polar expeditions — allocation, resources, readiness</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-textMain rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> New Expedition
        </button>
      </div>

      {/* Expedition cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {state.expeditions.map(e => (
          <button key={e.id} onClick={() => setSelected(e)} className="bg-pureWhite/70 border border-softBeige/50 rounded-xl p-5 text-left hover:border-cyan-500/30 hover:bg-warmBeige transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-textSecondary font-mono">{e.id}</p>
                <p className="text-base font-bold text-textMain mt-0.5">{e.name}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLOR[e.status]}`}>{e.status}</span>
            </div>
            <p className="text-xs text-textSecondary mb-3 line-clamp-2">{e.fullName}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-textSecondary mb-3">
              <span>📍 {e.station}</span>
              <span>👤 {e.leader}</span>
              <span>🧑‍🤝‍🧑 {e.crew}/{e.maxCrew} crew</span>
              <span className={PRIORITY_COLOR[e.priority]}>⚡ {e.priority}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textSecondary">Overall Readiness</span>
                <span className={e.readiness >= 85 ? "text-green-700" : e.readiness >= 70 ? "text-amber-400" : "text-red-400"}>{e.readiness}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${e.readiness >= 85 ? "bg-emerald-500" : e.readiness >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${e.readiness}%` }} />
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">View expedition plan →</p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {exp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-end p-4">
          <div className="w-full max-w-2xl bg-warmWhite border border-softBeige/50 rounded-xl overflow-y-auto max-h-full shadow-2xl">
            <div className="sticky top-0 bg-warmWhite border-b border-softBeige px-5 py-4 flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-700 font-mono mb-0.5">{exp.id}</p>
                <h2 className="text-lg font-bold text-blue-900">{exp.fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLOR[exp.status]}`}>{exp.status}</span>
                  <span className="text-xs text-textSecondary">{exp.missionType}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-textSecondary hover:text-textMain p-1"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[["Leader", exp.leader], ["Station", exp.station], ["Region", exp.region], ["Priority", exp.priority], ["Start", exp.startDate], ["End", exp.endDate]].map(([k, v]) => (
                  <div key={k}><p className="text-textSecondary text-xs">{k}</p><p className="text-textMain font-medium">{v}</p></div>
                ))}
              </div>
              <div><p className="text-textSecondary text-xs mb-1">Objective</p><p className="text-textSecondary text-sm">{exp.objective}</p></div>

              {/* Readiness */}
              <div className="bg-warmBeige rounded-lg p-4">
                <h3 className="text-sm font-semibold text-textMain mb-3">Mission Readiness</h3>
                {[["Personnel", exp.readiness, "93%"], ["Cargo", exp.cargoReadiness, `${exp.cargoReadiness}%`], ["Inventory", exp.inventoryReadiness, `${exp.inventoryReadiness}%`], ["Assets", exp.assetReadiness, `${exp.assetReadiness}%`], ["Emergency Preparedness", exp.emergencyReadiness, `${exp.emergencyReadiness}%`]].map(([label, val, disp]) => (
                  <div key={label as string} className="mb-2">
                    <div className="flex justify-between text-xs mb-1"><span className="text-textSecondary">{label}</span><span className={Number(val) >= 85 ? "text-green-700" : Number(val) >= 70 ? "text-amber-400" : "text-red-400"}>{disp}</span></div>
                    <div className="h-1.5 bg-slate-100 rounded-full"><div className={`h-full rounded-full ${Number(val) >= 85 ? "bg-emerald-500" : Number(val) >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${val}%` }} /></div>
                  </div>
                ))}
              </div>

              {/* Personnel */}
              <div>
                <h3 className="text-sm font-semibold text-textMain mb-2 flex items-center gap-2"><Users size={14} className="text-blue-700" />Personnel ({expPersonnel.length})</h3>
                <div className="space-y-1">
                  {expPersonnel.map(p => (
                    <div key={p.id} className="flex items-center justify-between py-1.5 px-3 bg-pureWhite/40 rounded text-xs">
                      <span className="text-textMain font-medium">{p.name}</span>
                      <span className="text-textSecondary">{p.role}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p.status === "OVERDUE" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/10 text-green-700"}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cargo */}
              <div>
                <h3 className="text-sm font-semibold text-textMain mb-2 flex items-center gap-2"><Package size={14} className="text-blue-700" />Cargo ({expCargo.length} items)</h3>
                <div className="space-y-1">
                  {expCargo.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-1.5 px-3 bg-pureWhite/40 rounded text-xs">
                      <span className="font-mono text-blue-700">{c.id}</span>
                      <span className="text-textSecondary flex-1 px-2 truncate">{c.description}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.status === "DELAYED" ? "bg-red-500/20 text-red-400" : c.status === "DELIVERED" ? "bg-emerald-500/10 text-green-700" : "bg-blue-500/10 text-blue-400"}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              {expRisks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-textMain mb-2 flex items-center gap-2"><AlertTriangle size={14} className="text-amber-400" />Operational Risks</h3>
                  <div className="space-y-2">
                    {expRisks.map(r => (
                      <div key={r.id} className="py-2 px-3 bg-pureWhite/40 border-l-2 border-amber-500/40 rounded-r text-xs">
                        <p className="text-textMain font-medium">{r.title}</p>
                        <p className="text-textSecondary mt-0.5">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create expedition form */}
      {creating && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-blue-200 rounded-xl overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-blue-100 px-5 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-blue-900">Create Expedition Plan</h2>
              <button onClick={() => setCreating(false)} className="text-slate-400 hover:text-blue-700"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[["Expedition ID *", "id", "e.g. ISEA-2028"], ["Expedition Name *", "name", "e.g. ISEA-2028 Summer Campaign"], ["Region", "region", "e.g. Larsemann Hills"], ["Expedition Leader *", "leader", "e.g. Dr. Name"], ["Start Date", "startDate", ""], ["End Date", "endDate", ""]].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="text-xs text-slate-500 block mb-1 font-medium">{label}</label>
                    <input type={key === "startDate" || key === "endDate" ? "date" : "text"} placeholder={ph} value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-slate-500 block mb-1 font-medium">Destination Station</label>
                  <select value={form.station} onChange={e => setForm(f => ({ ...f, station: e.target.value }))} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                    <option>Bharati Station</option><option>Maitri Station</option><option>Himadri Station</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1 font-medium">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                    <option>CRITICAL</option><option>HIGH</option><option>NORMAL</option><option>LOW</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1 font-medium">Objective</label>
                <textarea value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} rows={2} placeholder="Describe mission objective…" className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 resize-none" />
              </div>

              {/* AI Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2"><Cpu size={14} className="text-blue-600" />AI Resource Calculator</h3>
                  <button onClick={handleAIGenerate} disabled={aiLoading} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                    {aiLoading ? <><span className="animate-spin">⚙</span> Analyzing…</> : <><Cpu size={12} /> Generate AI Requirements</>}
                  </button>
                </div>
                {aiReqs && (
                  <div className="bg-white border border-blue-100 rounded-lg p-3 space-y-2 text-xs">
                    <p className="text-blue-700 font-bold mb-2">AI REQUIREMENTS — ESTIMATED FOR 45-PERSON, 80-DAY EXPEDITION</p>
                    {[["Diesel Fuel", "18,400 L"], ["Food Rations", "1,350 kg"], ["Medical Kits", "18 units"], ["Emergency Rations", "90 person-days"], ["Generator Spare Parts", "12 units"], ["Scientific Consumables", "500 units"]].map(([item, qty]) => (
                      <div key={item} className="flex justify-between items-center border-b border-blue-50 pb-1.5">
                        <span className="text-slate-600">{item}</span>
                        <span className="font-mono text-green-700 font-bold">{qty}</span>
                      </div>
                    ))}
                    <p className="text-slate-400 text-[10px] pt-1">AI-assisted recommendation · commander approval required</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setCreating(false)} className="px-4 py-2 text-slate-500 hover:text-blue-700 text-sm">Cancel</button>
                <button onClick={handleCreate} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-md">
                  <CheckCircle2 size={14} /> Create Expedition Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
