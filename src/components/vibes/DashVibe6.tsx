"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Trophy,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  Lock,
  Zap,
  Layout,
  PlayCircle,
  CircleDot,
  Moon,
  Sun,
  LogOut,
  Shield,
  X,
  Clock,
  Target,
  User,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSessions } from '@/hooks/useSession';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import { Toast } from '@/components/Toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Types & Constants ───────────────────────────────────────

type SessionStatus = 'COMPLETED' | 'CURRENT' | 'LOCKED';

interface Session {
  id: string;
  number: string;
  title: string;
  week: number;
  weekTitle: string;
  day: string;
  status: SessionStatus;
  briefing: string;
  duration: string;
  xp: number;
}

const WEEK_TITLES: Record<number, string> = {
  1: 'MAÎTRISER CLAUDE CODE',
  2: "MCP : CONNECTER L'IA À TOUT",
  3: 'AGENTS IA',
  4: 'ASSEMBLER ET DEVENIR DANGEREUX',
};

const DAY_NAMES: Record<number, string> = {
  1: 'Lundi',
  2: 'Mercredi',
  3: 'Vendredi',
};

const LEVEL_LABELS: Record<string, string> = {
  OPERATEUR: 'OPÉRATEUR',
  CONNECTEUR: 'CONNECTEUR',
  ARCHITECTE: 'ARCHITECTE',
  SENTINELLE: 'SENTINELLE',
};

const LEVEL_NUMBERS: Record<string, number> = {
  OPERATEUR: 1,
  CONNECTEUR: 2,
  ARCHITECTE: 3,
  SENTINELLE: 4,
};

const WEEK_SHORT: Record<number, string> = {
  1: 'W1: CLAUDE',
  2: 'W2: MCP',
  3: 'W3: AGENTS',
  4: 'W4: SHIP',
};

function mapStatus(userStatus: string): SessionStatus {
  if (userStatus === 'COMPLETED') return 'COMPLETED';
  if (userStatus === 'AVAILABLE' || userStatus === 'IN_PROGRESS') return 'CURRENT';
  return 'LOCKED';
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
  }
  return `${minutes}min`;
}

// ─── Modal ───────────────────────────────────────────────────

