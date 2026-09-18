"use client";
import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/store/appStore";
import { Cpu, Send, Info } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

const PRESET_QUESTIONS = [
  "What are the top risks for ISEA-2027?",
  "Which cargo requires immediate attention?",
  "Will Bharati Station face an inventory shortage?",
  "Where is the overdue personnel?",
  "What resources are available for the emergency?",
  "What should the commander do next?",
  "What is the status of GEN-07?",
  "When will ANT-1024 arrive?"
];

export default function AICopilot() {
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-0", role: "ai", text: "Welcome to POLARIS AI Copilot. I have access to all ISEA-2027 operational data including cargo, inventory, personnel and asset telemetry. How can I assist the commander?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processing]);

  const generateResponse = (q: string) => {
    const lower = q.toLowerCase();
    
    // Deterministic logic based on exact demo state requirements
    if (lower.includes("top risk") || lower.includes("risks for isea")) {
      return state.risks.map((r, i) => `${i + 1}. [${r.severity}] ${r.title} — ${r.description}`).join("\n\n");
    }
    if (lower.includes("cargo") && (lower.includes("attention") || lower.includes("delayed"))) {
      const delayed = state.cargo.filter(c => c.status === "DELAYED");
      return `There is ${delayed.length} delayed cargo shipment requiring attention:\n\n` + 
             delayed.map(c => `• ${c.id}: ${c.description} is DELAYED. ${c.notes}`).join("\n");
    }
    if (lower.includes("inventory shortage") || lower.includes("bharati") && lower.includes("shortage")) {
      const warn = state.inventory.find(i => i.id === "INV-001");
      return warn ? `Yes. Diesel Fuel at Bharati Station is at WARNING level. Currently ${warn.daysRemaining} days remaining at ${warn.dailyConsumption}L/day. The replacement shipment (ANT-1027) is staged in Cape Town.` : "No critical shortages detected.";
    }
    if (lower.includes("overdue personnel") || lower.includes("where is")) {
      const overdue = state.personnel.find(p => p.status === "OVERDUE");
      return overdue ? `${overdue.name} (${overdue.role}) is OVERDUE by ${overdue.minutesSinceCheckIn} minutes. Last known position: ${overdue.currentLocation}.` : "All personnel are currently accounted for.";
    }
    if (lower.includes("resources") && lower.includes("emergency")) {
      return "For the current incident at Field Camp Alpha, the following resources are available at Bharati Station (14.2 km away):\n• Rescue Vehicle RV-02 (90% fuel, Operational)\n• Medical Team Alpha (Dr. Aisha Patel)\n• DRONE-03 (95% charge)";
    }
    if (lower.includes("commander do next") || lower.includes("next action")) {
      return "Based on current operational risks, I recommend:\n1. Dispatch Rescue Vehicle RV-02 for Vikram Rao (Critical).\n2. Expedite ANT-1024 shipment with port authority to prevent GEN-07 failure (High).\n3. Approve emergency replenishment of 3,000L Diesel for Bharati Station (High).";
    }
    if (lower.includes("gen-07")) {
      const gen = state.assets.find(a => a.id === "GEN-07");
      return gen ? `GEN-07 is operating in a ${gen.status} state with ${gen.health}% health. Telemetry shows temperature elevated at ${gen.temperature}°C. The cooling pump needs replacement.` : "GEN-07 not found.";
    }
    if (lower.includes("ant-1024")) {
      const ant = state.cargo.find(c => c.id === "ANT-1024");
      return ant ? `ANT-1024 (${ant.description}) is currently ${ant.status} at ${ant.currentLocation}. ETA is ${ant.eta}. This is causing a cascading risk for GEN-07.` : "ANT-1024 not found.";
    }
    
    // Fallback smart matching
    if (lower.includes("vikram")) return "Vikram Rao is currently OVERDUE by 42 minutes at Field Camp Alpha.";
    if (lower.includes("diesel") || lower.includes("fuel")) return "Bharati Station diesel is at 16.7 days remaining. Recommend running AI Forecast in the Inventory module.";
    if (lower.includes("emergency")) return "There is an active CRITICAL incident for missing personnel. Please navigate to the Emergency module to dispatch a response.";
    
    return "Checking POLARIS operational database...\n\nAll primary systems for ISEA-2027 are online. Please check the Command Center for active operational risks.";
  };

  const handleSend = (text: string) => {
    if (!text.trim() || processing) return;
    const newMsg: Message = { id: `msg-${Date.now()}`, role: "user", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setProcessing(true);
    
    setTimeout(() => {
      const reply = generateResponse(text);
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Presets Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain flex items-center gap-2"><Cpu className="text-blue-700" /> AI Copilot</h1>
          <p className="text-textSecondary text-sm mt-1">Operational assistant over POLARIS synthetic data</p>
        </div>
        <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl p-4 flex-1">
          <p className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">Suggested Queries</p>
          <div className="flex flex-col gap-2">
            {PRESET_QUESTIONS.map(q => (
              <button key={q} onClick={() => handleSend(q)} disabled={processing} className="text-left px-3 py-2.5 bg-slate-100/50 hover:bg-cyan-900/30 border border-softBeige/50 hover:border-cyan-700/50 text-sm text-textSecondary hover:text-blue-800 rounded-lg transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-pureWhite/60 border border-softBeige/50 rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-4 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "ai" ? "bg-cyan-900/50 border border-cyan-700" : "bg-slate-700"}`}>
                {m.role === "ai" ? <Cpu size={16} className="text-blue-700" /> : <span className="text-xs font-bold text-blue-900">CMD</span>}
              </div>
              <div>
                <div className={`flex items-baseline gap-2 mb-1 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs font-bold text-textSecondary">{m.role === "ai" ? "POLARIS AI" : "COMMANDER"}</span>
                  <span className="text-[10px] text-textSecondary">{m.time}</span>
                </div>
                <div className={`p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${m.role === "ai" ? "bg-slate-100/80 text-textMain rounded-tl-none border border-softBeige" : "bg-cyan-900/40 text-cyan-50 rounded-tr-none border border-cyan-800"}`}>
                  {m.text}
                </div>
                {m.role === "ai" && m.id !== "msg-0" && (
                  <p className="text-[10px] text-textSecondary mt-2 flex items-center gap-1"><Info size={10} /> AI-assisted prototype recommendation — not operational NCPOR data</p>
                )}
              </div>
            </div>
          ))}
          {processing && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-cyan-900/50 border border-cyan-700 flex items-center justify-center shrink-0">
                <Cpu size={16} className="text-blue-700 animate-pulse" />
              </div>
              <div className="bg-slate-100/80 border border-softBeige rounded-xl rounded-tl-none p-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-blue-700 font-mono tracking-widest uppercase">POLARIS AI ANALYZING…</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-warmBeige border-t border-softBeige/50">
          <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="relative flex items-center">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask POLARIS about mission status, cargo delays, or emergency response…" 
              className="w-full bg-slate-100 border border-slate-600 rounded-xl py-3 pl-4 pr-12 text-sm text-textMain placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-shadow"
            />
            <button type="submit" disabled={!input.trim() || processing} className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-textSecondary text-textMain rounded-lg transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
