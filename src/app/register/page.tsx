"use client";

import React, { useState } from "react";
import { Lock, Mail, User, ShieldPlus, ArrowRight, Zap, CloudSnow, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("scientist");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      localStorage.setItem("polaris_auth", "true");
      setLoading(false);
      router.push("/"); // Redirect to dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full glass-green flex items-center justify-center">
              <CloudSnow className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-textMain mb-2">
            POLARIS <span className="text-green-500">ONBOARDING</span>
          </h1>
          <p className="text-textSecondary">Request expedition clearance & access.</p>
        </div>

        <form onSubmit={handleRegister} className="glass p-8 rounded-2xl space-y-5">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-textSecondary" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-warmBeige border border-softBeige focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg text-textMain placeholder-slate-500 transition-colors"
                placeholder="Dr. Rajesh Kumar"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Operator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-textSecondary" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-warmBeige border border-softBeige focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg text-textMain placeholder-slate-500 transition-colors"
                placeholder="rajesh.k@ncaor.gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Deployment Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-textSecondary" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-warmBeige border border-softBeige focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg text-textMain transition-colors appearance-none"
              >
                <option value="commander">Station Commander</option>
                <option value="scientist">Research Scientist</option>
                <option value="logistics">Logistics Officer</option>
                <option value="medical">Medical Officer</option>
                <option value="engineer">Maintenance Engineer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Security Key / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-textSecondary" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-warmBeige border border-softBeige focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-lg text-textMain placeholder-slate-500 transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-green-600 hover:bg-green-500 text-textMain font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            {loading ? (
              <Zap className="w-5 h-5 animate-pulse text-white" />
            ) : (
              <ShieldPlus className="w-5 h-5 text-green-200 group-hover:text-white" />
            )}
            {loading ? "Verifying Credentials..." : "Submit Clearance Request"}
            {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
          </button>
        </form>

        <p className="text-center text-sm text-textSecondary mt-8">
          Already have clearance?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Return to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
