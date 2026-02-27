"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Cpu,
  LogOut,
  Mail,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  GraduationCap,
  Layers,
  ChevronRight,
  UserPlus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Invitation {
  id: string;
  email: string;
  code: string;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  createdBy: {
    email: string;
    displayName: string;
  };
}

interface Pool {
  id: string;
  name: string;
  createdAt: string;
  memberCount: number;
  unlockedSessions: number;
  totalSessions: number;
}

type Tab = "pools" | "invitations";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("pools");

  // Invitations state
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [newInvite, setNewInvite] = useState<Invitation | null>(null);
  const [copied, setCopied] = useState(false);

  // Pools state
  const [pools, setPools] = useState<Pool[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const [poolName, setPoolName] = useState("");
  const [creatingPool, setCreatingPool] = useState(false);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [deletingPoolId, setDeletingPoolId] = useState<string | null>(null);

  const inviteStats = {
    total: invitations.length,
    used: invitations.filter(i => i.used).length,
    pending: invitations.filter(i => !i.used && (!i.expiresAt || new Date(i.expiresAt) > new Date())).length
  };

  useEffect(() => {
    fetchInvitations();
    fetchPools();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoadingInvites(true);
      const res = await fetch("/api/admin/invitations");
      if (res.status === 401) { router.push("/login"); return; }
      if (res.status === 403) { router.push("/formation"); return; }
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations);
      }
    } catch (err) {
      console.error("Error fetching invitations:", err);
    } finally {
      setLoadingInvites(false);
    }
  };

  const fetchPools = async () => {
    try {
      setLoadingPools(true);
      const res = await fetch("/api/admin/pools");
      if (res.ok) {
        const data = await res.json();
        setPools(data.pools);
      }
    } catch (err) {
      console.error("Error fetching pools:", err);
    } finally {
      setLoadingPools(false);
    }
  };

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poolName.trim()) return;

    setCreatingPool(true);
    setPoolError(null);
    try {
      const res = await fetch("/api/admin/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: poolName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPoolError(data.error || "Erreur lors de la création");
        return;
      }

      setPools(prev => [data.pool, ...prev]);
      setPoolName("");
    } catch (err) {
      console.error("Error creating pool:", err);
      setPoolError("Erreur réseau");
    } finally {
      setCreatingPool(false);
    }
  };

  const handleDeletePool = async (poolId: string) => {
    if (!confirm("Supprimer cette pool ? Les étudiants seront désassignés.")) return;

    setDeletingPoolId(poolId);
    try {
      const res = await fetch(`/api/admin/pools/${poolId}`, { method: "DELETE" });
      if (res.ok) {
        setPools(prev => prev.filter(p => p.id !== poolId));
      }
    } catch (err) {
      console.error("Error deleting pool:", err);
    } finally {
      setDeletingPoolId(null);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la génération");
        return;
      }

      setNewInvite(data.invitation);
      setInvitations(prev => [data.invitation, ...prev]);
      setEmail("");
    } catch (err) {
      console.error("Error generating invitation:", err);
      setError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/login?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInviteStatusBadge = (invite: Invitation) => {
    const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
    if (invite.used) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-green-50 border border-green-200 text-green-600">
          <CheckCircle2 size={10} /> Utilisée
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-red-50 border border-red-200 text-red-500">
          <AlertCircle size={10} /> Expirée
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-orange-50 border border-[#d97757]/25 text-[#d97757] animate-pulse">
        <Clock size={10} /> En attente
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFCFA] font-mono text-stone-900 selection:bg-[#FED7AA] selection:text-[#d97757]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d97757] rounded-lg flex items-center justify-center text-white shadow-sm">
              <Cpu size={22} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-stone-900">CODEX_AI</span>
          </div>

          <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
            Administration
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/formation"
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#d97757] hover:bg-orange-50 rounded-lg transition-all font-bold"
            >
              <GraduationCap size={16} />
              <span>Formation</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-all"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("pools")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
              activeTab === "pools"
                ? "bg-white text-[#d97757] shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Layers size={16} />
            Pools
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
              activeTab === "invitations"
                ? "bg-white text-[#d97757] shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Mail size={16} />
            Invitations
          </button>
        </div>

        {/* ═══════════════════════ POOLS TAB ═══════════════════════ */}
        {activeTab === "pools" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Pools créées", value: pools.length, icon: Layers },
                { label: "Étudiants assignés", value: pools.reduce((sum, p) => sum + p.memberCount, 0), icon: Users },
                { label: "Sessions totales", value: pools[0]?.totalSessions ?? 0, icon: GraduationCap },
              ].map((stat, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={stat.label}
                  className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{stat.label}</span>
                    <stat.icon size={18} className="text-stone-300 group-hover:text-[#d97757] transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Create Pool Form */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                    <Plus size={20} className="text-[#d97757]" />
                    Nouvelle pool
                  </h2>

                  <form onSubmit={handleCreatePool} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Nom de la pool</label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                        <input
                          type="text"
                          required
                          value={poolName}
                          onChange={(e) => { setPoolName(e.target.value); setPoolError(null); }}
                          placeholder="Pool du 10 février"
                          className="w-full bg-[#FFF7ED] border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#d97757]/40 transition-all placeholder:text-stone-300"
                        />
                      </div>
                    </div>

                    {poolError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-[#DC2626]">
                        {poolError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={creatingPool}
                      className="w-full bg-[#d97757] text-white rounded-lg py-3 text-sm font-bold hover:bg-[#c4674a] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {creatingPool ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Créer la pool
                    </button>
                  </form>
                </motion.div>
              </div>

              {/* Pools List */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-stone-800">Mes pools</h2>
                    <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      {pools.length} pools
                    </div>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {loadingPools ? (
                      <div className="px-6 py-12 text-center text-stone-400">
                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                        Chargement des pools...
                      </div>
                    ) : pools.length === 0 ? (
                      <div className="px-6 py-12 text-center text-stone-400">
                        Aucune pool créée pour le moment.
                      </div>
                    ) : (
                      pools.map((pool) => (
                        <div
                          key={pool.id}
                          className="flex items-center justify-between px-6 py-4 hover:bg-orange-50/30 transition-colors group"
                        >
                          <Link
                            href={`/admin/pools/${pool.id}`}
                            className="flex-1 flex items-center gap-4 min-w-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#d97757]/10 flex items-center justify-center shrink-0">
                              <Layers size={18} className="text-[#d97757]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-stone-700 truncate">{pool.name}</div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                                  <UserPlus size={10} />
                                  {pool.memberCount} élèves
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  {pool.unlockedSessions}/{pool.totalSessions} sessions
                                </span>
                              </div>
                            </div>
                          </Link>

                          <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-2">
                              <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#d97757] rounded-full transition-all"
                                  style={{
                                    width: pool.totalSessions > 0
                                      ? `${Math.round((pool.unlockedSessions / pool.totalSessions) * 100)}%`
                                      : '0%'
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-stone-400 w-8">
                                {pool.totalSessions > 0
                                  ? `${Math.round((pool.unlockedSessions / pool.totalSessions) * 100)}%`
                                  : '0%'}
                              </span>
                            </div>

                            <button
                              onClick={(e) => { e.preventDefault(); handleDeletePool(pool.id); }}
                              disabled={deletingPoolId === pool.id}
                              className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              {deletingPoolId === pool.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>

                            <Link href={`/admin/pools/${pool.id}`} className="p-2 text-stone-300 hover:text-[#d97757] transition-all">
                              <ChevronRight size={18} />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════ INVITATIONS TAB ═══════════════════════ */}
        {activeTab === "invitations" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Invite Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Invitations envoyées", value: inviteStats.total, icon: Users },
                { label: "Utilisées", value: inviteStats.used, icon: CheckCircle2 },
                { label: "En attente", value: inviteStats.pending, icon: Clock },
              ].map((stat, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={stat.label}
                  className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{stat.label}</span>
                    <stat.icon size={18} className="text-stone-300 group-hover:text-[#d97757] transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                    <Plus size={20} className="text-[#d97757]" />
                    Nouvelle invitation
                  </h2>

                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Email de l&apos;élève</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(null); }}
                          placeholder="nom@exemple.fr"
                          className="w-full bg-[#FFF7ED] border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#d97757]/40 transition-all placeholder:text-stone-300"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-[#DC2626]">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#d97757] text-white rounded-lg py-3 text-sm font-bold hover:bg-[#c4674a] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Générer l&apos;invitation
                    </button>
                  </form>
                </motion.div>

                {/* Success Card */}
                <AnimatePresence>
                  {newInvite && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-orange-50 border border-[#d97757]/20 rounded-xl p-6 shadow-sm"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-[#d97757]/10 rounded-full flex items-center justify-center mx-auto">
                          <ExternalLink size={24} className="text-[#d97757]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-stone-800">Invitation créée</h3>
                          <p className="text-xs text-stone-500 mt-1">Lien prêt pour {newInvite.email}</p>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-lg p-3 font-bold text-[#d97757] tracking-widest text-lg">
                          {newInvite.code}
                        </div>

                        <button
                          onClick={() => copyToClipboard(newInvite.code)}
                          className="w-full bg-white border border-[#d97757]/20 text-[#d97757] rounded-lg py-3 text-xs font-bold hover:bg-orange-100/50 transition-all flex items-center justify-center gap-2"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? "Copié !" : "Copier le lien"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Table */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-stone-800">Liste des invitations</h2>
                    <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      {invitations.length} entrées
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-stone-50/50">
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Email</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Code</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Statut</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Créé le</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {loadingInvites ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                              <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                              Chargement des données...
                            </td>
                          </tr>
                        ) : invitations.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                              Aucune invitation générée pour le moment.
                            </td>
                          </tr>
                        ) : (
                          invitations.map((invite) => (
                            <tr key={invite.id} className="hover:bg-orange-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-stone-700">{invite.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold text-[#d97757] bg-orange-50 px-2 py-1 rounded">
                                  {invite.code}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {getInviteStatusBadge(invite)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-xs text-stone-500">
                                  {new Date(invite.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto p-6 mt-12 mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-stone-300">
          <div className="h-px w-8 bg-stone-200" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">CODEX_AI SYSTEM V1.0</span>
          <div className="h-px w-8 bg-stone-200" />
        </div>
      </footer>
    </div>
  );
}
