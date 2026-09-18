"use client";
import React, { useState } from "react";
import { useApp } from "@/store/appStore";
import { Package, AlertTriangle, CheckCircle2, X, QrCode, ChevronRight, Filter, RefreshCw } from "lucide-react";
import { CargoItem, CargoStatus } from "@/data/demoData";

const STATUS_STYLES: Record<string, string> = {
  DELAYED: "bg-red-500/15 text-red-400 border-red-500/30",
  IN_TRANSIT: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  DELIVERED: "bg-emerald-500/15 text-green-700 border-emerald-500/30",
  PACKED: "bg-slate-500/15 text-textSecondary border-slate-500/30",
  STAGING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  LOADED: "bg-cyan-500/15 text-blue-700 border-cyan-500/30",
  ARRIVED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  DISPATCHED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
};
const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: "bg-red-500/10 text-red-400 border border-red-500/20",
  HIGH: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  NORMAL: "bg-slate-500/10 text-textSecondary border border-slate-500/20",
  LOW: "bg-slate-500/10 text-textSecondary border border-slate-600/20",
};

type FilterType = "ALL" | "DELAYED" | "IN_TRANSIT" | "DELIVERED" | "PACKED" | "STAGING";

export default function Cargo() {
  const { state, dispatch, showToast } = useApp();
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [selected, setSelected] = useState<CargoItem | null>(null);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrResult, setQrResult] = useState<CargoItem | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<CargoStatus | "">("");

  const filtered = state.cargo.filter(c => filter === "ALL" || c.status === filter);

  const handleQrScan = (item: CargoItem) => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setQrResult(item);
      showToast(`QR Scan: ${item.id} — ${item.description} identified`);
      dispatch({ type: "ADD_AUDIT_EVENT", event: { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Operator", module: "Cargo", action: `QR Scan performed — ${item.id} identified`, target: item.id, status: "SUCCESS" } });
    }, 1800);
  };

  const handleUpdateStatus = (id: string, status: CargoStatus) => {
    dispatch({ type: "UPDATE_CARGO_STATUS", id, status });
    showToast(`Cargo ${id} status updated to ${status}`);
    setUpdatingStatus("");
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Cargo Tracking</h1>
          <p className="text-textSecondary text-sm mt-0.5">Real-time cargo tracking across all polar routes</p>
        </div>
        <div className="flex items-center gap-1 bg-pureWhite/60 border border-softBeige/40 rounded-lg p-1 flex-wrap">
          {(["ALL", "DELAYED", "IN_TRANSIT", "DELIVERED", "PACKED", "STAGING"] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-cyan-600/40 text-blue-800 border border-cyan-500/30" : "text-textSecondary hover:text-textMain"}`}>
              {f === "IN_TRANSIT" ? "IN TRANSIT" : f}
              {f === "DELAYED" && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* Alert banner if there are delays */}
      {state.cargo.some(c => c.status === "DELAYED") && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
          <AlertTriangle size={16} className="shrink-0 text-red-400" />
          <span><strong>Delayed cargo detected:</strong> {state.cargo.filter(c => c.status === "DELAYED").map(c => c.id).join(", ")} — review immediately</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-softBeige text-xs text-textSecondary uppercase tracking-wider">
                {["Cargo ID", "Description", "Priority", "Origin → Destination", "Current Location", "Status", "ETA", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(item => (
                <tr key={item.id} className={`hover:bg-warmBeige transition-colors ${item.status === "DELAYED" ? "bg-red-500/5" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-blue-700 font-medium">{item.id}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-textMain truncate">{item.description}</p>
                    <p className="text-textSecondary text-xs">{item.carrier}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${PRIORITY_STYLES[item.priority]}`}>{item.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary">
                    <span>{item.origin}</span>
                    <span className="text-textSecondary mx-1">→</span>
                    <span>{item.destination}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary max-w-[150px] truncate">{item.currentLocation}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[item.status]} ${item.status === "DELAYED" ? "animate-pulse" : ""}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{item.eta}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(item)} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-700 text-textSecondary rounded border border-softBeige transition-colors">Details</button>
                      <button onClick={() => { setSelected(item); handleQrScan(item); }} className="px-2.5 py-1 text-xs bg-cyan-900/30 hover:bg-cyan-800/40 text-blue-700 rounded border border-softBeige transition-colors flex items-center gap-1">
                        <QrCode size={11} />QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanning overlay */}
      {qrScanning && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-pureWhite border border-cyan-500/40 rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="w-48 h-48 mx-auto mb-4 relative">
              <div className="w-full h-full border-2 border-cyan-400/40 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent animate-pulse" />
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 animate-bounce" style={{ animationDuration: "1s" }} />
                <QrCode size={80} className="absolute inset-0 m-auto text-blue-700/30" />
              </div>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
            </div>
            <p className="text-blue-700 font-bold animate-pulse">SCANNING QR CODE…</p>
            <p className="text-textSecondary text-xs mt-1">Querying POLARIS cargo registry</p>
          </div>
        </div>
      )}

      {/* QR Result */}
      {qrResult && !qrScanning && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-pureWhite border border-emerald-500/40 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 size={24} className="text-green-700" />
              <div>
                <p className="font-bold text-blue-900">CARGO IDENTIFIED</p>
                <p className="text-green-700 font-mono text-sm">{qrResult.id}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm mb-4">
              <p className="text-textSecondary">{qrResult.description}</p>
              <p className="text-textSecondary">Status: <span className={`font-bold ${qrResult.status === "DELAYED" ? "text-red-400" : "text-green-700"}`}>{qrResult.status}</span></p>
              <p className="text-textSecondary">Location: {qrResult.currentLocation}</p>
              <p className="text-textSecondary">ETA: {qrResult.eta}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSelected(qrResult); setQrResult(null); }} className="flex-1 py-2 bg-cyan-700/30 text-blue-800 rounded-lg text-sm hover:bg-cyan-600/40 transition-colors">View Details</button>
              <button onClick={() => setQrResult(null)} className="px-4 py-2 text-textSecondary hover:text-textMain text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && !qrScanning && !qrResult && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-end p-4">
          <div className="w-full max-w-lg bg-warmWhite border border-softBeige/50 rounded-xl overflow-y-auto max-h-full shadow-2xl">
            <div className="sticky top-0 bg-warmWhite border-b border-softBeige px-5 py-4 flex justify-between items-start">
              <div>
                <p className="font-mono text-blue-700 font-bold">{selected.id}</p>
                <p className="text-textMain font-semibold mt-0.5">{selected.description}</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[selected.status]} ${selected.status === "DELAYED" ? "animate-pulse" : ""}`}>{selected.status}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-textSecondary hover:text-blue-900"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Fields */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[["Priority", <span key="p" className={`font-bold ${PRIORITY_STYLES[selected.priority].split(" ")[1]}`}>{selected.priority}</span>], ["Weight", selected.weight], ["Carrier", selected.carrier], ["Origin", selected.origin], ["Destination", selected.destination], ["Current Location", selected.currentLocation], ["ETA", selected.eta], ["Condition", selected.condition]].map(([k, v]) => (
                  <div key={k as string}><p className="text-textSecondary mb-0.5">{k}</p><div className="text-textMain font-medium">{v}</div></div>
                ))}
              </div>
              {selected.notes && <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200">{selected.notes}</div>}

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-textMain mb-3">Cargo Tracking Timeline</h3>
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-700" />
                  <div className="space-y-3">
                    {selected.timeline.map((t, i) => (
                      <div key={i} className="relative flex items-start gap-4 pl-9">
                        <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center border-2 ${t.done ? "bg-emerald-900 border-emerald-500" : t.active ? "bg-cyan-900 border-cyan-400 animate-pulse" : "bg-pureWhite border-softBeige"}`}>
                          {t.done ? <CheckCircle2 size={12} className="text-green-700" /> : t.active ? <div className="w-2 h-2 rounded-full bg-cyan-400" /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${t.done ? "text-green-700" : t.active ? "text-blue-800" : "text-textSecondary"}`}>{t.stage}</p>
                          <p className="text-xs text-textSecondary mt-0.5">{t.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button onClick={() => handleQrScan(selected)} className="flex items-center justify-center gap-2 py-2.5 bg-cyan-700/20 hover:bg-cyan-600/30 border border-cyan-600/20 text-blue-800 rounded-lg text-sm font-medium transition-colors">
                  <QrCode size={16} /> Simulate QR Scan
                </button>
                <div>
                  <p className="text-xs text-textSecondary mb-1">Update Cargo Status</p>
                  <div className="flex gap-2">
                    <select value={updatingStatus} onChange={e => setUpdatingStatus(e.target.value as CargoStatus)} className="flex-1 px-3 py-2 bg-slate-100 border border-softBeige rounded-lg text-sm text-textMain focus:outline-none focus:border-cyan-500">
                      <option value="">Select status…</option>
                      {(["PACKED", "DISPATCHED", "STAGING", "LOADED", "IN_TRANSIT", "ARRIVED", "DELIVERED"] as CargoStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => updatingStatus && handleUpdateStatus(selected.id, updatingStatus as CargoStatus)} disabled={!updatingStatus} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-textMain rounded-lg text-sm font-medium transition-colors disabled:opacity-40">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
