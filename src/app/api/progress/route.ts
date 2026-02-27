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

    // Get user profile
    const { data: dbUser } = await admin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!dbUser) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    // Get progress with session info
    let { data: progress } = await admin
      .from('user_progress')
      .select('*, session:sessions(*)')
      .eq('user_id', user.id)
      .order('session(session_number)', { ascending: true })

    // Auto-initialize progress if none exists (e.g. admin created via bootstrap)
    if (!progress || progress.length === 0) {
      const { data: sessions } = await admin
        .from('sessions')
        .select('id, session_number')
        .eq('is_published', true)
        .order('session_number', { ascending: true })

      if (sessions && sessions.length > 0) {
        const progressRecords = sessions.map((s: { id: string; session_number: number }) => ({
          user_id: user.id,
          session_id: s.id,
          status: s.session_number === 1 ? 'AVAILABLE' : 'LOCKED',
          xp_earned: 0,
        }))

        await admin.from('user_progress').insert(progressRecords)

        // Re-fetch with session info
        const { data: freshProgress } = await admin
          .from('user_progress')
          .select('*, session:sessions(*)')
          .eq('user_id', user.id)
          .order('session(session_number)', { ascending: true })

        progress = freshProgress
      }
    }

    // Get badges
    const { data: userBadges } = await admin
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })

    const progressList = progress ?? []
    const totalSessions = progressList.length
    const completedSessions = progressList.filter((p: { status: string }) => p.status === 'COMPLETED').length

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        displayName: dbUser.display_name,
        avatarUrl: dbUser.avatar_url,
        role: dbUser.role,
        level: dbUser.level,
        xp: dbUser.xp,
      },
      stats: {
        totalSessions,
        completedSessions,
        progressPercent: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
        totalXp: dbUser.xp,
      },
      badges: (userBadges ?? []).map((ub: { badge: Record<string, unknown>; earned_at: string }) => ({
        ...ub.badge,
        earnedAt: ub.earned_at,
      })),
      progress: progressList.map((p: { session_id: string; session: { session_number: number; title: string; week: number }; status: string; xp_earned: number; completed_at: string | null }) => ({
        sessionId: p.session_id,
        sessionNumber: p.session.session_number,
        sessionTitle: p.session.title,
        week: p.session.week,
        status: p.status,
        xpEarned: p.xp_earned,
        completedAt: p.completed_at,
      })),
    })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
