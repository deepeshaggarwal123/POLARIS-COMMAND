"use client";
import React from "react";
import { useApp } from "@/store/appStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { PieChart as PieChartIcon, TrendingUp, AlertCircle, Package } from "lucide-react";

export default function Analytics() {
  const { state } = useApp();

  // Prepare deterministic data based on state
  
  // Cargo Status Distribution
  const cargoStatusCounts = state.cargo.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const cargoData = Object.keys(cargoStatusCounts).map(key => ({
    name: key,
    value: cargoStatusCounts[key],
    color: key === "DELAYED" ? "#ef4444" : key === "DELIVERED" ? "#10b981" : "#0ea5e9"
  }));

  // Asset Health
  const assetData = state.assets.map(a => ({
    name: a.id,
    health: a.health,
    fill: a.health > 80 ? "#10b981" : a.health > 50 ? "#f59e0b" : "#ef4444"
  }));

  // Mock historical data for consumption
  const consumptionData = [
    { day: "Day -5", diesel: 1400, food: 35 },
    { day: "Day -4", diesel: 1450, food: 36 },
    { day: "Day -3", diesel: 1420, food: 35 },
    { day: "Day -2", diesel: 1480, food: 37 },
    { day: "Day -1", diesel: 1510, food: 35 },
    { day: "Today", diesel: 1485, food: 36 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-pureWhite border border-softBeige p-2 rounded text-xs shadow-xl">
          <p className="text-textSecondary font-bold mb-1">{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color || p.fill }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-textMain flex items-center gap-2">
          <PieChartIcon className="text-green-700" /> Operational Analytics
        </h1>
        <p className="text-textSecondary text-sm mt-1">High-level mission insights and resource consumption trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cargo Overview */}
        <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2"><Package size={16} /> Cargo Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cargoData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({name, value}) => `${name} (${value})`} labelLine={false} style={{ fontSize: '10px', fill: '#94a3b8' }}>
                  {cargoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Health Overview */}
        <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2"><AlertCircle size={16} /> Asset Health Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#334155" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#334155" width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="health" radius={[0, 4, 4, 0]}>
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consumption Trends */}
        <div className="bg-pureWhite/60 border border-softBeige/50 rounded-xl p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-textMain mb-4 flex items-center gap-2"><TrendingUp size={16} /> Daily Resource Consumption (Bharati Station)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consumptionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDiesel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#334155" />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#334155" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#334155" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="diesel" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorDiesel)" name="Diesel (L)" />
                <Area yAxisId="right" type="monotone" dataKey="food" stroke="#10b981" fillOpacity={1} fill="url(#colorFood)" name="Food (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
