"use client";
import React, { useState } from "react";
import { useApp } from "@/store/appStore";
import { Wrench, AlertTriangle, CheckCircle2, X, Activity, RefreshCw, Thermometer, Zap } from "lucide-react";
import { Asset } from "@/data/demoData";

const STATUS_STYLE: Record<string, string> = {
  OPERATIONAL: "bg-emerald-500/10 text-green-700 border-emerald-500/30",
  WARNING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
  MAINTENANCE: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  OFFLINE: "bg-slate-500/10 text-textSecondary border-slate-500/30",
};

export default function Assets() {
  const { state, dispatch, showToast } = useApp();
  const [selected, setSelected] = useState<Asset | null>(null);
  const [liveTemp, setLiveTemp] = useState<Record<string, number>>({});
  const [liveFuel, setLiveFuel] = useState<Record<string, number>>({});

  const handleTelemetry = (asset: Asset) => {
    const newTemp = asset.temperature + (Math.random() * 4 - 2);
    const newFuel = Math.max(0, asset.fuelLevel - Math.random() * 2);
    setLiveTemp(p => ({ ...p, [asset.id]: Math.round(newTemp * 10) / 10 }));
    setLiveFuel(p => ({ ...p, [asset.id]: Math.round(newFuel * 10) / 10 }));
    showToast(`Telemetry updated for ${asset.id}`);
    dispatch({ type: "ADD_AUDIT_EVENT", event: { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "System", module: "Assets", action: `Live telemetry simulated for ${asset.id} — Temp: ${Math.round(newTemp)}°C`, target: asset.id, status: "INFO" } });
  };

  const handleHealthCheck = (asset: Asset) => {
    const newHealth = Math.min(100, asset.health + 5);
    dispatch({ type: "UPDATE_ASSET_HEALTH", id: asset.id, health: newHealth });
    showToast(`Health check completed for ${asset.id} — ${newHealth}%`);
    if (selected?.id === asset.id) setSelected(prev => prev ? { ...prev, health: newHealth } : null);
  };

  const getTemp = (a: Asset) => liveTemp[a.id] ?? a.temperature;
  const getFuel = (a: Asset) => liveFuel[a.id] ?? a.fuelLevel;

  const warningAssets = state.assets.filter(a => a.status === "WARNING" || a.status === "CRITICAL");

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Asset Management</h1>
        <p className="text-textSecondary text-sm mt-0.5">IoT telemetry, health monitoring, and maintenance scheduling for polar equipment</p>
      </div>

      {/* WARNING BANNER */}
      {warningAssets.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-bold text-sm">Asset Health Warning</p>
            {warningAssets.map(a => (
              <p key={a.id} className="text-amber-200 text-xs mt-0.5">
                <strong>{a.id} ({a.name})</strong> — Health: {a.health}% · {a.notes}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* GEN-07 Cross-module connection banner */}
      {state.assets.find(a => a.id === "GEN-07" && a.status === "WARNING") && state.cargo.find(c => c.id === "ANT-1024" && c.status === "DELAYED") && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs">
          <Zap size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold">Cross-system Risk: GEN-07 ↔ ANT-1024</p>
            <p className="text-textSecondary mt-0.5">GEN-07 cooling pump degraded (89°C) · Replacement part ANT-1024 delayed by +36 hours · Operational risk: ELEVATED</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-softBeige text-xs text-textSecondary uppercase tracking-wider">
                {["Asset ID", "Name", "Type", "Station", "Health", "Status", "Runtime (hrs)", "Next Maintenance", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {state.assets.map(asset => (
                <tr key={asset.id} className={`hover:bg-warmBeige transition-colors ${asset.status === "WARNING" ? "bg-amber-500/5" : asset.status === "CRITICAL" ? "bg-red-500/5" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-blue-700 font-medium">{asset.id}</span>
                    {asset.id === "GEN-07" && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">ANT-1024 DELAYED</span>}
                  </td>
                  <td className="px-4 py-3 text-textMain font-medium">{asset.name}</td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{asset.type}</td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{asset.station}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${asset.health >= 80 ? "bg-emerald-500" : asset.health >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${asset.health}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${asset.health >= 80 ? "text-green-700" : asset.health >= 50 ? "text-amber-400" : "text-red-400"}`}>{asset.health}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[asset.status]} ${asset.status === "WARNING" ? "animate-pulse" : ""}`}>{asset.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary font-mono">{asset.runtimeHours.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${asset.nextMaintenance === "OVERDUE" ? "text-red-400" : "text-textSecondary"}`}>{asset.nextMaintenance}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setSelected(asset)} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-700 text-textSecondary rounded border border-softBeige transition-colors flex items-center gap-1">
                        <Activity size={10} /> Telemetry
                      </button>
                      <button onClick={() => handleHealthCheck(asset)} className="px-2.5 py-1 text-xs bg-cyan-900/30 hover:bg-cyan-800/40 text-blue-700 rounded border border-softBeige transition-colors flex items-center gap-1">
                        <RefreshCw size={10} /> Health
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Telemetry Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-end p-4">
          <div className="w-full max-w-lg bg-warmWhite border border-softBeige/50 rounded-xl overflow-y-auto max-h-full shadow-2xl">
            <div className="sticky top-0 bg-warmWhite border-b border-softBeige px-5 py-4 flex justify-between items-start">
              <div>
                <p className="font-mono text-blue-700 font-bold">{selected.id}</p>
                <p className="text-textMain font-semibold">{selected.name}</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[selected.status]}`}>{selected.status}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-textSecondary hover:text-blue-900"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Telemetry cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Temperature", value: `${getTemp(selected)}°C`, icon: Thermometer, alert: getTemp(selected) > 85 },
                  { label: "Fuel Level", value: `${getFuel(selected)}%`, icon: Zap, alert: getFuel(selected) < 20 },
                  { label: "Vibration", value: selected.vibration, icon: Activity, alert: selected.vibration === "HIGH" },
                  { label: "Runtime", value: `${selected.runtimeHours.toLocaleString()} hrs`, icon: RefreshCw, alert: false },
                ].map(card => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className={`rounded-lg p-4 border ${card.alert ? "bg-red-500/5 border-red-500/20" : "bg-slate-100/40 border-softBeige/30"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className={card.alert ? "text-red-400" : "text-textSecondary"} />
                        <span className="text-xs text-textSecondary">{card.label}</span>
                      </div>
                      <p className={`text-2xl font-bold ${card.alert ? "text-red-400" : "text-blue-900"}`}>{card.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Health gauge */}
              <div className="bg-slate-100/40 border border-softBeige/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-textSecondary">Overall Health</span>
                  <span className={`text-2xl font-bold ${selected.health >= 80 ? "text-green-700" : selected.health >= 50 ? "text-amber-400" : "text-red-400"}`}>{selected.health}%</span>
                </div>
                <div className="h-3 bg-pureWhite rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${selected.health >= 80 ? "bg-emerald-500" : selected.health >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${selected.health}%` }} />
                </div>
                {selected.notes && <p className="text-xs text-textSecondary mt-2">{selected.notes}</p>}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[["Station", selected.station], ["Last Maintenance", selected.lastMaintenance], ["Next Maintenance", selected.nextMaintenance], ["Expedition", selected.expedition]].map(([k, v]) => (
                  <div key={k}><p className="text-textSecondary">{k}</p><p className={`font-medium ${v === "OVERDUE" ? "text-red-400" : "text-textMain"}`}>{v}</p></div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => handleTelemetry(selected)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-700/20 hover:bg-cyan-600/30 border border-cyan-600/20 text-blue-800 rounded-lg text-sm font-medium transition-colors">
                  <Activity size={15} /> Simulate Telemetry
                </button>
                <button onClick={() => handleHealthCheck(selected)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-700/20 hover:bg-emerald-600/30 border border-emerald-600/20 text-green-800 rounded-lg text-sm font-medium transition-colors">
                  <RefreshCw size={15} /> Run Health Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
