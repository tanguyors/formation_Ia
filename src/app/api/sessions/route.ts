import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Get all published sessions
    const { data: sessions } = await admin
      .from('sessions')
      .select('*')
      .eq('is_published', true)
      .order('session_number', { ascending: true })

    // Get user's progress
    let { data: progress } = await admin
      .from('user_progress')
      .select('session_id, status, xp_earned, completed_at')
      .eq('user_id', user.id)

    // Auto-initialize progress if none exists
    if ((!progress || progress.length === 0) && sessions && sessions.length > 0) {
      const records = sessions.map((s: Record<string, unknown>) => ({
        user_id: user.id,
        session_id: s.id,
        status: (s.session_number as number) === 1 ? 'AVAILABLE' : 'LOCKED',
        xp_earned: 0,
      }))
      await admin.from('user_progress').upsert(records, { onConflict: 'user_id,session_id', ignoreDuplicates: true })
      const { data: freshProgress } = await admin
        .from('user_progress')
        .select('session_id, status, xp_earned, completed_at')
        .eq('user_id', user.id)
      progress = freshProgress
    }

    const progressMap = new Map(
      (progress ?? []).map((p: { session_id: string; status: string; xp_earned: number; completed_at: string | null }) => [p.session_id, p])
    )

    const sessionsWithProgress = (sessions ?? []).map((session: Record<string, unknown>) => {
      const p = progressMap.get(session.id as string) as { status: string; xp_earned: number; completed_at: string | null } | undefined
      return {
        id: session.id,
        week: session.week,
        day: session.day,
        sessionNumber: session.session_number,
        title: session.title,
        description: session.description,
        briefing: session.briefing,
        objectives: session.objectives,
        date: session.date,
        durationMinutes: session.duration_minutes,
        videoUrl: session.video_url,
        isPublished: session.is_published,
        userStatus: p?.status ?? 'LOCKED',
        xpEarned: p?.xp_earned ?? 0,
        completedAt: p?.completed_at ?? null,
      }
    })

    return NextResponse.json({ sessions: sessionsWithProgress })
  } catch (error) {
    console.error('Sessions error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
