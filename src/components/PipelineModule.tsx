import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Clock, Play, MapPin, Package, Users, Cpu, Server, 
  Truck, ShieldAlert, HeartPulse, RefreshCw, Box, QrCode, Anchor,
  Plane, Activity, Zap, FileSpreadsheet
} from "lucide-react";

const PIPELINE_STEPS = [
  { id: 1, label: "EXPEDITION CREATED", icon: Box, desc: "Mission framework initialized." },
  { id: 2, label: "Personnel Selected", icon: Users, desc: "Crew and scientific team assigned." },
  { id: 3, label: "AI Calculates Requirements", icon: Cpu, desc: "Predictive model determines exact supplies." },
  { id: 4, label: "Assets + Inventory Allocated", icon: Server, desc: "Equipment and stock designated." },
  { id: 5, label: "Smart Container Packing", icon: Package, desc: "Optimal packing algorithm applied." },
  { id: 6, label: "QR/RFID Generated", icon: QrCode, desc: "Tags created for manifest tracking." },
  { id: 7, label: "Cargo Dispatched", icon: Truck, desc: "Containers leave staging facility." },
  { id: 8, label: "Port Tracking", icon: Anchor, desc: "Arrival at maritime/air port." },
  { id: 9, label: "Ship / Aircraft Tracking", icon: Plane, desc: "En route to polar destination." },
  { id: 10, label: "Polar Station Arrival", icon: MapPin, desc: "Assets touched down at station." },
  { id: 11, label: "Inventory Updated", icon: RefreshCw, desc: "Stock automatically logged." },
  { id: 12, label: "Personnel Deployment", icon: HeartPulse, desc: "Crew vitals and locations active." },
  { id: 13, label: "IoT Asset Monitoring", icon: Activity, desc: "Live telemetry from equipment." },
  { id: 14, label: "AI Consumption Forecast", icon: Zap, desc: "Live burn rate adjustments." },
  { id: 15, label: "Predictive Maintenance", icon: Clock, desc: "AI flags potential part failures." },
  { id: 16, label: "Risk Alerts", icon: ShieldAlert, desc: "Weather/hazard warnings triggered." },
  { id: 17, label: "Emergency Response", icon: HeartPulse, desc: "SAR readiness status." },
  { id: 18, label: "Return Cargo", icon: RefreshCw, desc: "Samples/waste prepped for return." },
  { id: 19, label: "Mission Analytics", icon: FileSpreadsheet, desc: "Post-mission reporting generated." },
];

export default function PipelineModule() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeStep < PIPELINE_STEPS.length) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= PIPELINE_STEPS.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // 1.5 seconds per step for simulation
    } else if (activeStep >= PIPELINE_STEPS.length) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeStep]);

  const handleStart = () => {
    if (activeStep >= PIPELINE_STEPS.length) {
      setActiveStep(1); // restart
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(0);
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-textMain mb-1">
            Expedition Lifecycle Pipeline
          </h2>
          <p className="text-sm text-textSecondary">
            End-to-end mission tracking from creation to analytics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? handlePause : handleStart}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isPlaying 
                ? "bg-slate-700 hover:bg-slate-600 text-white" 
                : "bg-walnut hover:bg-espresso text-pureWhite text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Clock className="w-4 h-4 animate-pulse" />
                Pause Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {activeStep > 0 && activeStep < PIPELINE_STEPS.length ? "Resume Simulation" : "Start Simulation"}
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg font-medium bg-slate-100 hover:bg-slate-700 text-textSecondary border border-softBeige transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 relative">
        {/* Progress Bar (Background Line) */}
        <div className="absolute left-[39px] md:left-[51px] top-8 bottom-8 w-1 bg-slate-100/50 rounded-full" />
        
        <div className="space-y-0 relative z-10">
          {PIPELINE_STEPS.map((step, index) => {
            const isCompleted = activeStep > index;
            const isCurrent = activeStep === index + 1;
            
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                className={`relative flex items-center gap-6 p-4 rounded-xl transition-all duration-500 ${
                  isCurrent ? "bg-blue-900/20 border border-blue-500/30 scale-[1.02]" : "hover:bg-warmBeige"
                }`}
              >
                {/* Connector Line Fill */}
                {index !== PIPELINE_STEPS.length - 1 && (
                  <div 
                    className={`absolute left-[23px] md:left-[35px] top-[48px] w-1 h-full transition-all duration-1000 origin-top ${
                      isCompleted ? "bg-green-500 scale-y-100" : "bg-transparent scale-y-0"
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 z-10 ${
                    isCompleted 
                      ? "bg-green-900/50 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                      : isCurrent
                      ? "bg-blue-900/50 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      : "bg-pureWhite border-softBeige text-textSecondary"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isCurrent ? (
                    <Icon className="w-5 h-5 animate-pulse" />
                  ) : (
                    <span className="font-mono text-sm">{step.id}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg transition-colors duration-300 ${
                    isCompleted ? "text-green-400" : isCurrent ? "text-blue-400" : "text-textSecondary"
                  }`}>
                    {step.label}
                  </h3>
                  <p className="text-textSecondary text-sm mt-1">{step.desc}</p>
                </div>

                {/* Status Badge */}
                <div className="hidden md:block">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-300 ${
                    isCompleted 
                      ? "bg-green-500/10 text-green-400 border-green-500/20" 
                      : isCurrent
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse"
                      : "bg-slate-100 text-textSecondary border-softBeige"
                  }`}>
                    {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
