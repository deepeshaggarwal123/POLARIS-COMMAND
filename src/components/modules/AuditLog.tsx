"use client";
import React, { useState } from "react";
import { useApp } from "@/store/appStore";
import { Activity, ShieldCheck, Filter } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  SUCCESS: "text-green-700 bg-emerald-500/10",
  WARNING: "text-amber-400 bg-amber-500/10",
  ERROR: "text-red-400 bg-red-500/10",
  INFO: "text-blue-700 bg-blue-100",
};

export default function AuditLog() {
  const { state } = useApp();
  const [filter, setFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  const modules = ["ALL", ...Array.from(new Set(state.auditLog.map(l => l.module)))];
  const filtered = state.auditLog.filter(l => 
    (filter === "ALL" || l.status === filter) && 
    (moduleFilter === "ALL" || l.module === moduleFilter)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain flex items-center gap-2">
            <ShieldCheck className="text-blue-700" /> System Audit Log
          </h1>
          <p className="text-textSecondary text-sm mt-1">Immutable record of all operational actions and system events</p>
        </div>
        <div className="flex items-center gap-3 bg-pureWhite/60 border border-softBeige/40 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-textSecondary" />
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="bg-slate-100 border-none text-xs text-textSecondary rounded focus:ring-0 cursor-pointer">
              {modules.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-1">
            {["ALL", "SUCCESS", "WARNING", "ERROR", "INFO"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 rounded text-[10px] font-bold ${filter === f ? "bg-cyan-900/50 text-blue-800" : "text-textSecondary hover:text-textSecondary"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-softBeige text-xs text-textSecondary uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium w-32">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium w-32">Status</th>
                <th className="px-4 py-3 text-left font-medium w-32">Module</th>
                <th className="px-4 py-3 text-left font-medium">Action Description</th>
                <th className="px-4 py-3 text-left font-medium w-40">Target</th>
                <th className="px-4 py-3 text-left font-medium w-32">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-warmBeige transition-colors">
                  <td className="px-4 py-3 text-xs text-textSecondary font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border border-transparent ${STATUS_STYLE[log.status]}`}>{log.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-textSecondary">{log.module}</td>
                  <td className="px-4 py-3 text-textSecondary text-xs leading-relaxed">{log.action}</td>
                  <td className="px-4 py-3 text-xs font-mono text-textSecondary">{log.target || "—"}</td>
                  <td className="px-4 py-3 text-xs text-textSecondary flex items-center gap-1.5"><Activity size={10} className="text-textSecondary" /> {log.actor}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-textSecondary text-sm">
                    No audit records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
