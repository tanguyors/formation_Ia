import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Get session info
    const { data: session } = await admin
      .from('sessions')
      .select('id, title, week, day, session_number')
      .eq('id', sessionId)
      .single()

    // Get exercise sections only
    const { data: sections } = await admin
      .from('session_sections')
      .select('id, title, type, content, sort_order')
      .eq('session_id', sessionId)
      .eq('type', 'exercise')
      .order('sort_order', { ascending: true })

    // Parse JSON content for each exercise
    const exercises = (sections ?? []).map((s: Record<string, unknown>, index: number) => {
      let parsed = { briefing: '', commands: [] as string[], difficulty: 'Débutant', duration: '10 min', criteria: [] as string[] }
      try {
        parsed = JSON.parse(s.content as string)
      } catch {
        parsed.briefing = s.content as string
      }
      return {
        id: s.id as string,
        title: s.title as string,
        sortOrder: s.sort_order as number,
        missionNumber: index + 1,
        ...parsed,
      }
    })

    const dayLabels: Record<number, string> = { 1: 'Lundi', 2: 'Mercredi', 3: 'Vendredi' }

    return NextResponse.json({
      session: session ? {
        id: session.id,
        title: session.title,
        week: session.week,
        day: session.day,
        dayLabel: dayLabels[session.day as number] || `Jour ${session.day}`,
        sessionNumber: session.session_number,
      } : null,
      exercises,
      hasExercises: (exercises?.length ?? 0) > 0,
    })
  } catch (error) {
    console.error('Practice error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
