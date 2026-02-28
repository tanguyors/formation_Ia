"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PracticeVibeTerminal, { type PracticeExercise, type PracticeSessionInfo } from '@/components/vibes/PracticeVibeTerminal';

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [session, setSession] = useState<PracticeSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/sessions/${id}/practice`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.hasExercises) {
          setExercises(data.exercises);
          setSession(data.session);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#F97316] animate-spin" />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Aucun exercice pratique pour ce module.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#F97316] text-white rounded-full font-bold text-sm hover:bg-[#ea580c] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <PracticeVibeTerminal
      exercises={exercises}
      session={session || undefined}
      onBack={() => router.push(`/formation/${id}`)}
    />
  );
}
