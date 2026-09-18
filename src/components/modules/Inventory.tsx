"use client";
import React, { useState } from "react";
import { useApp } from "@/store/appStore";
import { Archive, AlertTriangle, Cpu, X, Plus, CheckCircle2 } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  HEALTHY: "bg-emerald-500/10 text-green-700 border-emerald-500/30",
  WARNING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
  STOCKOUT: "bg-red-600/20 text-red-300 border-red-600/40",
};

interface ForecastResult {
  itemId: string;
  currentDays: number;
  shortageDay: number;
  recommendedQty: number;
  unit: string;
  priority: string;
  reasoning: string;
}

function genForecast(item: { id: string; name: string; daysRemaining: number; dailyConsumption: number; unit: string; currentStock: number; reorderLevel: number }): ForecastResult {
  const qty = Math.ceil(item.dailyConsumption * 30);
  const priority = item.daysRemaining < 20 ? "CRITICAL" : "HIGH";
  return {
    itemId: item.id, currentDays: item.daysRemaining, shortageDay: Math.floor(item.daysRemaining),
    recommendedQty: item.id === "INV-001" ? 3000 : qty, unit: item.unit, priority,
    reasoning: item.id === "INV-001"
      ? "Bharati Station diesel at 16.7 days. At current consumption rate (1,485 L/day), critical threshold will be reached before resupply window. ANT-1027 fuel shipment en route — expected Jan 15 (5 days). Recommend emergency 3,000 L top-up to maintain 25-day buffer."
      : `${item.name} at ${item.daysRemaining} days. Recommended quantity based on 30-day operational buffer above reorder level.`,
  };
}