const Modal = ({ session, onClose, onLaunch }: { session: Session; onClose: () => void; onLaunch: () => void }) => {
  const isLocked = session.status === 'LOCKED';
  const isCompleted = session.status === 'COMPLETED';
  const isCurrent = session.status === 'CURRENT';

  const statusLabel = isCompleted ? 'Module Terminé' : isCurrent ? 'En Cours' : 'Accès Verrouillé';
  const statusBadgeClass = isCompleted
    ? 'bg-green-50 border-green-200 text-green-600'
    : isCurrent
      ? 'bg-[#F97316]/5 border-[#F97316]/25 text-[#F97316] animate-pulse'
      : '';
  const statusBadgeStyle = isLocked
    ? { background: 'var(--cx-bg-alt)', borderColor: 'var(--cx-border)', color: 'var(--cx-text-muted)' }
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans"
      style={{ background: 'rgba(0,0,0,0.25)' }}
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl backdrop-blur-xl border shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)' }}
      >
        {/* Top Progress Bar */}
        <div className="h-1.5" style={{ background: 'var(--cx-bg-alt)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full', isCompleted ? 'bg-green-500' : 'bg-[#F97316]')}
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
          style={{ color: 'var(--cx-text-muted)' }}
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={cn('px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border font-bold flex items-center gap-1.5', statusBadgeClass)} style={statusBadgeStyle}>
                {isCompleted && <CheckCircle2 size={12} />}
                {isCurrent && <Zap size={12} />}
                {isLocked && <Lock size={12} />}
                {statusLabel}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--cx-text-muted)' }}>
                {session.number} · {session.day}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight leading-tight" style={{ color: 'var(--cx-text)' }}>
              {session.title}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#F97316] mt-1.5 font-bold">
              {session.weekTitle}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {[
              { icon: Trophy, label: 'Récompense', value: `+${session.xp} XP`, accent: true },
              { icon: Clock, label: 'Durée', value: session.duration },
              { icon: Target, label: 'Secteur', value: `0${session.week}` },
            ].map((item) => (
              <div key={item.label} className="border rounded-xl p-3 sm:p-4 flex flex-col items-center text-center" style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)' }}>
                <item.icon size={16} className="text-[#F97316] mb-2" />
                <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--cx-text-muted)' }}>{item.label}</p>
                <p className={cn('text-sm font-bold', item.accent ? 'text-[#F97316]' : '')} style={!item.accent ? { color: 'var(--cx-text)' } : undefined}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Briefing */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-[#F97316]" />
              <h4 className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--cx-text)' }}>Description</h4>
            </div>
            <div className="rounded-xl p-5 border" style={{ background: 'var(--cx-bg-alt)', borderColor: 'var(--cx-border)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--cx-text)' }}>
                {session.briefing}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onLaunch}
            disabled={isLocked}
            className={cn(
              'w-full py-4 rounded-xl text-xs font-bold tracking-widest transition-all flex items-center justify-center gap-2',
              isLocked
                ? 'cursor-not-allowed border'
                : 'bg-[#F97316] text-white hover:bg-[#ea580c] active:scale-[0.98] shadow-sm hover:shadow-md'
            )}
            style={isLocked ? { background: 'var(--cx-bg-alt)', color: 'var(--cx-text-muted)', borderColor: 'var(--cx-border)' } : undefined}
          >
            {isLocked ? 'ACCÈS REFUSÉ' : isCompleted ? 'REVOIR LA SESSION' : 'LANCER LA SESSION'}
            {!isLocked && <ChevronRight size={16} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────

export default function CodexDashboard() {
  const router = useRouter();
  const { sessions: apiSessions, loading: sessionsLoading, newlyUnlocked, dismissUnlocked } = useSessions();
  const { data: progressData, loading: progressLoading } = useProgress();
  const { dark, toggle: toggleTheme } = useTheme();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const loading = sessionsLoading || progressLoading;

  // Map API sessions
  const sessions: Session[] = apiSessions.map(s => ({
    id: s.id,
    number: `S${String(s.sessionNumber).padStart(2, '0')}`,
    title: s.title,
    week: s.week,
    weekTitle: WEEK_TITLES[s.week] || `SEMAINE ${s.week}`,
    day: DAY_NAMES[s.day] || `Jour ${s.day}`,
    status: mapStatus(s.userStatus),
    briefing: s.briefing || s.description || '',
    duration: formatDuration(s.durationMinutes),
    xp: 100,
  }));

  // User data
  const userProfile = progressData?.user;
  const stats = progressData?.stats;
  const isAdmin = userProfile?.role === 'ADMIN';

  const levelKey = userProfile?.level || 'OPERATEUR';
  const levelLabel = LEVEL_LABELS[levelKey] || levelKey;
  const levelNumber = LEVEL_NUMBERS[levelKey] || 1;
  const xp = userProfile?.xp || 0;
  const maxXp = 1200;
  const xpPercent = Math.min((xp / maxXp) * 100, 100);

  const completedCount = stats?.completedSessions || 0;
  const totalCount = stats?.totalSessions || sessions.length || 12;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Current session & week
  const currentSession = sessions.find(s => s.status === 'CURRENT');
  const currentWeek = currentSession?.week ?? (sessions.length > 0 ? sessions[sessions.length - 1].week : 1);
  const currentWeekSessions = sessions.filter(s => s.week === currentWeek);

  // Session progress for big card
  const currentSessionProgress = currentSession
    ? (apiSessions.find(a => a.id === currentSession.id)?.userStatus === 'IN_PROGRESS' ? 50 : 0)
    : 0;

  // Weeks for timeline
  const allWeeks = [1, 2, 3, 4];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  function handleLaunchSession(session: Session) {
    if (session.status !== 'LOCKED') {
      router.push(`/formation/${session.id}`);
    }
  }

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center" style={{ background: 'var(--cx-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--cx-accent)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--cx-text-secondary)' }}>Chargement du parcours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased p-4 md:p-8" style={{ background: 'var(--cx-bg)', color: 'var(--cx-text)' }}>
      {/* Toast */}
      <Toast
        message={newlyUnlocked ? `Nouvelle session disponible : ${newlyUnlocked}` : ''}
        visible={!!newlyUnlocked}
        onClose={dismissUnlocked}
      />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ═══ TOP BAR ═══ */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border p-4 rounded-2xl" style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#F97316]/10 border-2 border-[#F97316]/20 overflow-hidden flex items-center justify-center">
                <User size={22} className="text-[#F97316]" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[var(--cx-accent)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2" style={{ borderColor: 'var(--cx-surface)' }}>
                LVL {levelNumber}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--cx-text-muted)' }}>STATUT ACTUEL</div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">{levelLabel}</h2>
                <div className="h-1.5 w-32 rounded-full overflow-hidden" style={{ background: 'var(--cx-accent-bg)', border: '1px solid var(--cx-accent-border)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--cx-accent)' }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--cx-text-secondary)' }}>{xp} / {maxXp} XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentSession && (
              <button
                onClick={() => handleLaunchSession(currentSession)}
                className="bg-[var(--cx-accent)] hover:bg-[var(--cx-accent-hover)] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center gap-2 group"
                style={{ boxShadow: '0 4px 14px var(--cx-glow)' }}
              >
                <Zap size={16} className="fill-current" />
                CONTINUER
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            <button onClick={toggleTheme} className="p-2.5 rounded-xl border transition-colors" style={{ borderColor: 'var(--cx-border)', color: 'var(--cx-text-secondary)' }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAdmin && (
              <button onClick={() => router.push('/admin')} className="p-2.5 rounded-xl border transition-colors" style={{ borderColor: 'var(--cx-border)', color: 'var(--cx-text-secondary)' }}>
                <Shield size={16} />
              </button>
            )}

            <button onClick={handleLogout} className="p-2.5 rounded-xl border transition-colors" style={{ borderColor: 'var(--cx-border)', color: 'var(--cx-text-secondary)' }}>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* ═══ BENTO GRID ═══ */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* LARGE CARD: CURRENT SESSION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 md:row-span-2 border rounded-2xl p-8 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all relative overflow-hidden group cursor-pointer"
            style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}
            onClick={() => currentSession && setSelectedSession(currentSession)}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layout size={120} strokeWidth={1} />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                {currentSession ? (
                  <>
                    <span className="text-[var(--cx-accent)] text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse" style={{ background: 'var(--cx-accent-bg)', border: '1px solid var(--cx-accent-border)' }}>
                      EN COURS — {currentSession.number}
                    </span>
                    <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--cx-text-muted)' }}>
                      {currentSession.day.toUpperCase()} • {currentSession.duration}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: 'var(--cx-green-bg)', border: '1px solid var(--cx-green-border)', color: 'var(--cx-green)' }}>
                    PARCOURS TERMINÉ
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold leading-tight max-w-md">
                {currentSession?.title ?? 'Toutes les sessions complétées !'}
              </h1>
              <p className="text-base max-w-sm" style={{ color: 'var(--cx-text-secondary)' }}>
                {currentSession?.briefing ?? 'Bravo, vous avez terminé le parcours CODEX_AI.'}
              </p>
            </div>

            <div className="mt-8 space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--cx-text-secondary)' }}>Progression de la quête</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--cx-accent)' }}>{currentSession ? `${currentSessionProgress}%` : '100%'}</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--cx-accent-bg)', border: '1px solid var(--cx-accent-border)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: currentSession ? `${currentSessionProgress}%` : '100%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--cx-accent)', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }}
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentSession) handleLaunchSession(currentSession);
                }}
                disabled={!currentSession}
                className="w-full md:w-fit px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--cx-text)', color: 'var(--cx-bg)' }}
              >
                <PlayCircle size={20} />
                {currentSession ? 'CONTINUER LA SESSION' : 'PARCOURS TERMINÉ'}
              </button>
            </div>
          </motion.section>

          {/* MEDIUM CARD: WEEK OVERVIEW */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 border rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--cx-text-muted)' }}>Cette Semaine</h3>
              <span className="text-xs font-medium" style={{ color: 'var(--cx-text-secondary)' }}>W{currentWeek}</span>
            </div>

            <div className="space-y-3">
              {currentWeekSessions.map((s) => {
                const isDone = s.status === 'COMPLETED';
                const isActive = s.status === 'CURRENT';
                const isLocked = s.status === 'LOCKED';

                return (
                  <div
                    key={s.id}
                    onClick={() => !isLocked && setSelectedSession(s)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-colors",
                      !isLocked && "cursor-pointer hover:shadow-sm",
                      isLocked && "opacity-60 cursor-not-allowed",
                      isActive && "ring-1 ring-inset"
                    )}
                    style={{
                      background: isDone ? 'var(--cx-green-bg)' : isActive ? 'var(--cx-accent-bg)' : 'var(--cx-surface-hover)',
                      borderColor: isDone ? 'var(--cx-green-border)' : isActive ? 'var(--cx-accent-border)' : 'var(--cx-border)',
                      ...(isActive ? { '--tw-ring-color': 'var(--cx-accent)' } as React.CSSProperties : {}),
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isDone && <CheckCircle2 size={16} style={{ color: 'var(--cx-green)' }} />}
                      {isActive && <CircleDot size={16} style={{ color: 'var(--cx-accent)' }} />}
                      {isLocked && <Lock size={16} style={{ color: 'var(--cx-text-muted)' }} />}
                      <span className="text-xs font-semibold truncate max-w-[120px]">{s.number} {s.title.split(':')[0]}</span>
                    </div>
                    <span className={cn("text-[10px] font-bold uppercase")} style={{
                      color: isDone ? 'var(--cx-green)' : isActive ? 'var(--cx-accent)' : 'var(--cx-text-muted)',
                    }}>
                      {isDone ? 'Fini' : isActive ? 'Actif' : 'Verrouillé'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* SMALL CARD: XP CIRCULAR */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 border rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2"
            style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48" cy="48" r="40"
                  fill="transparent"
                  stroke="var(--cx-border)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="48" cy="48" r="40"
                  fill="transparent"
                  stroke="var(--cx-accent)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * (progressPercent / 100)) }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{progressPercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--cx-accent)' }}>{xp} XP</div>
              <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--cx-text-muted)' }}>{completedCount}/{totalCount} Sessions</div>
            </div>
          </motion.section>

          {/* SMALL CARD: RANK */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 border rounded-2xl p-6 flex flex-col gap-4 overflow-hidden"
            style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--cx-text-muted)' }}>Classement</h3>
              <Trophy size={16} style={{ color: 'var(--cx-accent)' }} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">#42</span>
              <span className="text-sm font-medium" style={{ color: 'var(--cx-text-secondary)' }}>sur 156</span>
            </div>
            <div className="flex items-end gap-1 h-12 pt-2">
              {[30, 45, 35, 60, 40, 75, 50, 65].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 5 ? 'var(--cx-accent)' : 'var(--cx-border)',
                  }}
                />
              ))}
            </div>
          </motion.section>

          {/* MEDIUM CARD: FULL TIMELINE */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 border rounded-2xl p-6 flex flex-col gap-6"
            style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--cx-text-muted)' }}>Parcours CODEX_AI</h3>
              <div className="text-xs font-semibold" style={{ color: 'var(--cx-accent)' }}>{completedCount} / {totalCount} SESSIONS COMPLÉTÉES</div>
            </div>

            <div className="relative px-2">
              <div className="absolute top-1.5 left-0 w-full h-0.5 z-0" style={{ background: 'var(--cx-border)' }} />
              <div className="flex justify-between relative z-10">
                {Array.from({ length: 12 }).map((_, i) => {
                  const session = sessions[i];
                  const isDone = session?.status === 'COMPLETED';
                  const isActive = session?.status === 'CURRENT';
                  return (
                    <div
                      key={i}
                      className={cn("flex flex-col items-center", session && session.status !== 'LOCKED' && "cursor-pointer")}
                      onClick={() => session && session.status !== 'LOCKED' && setSelectedSession(session)}
                      title={session?.title}
                    >
                      <div
                        className={cn(
                          "w-3.5 h-3.5 rounded-full border-2 transition-all",
                          isDone && "border-[var(--cx-accent)]",
                          isActive && "scale-125 animate-pulse border-[var(--cx-accent)]",
                          !isDone && !isActive && "border-[var(--cx-border)]"
                        )}
                        style={{
                          background: isDone ? 'var(--cx-accent)' : isActive ? 'var(--cx-surface)' : 'var(--cx-surface)',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-4 text-center">
              {allWeeks.map(w => {
                const weekSessions = sessions.filter(s => s.week === w);
                const hasActive = weekSessions.some(s => s.status === 'CURRENT');
                const allDone = weekSessions.length > 0 && weekSessions.every(s => s.status === 'COMPLETED');
                return (
                  <div key={w} className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: hasActive || allDone ? 'var(--cx-text)' : 'var(--cx-text-muted)' }}>
                      {WEEK_SHORT[w]}
                    </div>
                    <div
                      className="h-1 w-full rounded-full"
                      style={{
                        background: allDone ? 'var(--cx-accent)' : hasActive ? 'var(--cx-accent)' : 'var(--cx-border)',
                        opacity: hasActive && !allDone ? 0.3 : 1,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* SMALL CARD: DAILY TIP */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 border rounded-2xl p-6 flex flex-col gap-3 group cursor-help"
            style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border)', boxShadow: 'var(--cx-card-shadow)' }}
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-[10px] uppercase tracking-widest" style={{ color: 'var(--cx-text-muted)' }}>Conseil du jour</h3>
            </div>
            <p className="text-sm font-medium leading-relaxed italic">
              &quot;Utilisez <span className="font-bold" style={{ color: 'var(--cx-accent)' }}>/plan</span> pour réfléchir avant de coder.&quot;
            </p>
          </motion.section>

          {/* SMALL CARD: DISCORD (DARK) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-1 rounded-2xl p-6 shadow-xl flex flex-col justify-between group cursor-pointer"
            style={{ background: dark ? '#1c1917' : '#0c0a09' }}
          >
            <div className="flex items-start justify-between">
              <MessageSquare size={24} className="text-white/80" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/60">42 ONLINE</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-bold text-sm">Communauté Discord</h3>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Échanger & progresser</p>
            </div>
          </motion.section>

        </main>
      </div>

      {/* ═══ MODAL ═══ */}
      <AnimatePresence>
        {selectedSession && (
          <Modal
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
            onLaunch={() => handleLaunchSession(selectedSession)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
