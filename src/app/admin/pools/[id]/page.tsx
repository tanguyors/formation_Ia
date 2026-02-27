"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Cpu,
  ArrowLeft,
  Lock,
  Unlock,
  Loader2,
  Users,
  UserPlus,
  UserMinus,
  CheckCircle2,
  BookOpen,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

interface PoolSession {
  id: string;
  sessionNumber: number;
  title: string;
  week: number;
  day: number;
  isUnlocked: boolean;
}

interface Member {
  id: string;
  email: string;
  displayName: string;
  level: number;
  xp: number;
}

interface UnassignedUser {
  id: string;
  email: string;
  displayName: string;
}

interface PoolDetail {
  id: string;
  name: string;
  createdAt: string;
}

const DAY_NAMES: Record<number, string> = { 1: "Lundi", 2: "Mercredi", 3: "Vendredi" };

export default function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: poolId } = use(params);
  const router = useRouter();

  const [pool, setPool] = useState<PoolDetail | null>(null);
  const [sessions, setSessions] = useState<PoolSession[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [unassigned, setUnassigned] = useState<UnassignedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingSession, setTogglingSession] = useState<string | null>(null);
  const [addingMember, setAddingMember] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  useEffect(() => {
    fetchPoolDetail();
  }, [poolId]);

  const fetchPoolDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pools/${poolId}`);
      if (res.status === 401) { router.push("/login"); return; }
      if (res.status === 403) { router.push("/formation"); return; }
      if (res.status === 404) { router.push("/admin"); return; }
      if (res.ok) {
        const data = await res.json();
        setPool(data.pool);
        setSessions(data.sessions);
        setMembers(data.members);
        setUnassigned(data.unassigned);
      }
    } catch (err) {
      console.error("Error fetching pool:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSession = async (sessionId: string, currentlyUnlocked: boolean) => {
    setTogglingSession(sessionId);
    try {
      const res = await fetch(`/api/admin/pools/${poolId}/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unlock: !currentlyUnlocked }),
      });

      if (res.ok) {
        setSessions(prev =>
          prev.map(s => s.id === sessionId ? { ...s, isUnlocked: !currentlyUnlocked } : s)
        );
      }
    } catch (err) {
      console.error("Error toggling session:", err);
    } finally {
      setTogglingSession(null);
    }
  };

  const handleAddMember = async (userId: string) => {
    setAddingMember(userId);
    try {
      const res = await fetch(`/api/admin/pools/${poolId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const user = unassigned.find(u => u.id === userId);
        if (user) {
          setUnassigned(prev => prev.filter(u => u.id !== userId));
          setMembers(prev => [...prev, { ...user, level: 1, xp: 0 }]);
        }
      }
    } catch (err) {
      console.error("Error adding member:", err);
    } finally {
      setAddingMember(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setRemovingMember(userId);
    try {
      const res = await fetch(`/api/admin/pools/${poolId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const user = members.find(m => m.id === userId);
        if (user) {
          setMembers(prev => prev.filter(m => m.id !== userId));
          setUnassigned(prev => [...prev, { id: user.id, email: user.email, displayName: user.displayName }]);
        }
      }
    } catch (err) {
      console.error("Error removing member:", err);
    } finally {
      setRemovingMember(null);
    }
  };

  const unlockedCount = sessions.filter(s => s.isUnlocked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCFA] font-mono flex items-center justify-center">
        <Loader2 className="animate-spin text-[#d97757]" size={32} />
      </div>
    );
  }

  if (!pool) return null;

  // Group sessions by week
  const sessionsByWeek = sessions.reduce<Record<number, PoolSession[]>>((acc, s) => {
    if (!acc[s.week]) acc[s.week] = [];
    acc[s.week].push(s);
    return acc;
  }, {});

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
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
            Retour admin
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Pool header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#d97757]/10 flex items-center justify-center">
            <Layers size={24} className="text-[#d97757]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">{pool.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-stone-400">
                {members.length} élèves
              </span>
              <span className="text-xs text-stone-400">
                {unlockedCount}/{sessions.length} sessions déverrouillées
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Élèves dans la pool", value: members.length, icon: Users },
            { label: "Sessions déverrouillées", value: unlockedCount, icon: Unlock },
            { label: "Sessions verrouillées", value: sessions.length - unlockedCount, icon: Lock },
          ].map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm group"
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
          {/* Sessions Grid */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <BookOpen size={20} className="text-[#d97757]" />
                  Sessions
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  {unlockedCount}/{sessions.length} ouvertes
                </span>
              </div>

              <div className="p-6 space-y-6">
                {Object.entries(sessionsByWeek)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([week, weekSessions]) => (
                    <div key={week}>
                      <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3">
                        Semaine {week}
                      </div>
                      <div className="space-y-2">
                        {weekSessions.map((session) => {
                          const isToggling = togglingSession === session.id;
                          return (
                            <div
                              key={session.id}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                session.isUnlocked
                                  ? "bg-green-50/50 border-green-200"
                                  : "bg-stone-50/50 border-stone-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[#d97757] bg-orange-50 px-2 py-1 rounded">
                                  S{String(session.sessionNumber).padStart(2, "0")}
                                </span>
                                <div>
                                  <div className="text-sm font-bold text-stone-700">{session.title}</div>
                                  <div className="text-[10px] text-stone-400 mt-0.5">
                                    {DAY_NAMES[session.day] ?? `Jour ${session.day}`}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {session.isUnlocked ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-green-50 border border-green-200 text-green-600">
                                    <Unlock size={10} /> Ouverte
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-stone-100 border border-stone-200 text-stone-500">
                                    <Lock size={10} /> Fermée
                                  </span>
                                )}

                                <button
                                  onClick={() => handleToggleSession(session.id, session.isUnlocked)}
                                  disabled={isToggling}
                                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 ${
                                    session.isUnlocked
                                      ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                      : "bg-[#d97757] text-white hover:bg-[#c4674a] shadow-sm"
                                  }`}
                                >
                                  {isToggling ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : session.isUnlocked ? (
                                    <Lock size={14} />
                                  ) : (
                                    <Unlock size={14} />
                                  )}
                                  {session.isUnlocked ? "Fermer" : "Ouvrir"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* Members Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Current Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-stone-200">
                <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <Users size={20} className="text-[#d97757]" />
                  Élèves ({members.length})
                </h2>
              </div>

              <div className="divide-y divide-stone-100">
                {members.length === 0 ? (
                  <div className="px-6 py-8 text-center text-stone-400 text-sm">
                    Aucun élève dans cette pool.
                  </div>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-orange-50/30 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-stone-700 truncate">
                          {member.displayName || member.email}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-stone-400">Niv. {member.level}</span>
                          <span className="text-[10px] text-[#d97757]">{member.xp} XP</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removingMember === member.id}
                        className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Retirer de la pool"
                      >
                        {removingMember === member.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserMinus size={14} />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Unassigned Students */}
            {unassigned.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-stone-200">
                  <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <UserPlus size={16} className="text-stone-400" />
                    Élèves sans pool ({unassigned.length})
                  </h2>
                </div>

                <div className="divide-y divide-stone-100">
                  {unassigned.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-orange-50/30 transition-colors"
                    >
                      <div className="text-sm text-stone-600 truncate min-w-0">
                        {user.displayName || user.email}
                      </div>
                      <button
                        onClick={() => handleAddMember(user.id)}
                        disabled={addingMember === user.id}
                        className="shrink-0 px-3 py-1.5 bg-[#d97757] text-white rounded-lg text-[10px] font-bold hover:bg-[#c4674a] transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {addingMember === user.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <UserPlus size={12} />
                        )}
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
