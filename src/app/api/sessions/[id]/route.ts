import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: session } = await admin
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    const { data: progress } = await admin
      .from('user_progress')
      .select('status, xp_earned, completed_at')
      .eq('user_id', user.id)
      .eq('session_id', id)
      .single()

    return NextResponse.json({
      session: {
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
        userStatus: progress?.status ?? 'LOCKED',
        xpEarned: progress?.xp_earned ?? 0,
        completedAt: progress?.completed_at ?? null,
      }
    })
  } catch (error) {
    console.error('Session detail error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