export default function Inventory() {
  const { state, dispatch, showToast } = useApp();
  const [stationFilter, setStationFilter] = useState("ALL");
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [forecastLoading, setForecastLoading] = useState<string | null>(null);
  const [replenQty, setReplenQty] = useState("");
  const [replenItem, setReplenItem] = useState<string | null>(null);

  const stations = ["ALL", ...Array.from(new Set(state.inventory.map(i => i.station)))];
  const filtered = state.inventory.filter(i => stationFilter === "ALL" || i.station === stationFilter);

  const handleForecast = (itemId: string) => {
    setForecastLoading(itemId);
    setForecast(null);
    setTimeout(() => {
      const item = state.inventory.find(i => i.id === itemId)!;
      setForecast(genForecast(item));
      setForecastLoading(null);
      setReplenQty(String(genForecast(item).recommendedQty));
      setReplenItem(itemId);
      showToast("AI forecast generated for " + item.name);
      dispatch({ type: "ADD_AUDIT_EVENT", event: { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "Operator", module: "Inventory", action: `AI forecast run for ${item.name} — ${item.station}`, target: itemId, status: "SUCCESS" } });
    }, 1800);
  };

  const handleReplenishment = () => {
    if (!replenItem) return;
    const qty = Number(replenQty);
    if (!qty || qty <= 0) { showToast("Enter a valid quantity"); return; }
    dispatch({ type: "CREATE_REPLENISHMENT", id: replenItem, qty });
    const item = state.inventory.find(i => i.id === replenItem);
    showToast(`Replenishment request created: ${qty} ${item?.unit} of ${item?.name}`);
    setForecast(null);
    setReplenItem(null);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Inventory Management</h1>
          <p className="text-textSecondary text-sm mt-0.5">Station inventory levels, consumption tracking, and AI replenishment forecasting</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-textSecondary">Station:</label>
          <select value={stationFilter} onChange={e => setStationFilter(e.target.value)} className="px-3 py-1.5 bg-slate-100 border border-softBeige rounded-lg text-sm text-textMain focus:outline-none focus:border-cyan-500">
            {stations.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "HEALTHY", count: filtered.filter(i => i.status === "HEALTHY").length, color: "emerald" },
          { label: "WARNING", count: filtered.filter(i => i.status === "WARNING").length, color: "amber" },
          { label: "CRITICAL", count: filtered.filter(i => i.status === "CRITICAL").length, color: "red" },
          { label: "TOTAL ITEMS", count: filtered.length, color: "slate" },
        ].map(c => (
          <div key={c.label} className="bg-pureWhite/60 border border-softBeige/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-900">{c.count}</p>
            <p className="text-xs text-textSecondary mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-softBeige text-xs text-textSecondary uppercase tracking-wider">
                {["Item", "Category", "Station", "Current Stock", "Daily Use", "Days Left", "Reorder Lvl", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(item => (
                <tr key={item.id} className={`hover:bg-warmBeige transition-colors ${item.status === "WARNING" ? "bg-amber-500/5" : item.status === "CRITICAL" ? "bg-red-500/5" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="text-textMain font-medium">{item.name}</p>
                    <p className="text-textSecondary text-xs">{item.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{item.category}</td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{item.station}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-textMain font-mono text-xs">{item.currentStock.toLocaleString()} {item.unit}</p>
                      <div className="h-1 w-24 bg-slate-100 rounded-full mt-1">
                        <div className={`h-full rounded-full ${item.status === "HEALTHY" ? "bg-emerald-500" : item.status === "WARNING" ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${Math.min(100, (item.currentStock / item.maxCapacity) * 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary font-mono">{item.dailyConsumption} {item.unit}/d</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${item.daysRemaining < 20 ? "text-red-400" : item.daysRemaining < 30 ? "text-amber-400" : "text-green-700"}`}>
                      {item.daysRemaining >= 999 ? "∞" : `${item.daysRemaining}d`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary font-mono">{item.reorderLevel.toLocaleString()} {item.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(item.status === "WARNING" || item.status === "CRITICAL") && (
                        <button onClick={() => handleForecast(item.id)} disabled={forecastLoading === item.id}
                          className="px-2.5 py-1 text-xs bg-cyan-900/30 hover:bg-cyan-800/40 text-blue-700 rounded border border-softBeige transition-colors disabled:opacity-50 flex items-center gap-1">
                          {forecastLoading === item.id ? <span className="animate-spin">⚙</span> : <Cpu size={10} />}
                          AI Forecast
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecast panel */}
      {(forecastLoading || forecast) && (
        <div className="bg-pureWhite/80 border border-cyan-500/20 rounded-xl p-5">
          {forecastLoading && (
            <div className="flex items-center gap-3 text-blue-700">
              <Cpu size={18} className="animate-pulse" />
              <div>
                <p className="font-bold">POLARIS AI ANALYZING…</p>
                <p className="text-xs text-textSecondary mt-0.5">Processing consumption data and supply chain status</p>
              </div>
            </div>
          )}
          {forecast && !forecastLoading && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu size={18} className="text-blue-700" />
                  <div>
                    <p className="font-bold text-blue-900">AI FORECAST RESULT</p>
                    <p className="text-xs text-textSecondary">AI-assisted recommendation — commander approval required</p>
                  </div>
                </div>
                <button onClick={() => setForecast(null)} className="text-textSecondary hover:text-blue-900"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Days Remaining", value: `${forecast.currentDays}d`, color: forecast.currentDays < 20 ? "text-red-400" : "text-amber-400" },
                  { label: "Projected Shortage", value: `Day ${forecast.shortageDay}`, color: "text-red-400" },
                  { label: "Rec. Replenishment", value: `${forecast.recommendedQty.toLocaleString()} ${forecast.unit}`, color: "text-green-700" },
                  { label: "Priority", value: forecast.priority, color: forecast.priority === "CRITICAL" ? "text-red-400" : "text-amber-400" },
                ].map(card => (
                  <div key={card.label} className="bg-slate-100/50 rounded-lg p-3">
                    <p className="text-xs text-textSecondary">{card.label}</p>
                    <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-100/40 border border-softBeige/30 rounded-lg p-3 mb-4">
                <p className="text-xs text-textSecondary leading-relaxed">{forecast.reasoning}</p>
              </div>
              <div className="flex items-center gap-3">
                <input type="number" value={replenQty} onChange={e => setReplenQty(e.target.value)}
                  className="w-36 px-3 py-2 bg-slate-100 border border-softBeige rounded-lg text-sm text-textMain focus:outline-none focus:border-cyan-500"
                  placeholder="Quantity" />
                <span className="text-xs text-textSecondary">{state.inventory.find(i => i.id === replenItem)?.unit}</span>
                <button onClick={handleReplenishment} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-textMain rounded-lg text-sm font-medium transition-colors">
                  <Plus size={14} /> Create Replenishment Request
                </button>
              </div>
              <p className="text-[10px] text-textSecondary mt-3">Prototype · Synthetic Operational Data · Not real NCPOR inventory figures</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
