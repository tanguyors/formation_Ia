import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - List all sessions with progress stats (admin only)
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: dbUser } = await admin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 })
    }

    // Get all sessions (published or not)
    const { data: sessions } = await admin
      .from('sessions')
      .select('*')
      .order('session_number', { ascending: true })

    // Get all user_progress grouped by session
    const { data: allProgress } = await admin
      .from('user_progress')
      .select('session_id, status')

    // Build stats per session
    const progressBySession = new Map<string, { locked: number; available: number; inProgress: number; completed: number }>()
    for (const p of allProgress ?? []) {
      const stats = progressBySession.get(p.session_id) ?? { locked: 0, available: 0, inProgress: 0, completed: 0 }
      if (p.status === 'LOCKED') stats.locked++
      else if (p.status === 'AVAILABLE') stats.available++
      else if (p.status === 'IN_PROGRESS') stats.inProgress++
      else if (p.status === 'COMPLETED') stats.completed++
      progressBySession.set(p.session_id, stats)
    }

    const sessionsWithStats = (sessions ?? []).map((s: Record<string, unknown>) => {
      const stats = progressBySession.get(s.id as string) ?? { locked: 0, available: 0, inProgress: 0, completed: 0 }
      return {
        id: s.id,
        sessionNumber: s.session_number,
        title: s.title,
        week: s.week,
        day: s.day,
        isPublished: s.is_published,
        stats,
      }
    })

    return NextResponse.json({ sessions: sessionsWithStats })
  } catch (error) {
    console.error('Admin sessions error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
