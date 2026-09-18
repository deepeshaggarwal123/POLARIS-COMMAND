"use client";

import React, { useState } from "react";
import { Lock, Mail, ShieldCheck, ArrowRight, Zap, CloudSnow } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full glass-blue flex items-center justify-center">
              <CloudSnow className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-textMain mb-2">
            POLARIS <span className="text-blue-500">COMMAND</span>
          </h1>
          <p className="text-textSecondary">Secure access to polar telemetry & ops.</p>
        </div>

        <form onSubmit={handleLogin} className="glass p-8 rounded-2xl space-y-6">
          <div className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-warmBeige border border-softBeige focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-textMain placeholder-slate-500 transition-colors"
                  placeholder="commander@polaris.gov"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1.5 flex justify-between">
                <span>Security Key / Password</span>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                  Reset Key
                </a>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-warmBeige border border-softBeige focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-textMain placeholder-slate-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-walnut hover:bg-espresso text-pureWhite text-textMain font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Zap className="w-5 h-5 animate-pulse text-green-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-blue-200 group-hover:text-white" />
            )}
            {loading ? "Establishing Secure Link..." : "Authenticate"}
            {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
          </button>
        </form>

        <p className="text-center text-sm text-textSecondary mt-8">
          Not cleared for access?{" "}
          <Link href="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
            Request Clearance (Register)
          </Link>
        </p>
      </div>
    </div>
  );
}
