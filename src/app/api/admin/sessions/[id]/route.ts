import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// PATCH - Lock or unlock a session for all users (admin only)
export async function PATCH(
  request: Request,
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

    const { data: dbUser } = await admin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 })
    }

    const { action } = await request.json()

    if (action !== 'lock' && action !== 'unlock') {
      return NextResponse.json({ error: 'Action invalide (lock ou unlock)' }, { status: 400 })
    }

    // Verify session exists
    const { data: session } = await admin
      .from('sessions')
      .select('id, session_number, title')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    if (action === 'unlock') {
      // Unlock: set LOCKED → AVAILABLE for this session (don't touch COMPLETED or IN_PROGRESS)
      const { error: updateError } = await admin
        .from('user_progress')
        .update({ status: 'AVAILABLE' })
        .eq('session_id', sessionId)
        .eq('status', 'LOCKED')

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    } else {
      // Lock: set AVAILABLE or IN_PROGRESS → LOCKED (don't touch COMPLETED)
      const { error: updateError } = await admin
        .from('user_progress')
        .update({ status: 'LOCKED' })
        .eq('session_id', sessionId)
        .in('status', ['AVAILABLE', 'IN_PROGRESS'])

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // Return updated stats for this session
    const { data: progress } = await admin
      .from('user_progress')
      .select('status')
      .eq('session_id', sessionId)

    const stats = { locked: 0, available: 0, inProgress: 0, completed: 0 }
    for (const p of progress ?? []) {
      if (p.status === 'LOCKED') stats.locked++
      else if (p.status === 'AVAILABLE') stats.available++
      else if (p.status === 'IN_PROGRESS') stats.inProgress++
      else if (p.status === 'COMPLETED') stats.completed++
    }

    return NextResponse.json({
      success: true,
      action,
      session: { id: session.id, sessionNumber: session.session_number, title: session.title },
      stats,
    })
  } catch (error) {
    console.error('Admin toggle session error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
