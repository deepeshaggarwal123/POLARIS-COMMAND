"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/store/appStore";
import { ShieldAlert, AlertTriangle, MapPin, Users, Radio, Thermometer, Truck, HeartPulse, CheckCircle2, Clock, Zap, X, ChevronRight, Send, Plus } from "lucide-react";
import { Incident } from "@/data/demoData";

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
  HIGH: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  LOW: "bg-slate-500/10 text-textSecondary border-slate-500/30",
};

export default function Emergency() {
  const { state, dispatch, showToast } = useApp();
  const [selected, setSelected] = useState<Incident | null>(null);
  const [creating, setCreating] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  
  const handleOpenIncident = (inc: Incident) => {
    setSelected(inc);
    if (inc.status === "OPEN" && inc.id === "INC-001") {
      setAiAnalyzing(true);
      setTimeout(() => setAiAnalyzing(false), 2000);
    }
  };

  const handleDispatch = () => {
    if (!selected) return;
    dispatch({ type: "DISPATCH_RESPONSE", incidentId: selected.id });
    showToast(`Response dispatched for ${selected.id}`);
    setSelected(prev => prev ? { ...prev, status: "RESPONDING" } : null);
  };

  const handleResolve = () => {
    if (!selected) return;
    dispatch({ type: "RESOLVE_INCIDENT", incidentId: selected.id });
    showToast(`Incident ${selected.id} marked as RESOLVED`);
    setSelected(prev => prev ? { ...prev, status: "RESOLVED" } : null);
  };

  const openIncidents = state.incidents.filter(i => i.status !== "RESOLVED" && i.status !== "CLOSED");
  const closedIncidents = state.incidents.filter(i => i.status === "RESOLVED" || i.status === "CLOSED");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> Emergency Response
          </h1>
          <p className="text-textSecondary text-sm mt-1">Incident command, AI response planning, and resource dispatch</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-700 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Create Incident
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incidents */}
        <div>
          <h2 className="text-sm font-semibold text-textMain mb-3">Active Incidents ({openIncidents.length})</h2>
          <div className="space-y-3">
            {openIncidents.length === 0 && <p className="text-textSecondary text-sm italic">No active incidents.</p>}
            {openIncidents.map(inc => (
              <div key={inc.id} className="bg-pureWhite/60 border border-red-500/30 rounded-xl overflow-hidden hover:border-red-500/50 transition-colors relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${inc.severity === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                <div className="p-4 pl-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${PRIORITY_COLOR[inc.severity]}`}>{inc.severity}</span>
                        <span className="text-textSecondary text-xs font-mono">{inc.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-blue-900">{inc.title}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.status === "OPEN" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{inc.status}</span>
                  </div>
                  <p className="text-sm text-textSecondary mb-4 line-clamp-2">{inc.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-softBeige">
                    <div className="flex items-center gap-4 text-xs text-textSecondary">
                      <span className="flex items-center gap-1.5"><MapPin size={12} /> {inc.station}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {inc.reportedAt}</span>
                    </div>
                    <button onClick={() => handleOpenIncident(inc)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-700 text-blue-700 rounded-lg transition-colors text-xs font-medium">
                      OPEN COMMAND <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolved Incidents */}
        <div>
          <h2 className="text-sm font-semibold text-textSecondary mb-3">Recently Resolved ({closedIncidents.length})</h2>
          <div className="space-y-3 opacity-60">
            {closedIncidents.length === 0 && <p className="text-textSecondary text-sm italic">No resolved incidents.</p>}
            {closedIncidents.map(inc => (
              <div key={inc.id} className="bg-pureWhite/40 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-textSecondary">{inc.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-green-700 border border-emerald-500/20">RESOLVED</span>
                </div>
                <p className="text-xs text-textSecondary mb-2">{inc.description}</p>
                <div className="text-xs text-green-600/70">Resolved at {inc.resolvedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Command Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-warmWhite border border-red-500/30 rounded-xl overflow-y-auto max-h-[95vh] shadow-2xl flex flex-col lg:flex-row">
            
            {/* Left Column - Details */}
            <div className="flex-1 border-r border-softBeige p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-textMain tracking-tight">{selected.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${PRIORITY_COLOR[selected.severity]} ${selected.severity === "CRITICAL" && selected.status === "OPEN" ? "animate-pulse" : ""}`}>{selected.severity}</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${selected.status === "OPEN" ? "bg-red-500/20 text-red-400" : selected.status === "RESPONDING" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-green-700"}`}>{selected.status}</span>
                    <span className="text-textSecondary font-mono text-sm">{selected.id}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-textSecondary hover:text-textMain p-2 bg-slate-100/50 rounded-lg"><X size={20} /></button>
              </div>

              <div className="bg-warmBeige rounded-xl p-4 border border-softBeige">
                <p className="text-textSecondary text-sm leading-relaxed">{selected.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-2"><MapPin size={16} className="text-textSecondary mt-0.5" /><div><p className="text-xs text-textSecondary">Location</p><p className="text-textMain">{selected.location}</p></div></div>
                  <div className="flex items-start gap-2"><Users size={16} className="text-textSecondary mt-0.5" /><div><p className="text-xs text-textSecondary">Personnel</p><p className="text-textMain">{selected.personnelInvolved.join(", ")}</p></div></div>
                  <div className="flex items-start gap-2"><Thermometer size={16} className="text-textSecondary mt-0.5" /><div><p className="text-xs text-textSecondary">Weather</p><p className="text-textMain">{selected.weatherConditions}</p></div></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2"><Radio size={16} className="text-textSecondary mt-0.5" /><div><p className="text-xs text-textSecondary">Comms</p><p className="text-textMain">{selected.communicationStatus}</p></div></div>
                  <div className="flex items-start gap-2"><HeartPulse size={16} className="text-textSecondary mt-0.5" /><div><p className="text-xs text-textSecondary">Medical</p><p className="text-textMain">{selected.medicalTeam}</p></div></div>
                  <div className="flex items-start gap-2"><Truck size={16} className="text-textSecondary mt-0.5" /><div><p className="text-xs text-textSecondary">Nearest Assets</p><p className="text-textMain">{selected.availableRescueVehicles.join(", ") || "None in range"}</p></div></div>
                </div>
              </div>

              {/* Map rendering if it's the missing personnel incident */}
              {selected.id === "INC-001" && (
                <div className="border border-softBeige rounded-xl overflow-hidden h-48 relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full bg-blue-50">
                    {/* Grid */}
                    {[50, 100, 150, 200, 250, 300, 350].map(x => <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="#0e2a3d" />)}
                    {[50, 100, 150].map(y => <line key={y} x1={0} y1={y} x2={400} y2={y} stroke="#0e2a3d" />)}
                    {/* Bharati */}
                    <circle cx={100} cy={80} r={8} fill="#0ea5e9" /><text x={115} y={84} fill="#7dd3fc" fontSize={10}>Bharati</text>
                    {/* Route */}
                    <line x1={100} y1={80} x2={280} y2={150} stroke="#6b7280" strokeWidth={1.5} strokeDasharray="4 4" />
                    {/* Incident */}
                    <circle cx={280} cy={150} r={10} fill="#ef4444" opacity={0.3}><animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" /></circle>
                    <circle cx={280} cy={150} r={5} fill="#ef4444" />
                    <text x={290} y={154} fill="#fca5a5" fontSize={10} fontWeight="bold">Field Camp Alpha</text>
                    {/* RV-02 Moving if responding */}
                    {selected.status === "RESPONDING" && (
                      <g>
                        <circle cx={190} cy={115} r={6} fill="#10b981"><animateMotion dur="3s" repeatCount="indefinite" path="M-90,-35 L90,35" /></circle>
                        <text x={180} y={105} fill="#34d399" fontSize={9}>RV-02</text>
                      </g>
                    )}
                  </svg>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] text-textSecondary">Sector Map (Simulated)</div>
                </div>
              )}
            </div>

            {/* Right Column - Action / AI */}
            <div className="flex-1 p-6 flex flex-col bg-pureWhite/20">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-textMain flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-blue-700" /> POLARIS AI COPILOT — RESPONSE ANALYSIS
                </h3>
                
                {aiAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-blue-700">
                    <Zap size={24} className="animate-pulse" />
                    <p className="font-bold tracking-widest text-sm animate-pulse">ANALYZING MISSION DATA…</p>
                    <p className="text-xs text-textSecondary">Evaluating weather, assets, and personnel telemetry</p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in fade-in duration-500">
                    <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-4">
                      <p className="text-[10px] text-blue-600 font-bold tracking-wider mb-2 uppercase">Recommended Response Protocol</p>
                      <ul className="space-y-2">
                        {selected.aiRecommendation.map((rec, i) => (
                          <li key={i} className="flex gap-2 text-sm text-cyan-100">
                            <span className="font-mono text-blue-600">{i + 1}.</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-100/40 border border-softBeige/50 rounded-xl p-4">
                      <p className="text-[10px] text-textSecondary font-bold tracking-wider mb-2 uppercase">Why this response?</p>
                      <ul className="space-y-1.5">
                        {selected.aiReasoning.map((reason, i) => (
                          <li key={i} className="flex gap-2 text-xs text-textSecondary">
                            <span className="text-textSecondary">•</span> {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="text-[10px] text-textSecondary text-center italic">AI-assisted recommendation — commander approval required.</p>
                  </div>
                )}
              </div>

              {/* Action Area */}
              <div className="mt-6 pt-6 border-t border-softBeige">
                {selected.status === "OPEN" && !aiAnalyzing && (
                  <button onClick={handleDispatch} className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]">
                    <ShieldAlert size={20} /> DISPATCH RESPONSE
                  </button>
                )}
                
                {selected.status === "RESPONDING" && (
                  <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 space-y-4">
                    <p className="text-sm font-bold text-green-700 flex items-center gap-2"><CheckCircle2 size={16} /> RESPONSE DISPATCHED</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {["Rescue Vehicle RV-02", "Medical Team Alpha", "DRONE-03 Aerial Unit", "NCPOR HQ Command"].map(unit => (
                        <div key={unit} className="flex items-center gap-2 text-emerald-100"><CheckCircle2 size={12} className="text-green-600" /> {unit}</div>
                      ))}
                    </div>
                    <button onClick={handleResolve} className="w-full py-2 bg-slate-100 hover:bg-slate-700 text-textSecondary rounded-lg text-sm font-medium transition-colors border border-softBeige">
                      Mark Incident Resolved
                    </button>
                  </div>
                )}

                {selected.status === "RESOLVED" && (
                  <div className="bg-slate-100/50 border border-softBeige rounded-xl p-4 text-center">
                    <p className="text-green-700 font-bold flex items-center justify-center gap-2"><CheckCircle2 size={16} /> INCIDENT RESOLVED</p>
                    <p className="text-xs text-textSecondary mt-1">All personnel accounted for. Operations returned to normal.</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
