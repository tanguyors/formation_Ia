"use client";
// DASHBOARD — Dungeon Map / Roguelike — Cloud Tangerine
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Terminal, Cpu, Workflow, ChevronRight, CheckCircle2, Zap, Lock,
  Target, Trophy, User, X, ArrowRight, LogOut, Shield, Menu, ChevronDown,
  Moon, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSessions } from '@/hooks/useSession';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import { Toast } from '@/components/Toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

const BadgeTag = ({ icon: Icon, label, variant = 'default' }: { icon?: React.ElementType, label: string, variant?: 'default' | 'success' | 'active' | 'locked' }) => {
  const variants = {
    default: 'bg-[#F97316]/5 border-[#F97316]/20 text-[#F97316]',
    success: 'bg-green-50 border-green-200 text-green-600',
    active: 'bg-[#F97316]/5 border-[#F97316]/25 text-[#F97316] animate-pulse',
    locked: 'bg-slate-100 border-slate-200 text-slate-400'
  };
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-full text-[10px] font-sans uppercase tracking-widest", variants[variant])}>
      {Icon && <Icon size={12} />}
      {label}
    </div>
  );
};

const RoomCard = ({ session, onClick }: { session: Session, onClick: () => void }) => {
  const isLocked = session.status === 'LOCKED';
  const isCurrent = session.status === 'CURRENT';
  const isCompleted = session.status === 'COMPLETED';

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.02, translateY: -2 } : {}}
      onClick={onClick}
      className={cn(
        "relative group flex flex-col items-start text-left w-full h-44 p-5 rounded-2xl border-2 font-sans transition-all duration-300",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
      style={{
        background: isCompleted || isCurrent ? 'var(--cx-surface)' : 'var(--cx-surface-hover)',
        borderColor: isCompleted ? 'var(--cx-green-border)' : isCurrent ? 'var(--cx-accent)' : 'var(--cx-border)',
        boxShadow: isCurrent ? '0 0 25px var(--cx-glow)' : 'var(--cx-card-shadow)',
      }}
    >
      <div className="flex justify-between items-start w-full mb-auto">
        <span className={cn(
          "text-xs font-bold tracking-widest uppercase px-2 py-1 rounded-md",
          isCurrent && "text-white"
        )} style={{
          background: isCompleted ? 'var(--cx-green-bg)' : isCurrent ? 'var(--cx-accent)' : 'var(--cx-surface-hover)',
          color: isCompleted ? 'var(--cx-green)' : isCurrent ? '#fff' : 'var(--cx-text-muted)',
        }}>{session.number}</span>
        {isCompleted && <CheckCircle2 size={20} style={{ color: 'var(--cx-green)' }} />}
        {isCurrent && <Zap size={20} className="animate-pulse" style={{ color: 'var(--cx-accent)' }} />}
        {isLocked && <Lock size={20} style={{ color: 'var(--cx-text-muted)' }} />}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-bold leading-snug line-clamp-2" style={{ color: isLocked ? 'var(--cx-text-muted)' : 'var(--cx-text)' }}>{session.title}</h3>
        <p className="text-[10px] mt-1.5 uppercase tracking-wider" style={{ color: 'var(--cx-text-muted)' }}>{session.day} — {session.duration}</p>
      </div>
      {isCurrent && <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full animate-ping" style={{ background: 'var(--cx-accent)' }} />}
    </motion.button>
  );
};

const Modal = ({ session, onClose, onLaunch }: { session: Session, onClose: () => void, onLaunch: () => void }) => {
  const isLocked = session.status === 'LOCKED';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'var(--cx-bg)', border: '1px solid var(--cx-border)' }} onClick={e => e.stopPropagation()}>
        <div className="relative h-2" style={{ background: 'var(--cx-border)' }}>
          <div className={cn("absolute inset-y-0 left-0", session.status === 'COMPLETED' ? "w-full" : session.status === 'CURRENT' ? "w-1/2" : "w-0")} style={{ background: session.status === 'COMPLETED' ? 'var(--cx-green)' : 'var(--cx-accent)' }} />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BadgeTag label={session.status === 'COMPLETED' ? 'Module Terminé' : session.status === 'CURRENT' ? 'En Cours' : 'Accès Verrouillé'} variant={session.status === 'COMPLETED' ? 'success' : session.status === 'CURRENT' ? 'active' : 'locked'} />
                <span className="text-[10px] font-sans uppercase tracking-widest" style={{ color: 'var(--cx-text-muted)' }}>{session.number} • {session.day}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight" style={{ color: 'var(--cx-text)' }}>{session.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full transition-colors hover:opacity-70" style={{ color: 'var(--cx-text-muted)' }}><X size={20} /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {[
              { label: 'Récompense', value: `+${session.xp} XP`, accent: true },
              { label: 'Durée', value: session.duration },
              { label: 'Secteur', value: `0${session.week}` },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg" style={{ background: 'var(--cx-surface)', border: '1px solid var(--cx-border)' }}>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--cx-text-muted)' }}>{item.label}</p>
                <p className="text-sm font-bold font-sans" style={{ color: item.accent ? 'var(--cx-accent)' : 'var(--cx-text-secondary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4 mb-8">
            <h4 className="text-[10px] uppercase tracking-widest font-bold pb-2 flex items-center gap-2" style={{ color: 'var(--cx-text-muted)', borderBottom: '1px solid var(--cx-border)' }}><Target size={12} /> Briefing de mission</h4>
            <p className="text-sm leading-relaxed font-sans" style={{ color: 'var(--cx-text-secondary)' }}>{session.briefing}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onLaunch}
              disabled={isLocked}
              className="flex-1 h-12 flex items-center justify-center gap-2 font-sans text-xs font-bold tracking-widest rounded-xl transition-all active:scale-95"
              style={{
                background: isLocked ? 'var(--cx-surface-hover)' : 'var(--cx-accent)',
                color: isLocked ? 'var(--cx-text-muted)' : '#fff',
                cursor: isLocked ? 'not-allowed' : 'pointer',
              }}
            >
              {isLocked ? 'ACCÈS REFUSÉ' : session.status === 'COMPLETED' ? 'REVOIR LA SESSION' : 'LANCER LA SESSION'}
              {!isLocked && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// SVG connector between cards
const Connector = ({ direction, status }: { direction: 'horizontal' | 'vertical', status: 'completed' | 'active' | 'locked' }) => {
  const color = status === 'completed' ? 'var(--cx-green)' : status === 'active' ? 'var(--cx-accent)' : 'var(--cx-border)';
  const isAnimated = status !== 'locked';

  if (direction === 'horizontal') {
    return (
      <div className="hidden md:flex absolute top-1/2 -right-10 w-10 items-center pointer-events-none">
        <svg width="40" height="4" className="overflow-visible">
          <line x1="0" y1="2" x2="40" y2="2"
            stroke={color} strokeWidth="2"
            className={isAnimated ? 'connector-line' : ''}
            strokeDasharray={status === 'locked' ? '4 4' : undefined}
          />
          {status === 'active' && (
            <circle r="3" fill={color} opacity="0.8">
              <animateMotion dur="2s" repeatCount="indefinite" path="M0,2 L40,2" />
            </circle>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div className="hidden md:flex absolute -bottom-20 left-1/2 -translate-x-px h-20 items-center pointer-events-none">
      <svg width="4" height="80" className="overflow-visible">
        <line x1="2" y1="0" x2="2" y2="80"
          stroke={color} strokeWidth="2"
          className={isAnimated ? 'connector-line' : ''}
          strokeDasharray={status === 'locked' ? '4 4' : undefined}
        />
        {status === 'active' && (
          <circle r="3" fill={color} opacity="0.8">
            <animateMotion dur="2s" repeatCount="indefinite" path="M2,0 L2,80" />
          </circle>
        )}
      </svg>
    </div>
  );
};

function getConnectorStatus(fromStatus: SessionStatus, toStatus: SessionStatus): 'completed' | 'active' | 'locked' {
  if (fromStatus === 'COMPLETED' && toStatus === 'COMPLETED') return 'completed';
  if (fromStatus === 'COMPLETED' || fromStatus === 'CURRENT') return 'active';
  return 'locked';
}

export default function DashVibe5() {
  const router = useRouter();
  const { sessions: apiSessions, loading: sessionsLoading, newlyUnlocked, dismissUnlocked } = useSessions();
  const { data: progressData, loading: progressLoading } = useProgress();
  const { dark, toggle: toggleTheme } = useTheme();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileQuestOpen, setMobileQuestOpen] = useState(false);

  const loading = sessionsLoading || progressLoading;

  // Map API sessions to component format
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

  const weeks = [...new Set(sessions.map(s => s.week))].sort((a, b) => a - b).map(w => ({
    number: w,
    title: sessions.find(s => s.week === w)?.weekTitle || '',
    sessions: sessions.filter(s => s.week === w),
  }));

  // User data from progress API
  const userProfile = progressData?.user;
  const stats = progressData?.stats;
  const isAdmin = userProfile?.role === 'ADMIN';

  const levelKey = userProfile?.level || 'OPERATEUR';
  const levelLabel = LEVEL_LABELS[levelKey] || levelKey;
  const levelNumber = LEVEL_NUMBERS[levelKey] || 1;
  const xp = userProfile?.xp || 0;
  const maxXp = 1200;
  const xpPercent = `${Math.min((xp / maxXp) * 100, 100)}%`;

  const completedCount = stats?.completedSessions || 0;
  const totalCount = stats?.totalSessions || sessions.length || 12;

  // Find current session for quest log
  const currentSession = sessions.find(s => s.status === 'CURRENT');

  // Current session objectives from API
  const currentApiSession = apiSessions.find(s => mapStatus(s.userStatus) === 'CURRENT');
  const objectives: string[] = (currentApiSession?.objectives as string[]) || [];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  function handleLaunchSession(session: Session) {
    if (session.status !== 'LOCKED') {
      router.push(`/formation/${session.id}`);
    }
  }

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
    <div className="min-h-screen font-sans selection:bg-[#F97316]/10" style={{ background: 'var(--cx-bg)', color: 'var(--cx-text)' }}>
      {/* Toast for newly unlocked sessions */}
      <Toast
        message={newlyUnlocked ? `Nouvelle session disponible : ${newlyUnlocked}` : ''}
        visible={!!newlyUnlocked}
        onClose={dismissUnlocked}
      />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b-2" style={{ background: dark ? 'rgba(12,10,9,0.8)' : 'rgba(255,255,255,0.8)', borderColor: 'var(--cx-border)' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-16 sm:h-24 flex items-center justify-between">
          {/* Left: Avatar + Level */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#F97316]/10 border-2 border-[#F97316]/20 overflow-hidden flex items-center justify-center">
                <User size={20} className="text-[#F97316] sm:hidden" />
                <User size={28} className="text-[#F97316] hidden sm:block" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-sm sm:text-xl font-bold tracking-tight">{levelLabel}</h1>
                <BadgeTag label={`LVL ${levelNumber}`} variant="active" />
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                <div className="w-28 sm:w-56 h-2 sm:h-3 bg-[#F97316]/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: xpPercent }} className="h-full bg-[#F97316] rounded-full" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">{xp}/{maxXp}</span>
              </div>
            </div>
          </div>

          {/* Right: Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: 'var(--cx-text-muted)' }}>Inventaire</p>
              <div className="flex gap-2">
                {[Terminal, Cpu, Workflow].map((Icon, i) => (
                  <div key={i} className="p-2 rounded-lg" style={{ background: 'var(--cx-surface-hover)', border: '1px solid var(--cx-border)' }}><Icon size={18} style={{ color: 'var(--cx-accent)' }} /></div>
                ))}
              </div>
            </div>
            <div className="h-12 w-px" style={{ background: 'var(--cx-border)' }} />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--cx-text-muted)' }}>Secteur Actif</p>
              <p className="text-sm font-bold mt-1 underline decoration-2" style={{ color: 'var(--cx-text)', textDecorationColor: 'var(--cx-accent-border)' }}>
                {currentSession ? `${currentSession.weekTitle.split(' ').slice(0, 2).join('_')}.0${currentSession.week}` : 'TERMINÉ'}
              </p>
            </div>
            {isAdmin && (
              <>
                <div className="h-12 w-px bg-slate-200" />
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F97316]/5 border border-[#F97316]/20 rounded-lg text-[#F97316] text-xs font-bold uppercase tracking-wider hover:bg-[#F97316]/10 transition-colors"
                >
                  <Shield size={16} />
                  Admin
                </button>
              </>
            )}
            <div className="h-12 w-px" style={{ background: 'var(--cx-border)' }} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--cx-text-muted)' }}
              title={dark ? 'Mode clair' : 'Mode sombre'}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-lg transition-colors"
              style={{ color: 'var(--cx-text-muted)' }}
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Right: Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:opacity-70"
            style={{ color: 'var(--cx-text-secondary)' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--cx-border)', background: 'var(--cx-surface)' }}
            >
              <div className="px-4 py-3 space-y-1">
                <button
                  onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors hover:opacity-80"
                  style={{ color: 'var(--cx-text-secondary)' }}
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                  {dark ? 'Mode clair' : 'Mode sombre'}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { router.push('/admin'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors hover:opacity-80"
                    style={{ color: 'var(--cx-accent)' }}
                  >
                    <Shield size={18} />
                    Administration
                  </button>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors hover:text-red-500"
                  style={{ color: 'var(--cx-text-secondary)' }}
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ MOBILE: Quest Log + Stats (collapsible) ═══ */}
      <div className="lg:hidden border-b-2" style={{ background: 'var(--cx-bg-alt)', borderColor: 'var(--cx-border)' }}>
        <button
          onClick={() => setMobileQuestOpen(!mobileQuestOpen)}
          className="w-full px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Target size={14} style={{ color: 'var(--cx-accent)' }} />
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--cx-text-secondary)' }}>
              {currentSession ? `Mission: ${currentSession.number}` : 'Parcours terminé'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold" style={{ color: 'var(--cx-text-muted)' }}>{completedCount}/{totalCount}</span>
            <motion.div animate={{ rotate: mobileQuestOpen ? 180 : 0 }}>
              <ChevronDown size={16} style={{ color: 'var(--cx-text-muted)' }} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {mobileQuestOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl" style={{ background: 'var(--cx-surface)', border: '2px solid var(--cx-border)' }}>
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--cx-text-muted)' }}>Sessions</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--cx-text)' }}>{completedCount} / {totalCount}</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'var(--cx-surface)', border: '2px solid var(--cx-border)' }}>
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--cx-text-muted)' }}>Points</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--cx-accent)' }}>{xp} XP</p>
                  </div>
                </div>

                {currentSession && (
                  <div className="rounded-xl p-4" style={{ background: 'var(--cx-surface)', border: '2px solid var(--cx-accent-border)' }}>
                    <p className="text-[10px] font-bold mb-2 uppercase" style={{ color: 'var(--cx-accent)' }}>Objectif Actuel</p>
                    <p className="text-sm leading-relaxed font-bold" style={{ color: 'var(--cx-text-secondary)' }}>
                      {currentSession.briefing}
                    </p>
                    {objectives.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {objectives.map((obj, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0" style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border-strong)' }} />
                            <span className="text-xs" style={{ color: 'var(--cx-text-secondary)' }}>{obj}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="max-w-[1600px] mx-auto flex min-h-[calc(100vh-6rem)]">
        {/* Desktop sidebar */}
        <aside className="w-96 border-r-2 p-8 hidden lg:block overflow-y-auto" style={{ background: 'var(--cx-sidebar)', borderColor: 'var(--cx-border)' }}>
          <div className="space-y-10">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--cx-text-muted)' }}><Target size={16} style={{ color: 'var(--cx-accent)' }} /> LOG DE QUÊTE</h2>
              <div className="rounded-xl p-6 shadow-sm" style={{ background: 'var(--cx-surface)', border: '2px solid var(--cx-accent-border)' }}>
                <p className="text-xs font-bold mb-3 uppercase" style={{ color: 'var(--cx-accent)' }}>Objectif Actuel</p>
                <p className="text-base leading-relaxed font-bold" style={{ color: 'var(--cx-text-secondary)' }}>
                  {currentSession
                    ? currentSession.briefing
                    : 'Toutes les sessions sont terminées. Félicitations !'}
                </p>
                {objectives.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded border-2 flex items-center justify-center" style={{ background: 'var(--cx-surface)', borderColor: 'var(--cx-border-strong)' }}>
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--cx-text-secondary)' }}>{obj}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--cx-text-muted)' }}><Trophy size={16} /> STATISTIQUES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl" style={{ background: 'var(--cx-surface)', border: '2px solid var(--cx-border)' }}>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--cx-text-muted)' }}>Sessions</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--cx-text)' }}>{completedCount} / {totalCount}</p>
                </div>
                <div className="p-5 rounded-xl" style={{ background: 'var(--cx-surface)', border: '2px solid var(--cx-border)' }}>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--cx-text-muted)' }}>Points</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--cx-accent)' }}>{xp}</p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="p-5 rounded-2xl text-white relative overflow-hidden group" style={{ background: dark ? '#1c1917' : '#0c0a09', border: dark ? '1px solid var(--cx-border-strong)' : 'none' }}>
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><Zap size={64} fill="white" /></div>
                <h3 className="text-xs font-bold mb-2">MODE AGENT CLI</h3>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--cx-text-muted)' }}>Utilisez `claude config --mode pro` pour activer les capacités d&apos;auto-correct avancées.</p>
                <button className="mt-4 text-[10px] font-bold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--cx-accent)' }}>ACTIVER <ArrowRight size={12} /></button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--cx-text)' }}>VOTRE PARCOURS</h2>
              <p className="text-sm sm:text-base mt-2 sm:mt-3" style={{ color: 'var(--cx-text-secondary)' }}>Traversez les secteurs pour maîtriser l&apos;architecture des agents.</p>
            </header>
            <div className="space-y-12 sm:space-y-20">
              {weeks.map((week, weekIdx) => (
                <div key={week.number} className="relative">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg" style={{ background: 'var(--cx-accent-bg)', color: 'var(--cx-accent)' }}>{week.number}</div>
                    <h3 className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold" style={{ color: 'var(--cx-text-muted)' }}>SECTEUR {week.number} : {week.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-10 relative z-10">
                    {week.sessions.map((session, sessionIdx) => (
                      <div key={session.id} className="relative">
                        <RoomCard session={session} onClick={() => setSelectedSession(session)} />
                        {sessionIdx < week.sessions.length - 1 && (
                          <Connector
                            direction="horizontal"
                            status={getConnectorStatus(session.status, week.sessions[sessionIdx + 1].status)}
                          />
                        )}
                        {sessionIdx === 0 && weekIdx < weeks.length - 1 && (
                          <Connector
                            direction="vertical"
                            status={getConnectorStatus(
                              week.sessions[week.sessions.length - 1].status,
                              weeks[weekIdx + 1].sessions[0]?.status || 'LOCKED'
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 -z-10 [background-size:24px_24px] opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--cx-border-strong) 1px, transparent 1px)` }} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

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
