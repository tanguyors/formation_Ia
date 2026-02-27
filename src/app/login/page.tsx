"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Loader2, ArrowLeft, ShieldCheck, Mail, Lock, Ticket } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AuthMode = "login" | "register";

export default function AuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#FFFCFA] font-mono flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d97757] animate-spin" />
      </main>
    }>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });

  // Pre-fill invite code from URL ?code=XXXX
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setMode("register");
      setFormData((prev) => ({ ...prev, inviteCode: code }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
        if (formData.inviteCode.length < 8) {
          throw new Error("Code d'invitation invalide");
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            inviteCode: formData.inviteCode,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erreur lors de l'inscription");
        }

        setMode("login");
        setError(null);
        setFormData((prev) => ({ ...prev, confirmPassword: "", inviteCode: "" }));
      } else {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Email ou mot de passe incorrect");
        }

        // Redirect admin to /admin, students to /formation
        router.push(data.role === "ADMIN" ? "/admin" : "/formation");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFCFA] font-mono flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-12 h-12 bg-orange-50 border border-[#FED7AA] rounded-xl flex items-center justify-center shadow-sm">
            <Cpu className="w-6 h-6 text-[#d97757]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
            CODEX_AI
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A8A29E]">
            Private Training Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-[#E7E5E4] rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#E7E5E4] bg-[#FFF7ED]/30">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-all",
                mode === "login"
                  ? "text-[#d97757] border-b-2 border-[#d97757] bg-white"
                  : "text-[#78716C] hover:text-[#d97757] hover:bg-orange-50/50"
              )}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode("register")}
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-all",
                mode === "register"
                  ? "text-[#d97757] border-b-2 border-[#d97757] bg-white"
                  : "text-[#78716C] hover:text-[#d97757] hover:bg-orange-50/50"
              )}
            >
              Inscription
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold block ml-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nom@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder:text-[#D6D3D1] focus:outline-none focus:border-[#d97757]/40 focus:ring-4 focus:ring-[#d97757]/5 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold block ml-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder:text-[#D6D3D1] focus:outline-none focus:border-[#d97757]/40 focus:ring-4 focus:ring-[#d97757]/5 transition-all"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5 overflow-hidden"
                  >
                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold block ml-1">
                        Confirmer le mot de passe
                      </label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder:text-[#D6D3D1] focus:outline-none focus:border-[#d97757]/40 focus:ring-4 focus:ring-[#d97757]/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Invite Code */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold block ml-1">
                        Code d&apos;invitation
                      </label>
                      <div className="relative">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                        <input
                          type="text"
                          name="inviteCode"
                          required
                          maxLength={8}
                          value={formData.inviteCode}
                          onChange={handleInputChange}
                          placeholder="8 caractères"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder:text-[#D6D3D1] focus:outline-none focus:border-[#d97757]/40 focus:ring-4 focus:ring-[#d97757]/5 transition-all uppercase"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-[#DC2626] flex items-start gap-2"
                >
                  <div className="mt-0.5 min-w-[4px] h-1 w-1 bg-[#DC2626] rounded-full" />
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#d97757] text-white rounded-lg font-bold text-sm shadow-sm hover:bg-[#c4674a] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                ) : (
                  <span>{mode === "login" ? "Se connecter" : "Créer mon compte"}</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-[#78716C] hover:text-[#d97757] transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            <span>Retour au site</span>
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 opacity-40 grayscale">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] uppercase tracking-tighter">System: Stable</span>
          </div>
          <div className="w-px h-3 bg-[#E7E5E4]" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d97757] animate-pulse" />
            <span className="text-[10px] uppercase tracking-tighter">API: Live</span>
          </div>
        </div>
      </motion.div>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(217,119,87,0.03)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(217,119,87,0.03)_0%,transparent_70%)]" />
      </div>
    </main>
  );
}
