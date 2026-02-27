import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// PATCH - Toggle session lock/unlock for a pool
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const { id: poolId, sessionId } = await params
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

    const { unlock } = await request.json()

    // Upsert pool_sessions record
    const { error: upsertError } = await admin
      .from('pool_sessions')
      .upsert(
        {
          pool_id: poolId,
          session_id: sessionId,
          is_unlocked: !!unlock,
          unlocked_at: unlock ? new Date().toISOString() : null,
        },
        { onConflict: 'pool_id,session_id' }
      )

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    // Sync user_progress for all pool members
    const { data: poolMembers } = await admin
      .from('users')
      .select('id')
      .eq('pool_id', poolId)

    if (poolMembers && poolMembers.length > 0) {
      const memberIds = poolMembers.map((m: { id: string }) => m.id)

      if (unlock) {
        // Unlock: set LOCKED → AVAILABLE for pool members on this session
        await admin
          .from('user_progress')
          .update({ status: 'AVAILABLE' })
          .eq('session_id', sessionId)
          .eq('status', 'LOCKED')
          .in('user_id', memberIds)
      } else {
        // Lock: set AVAILABLE/IN_PROGRESS → LOCKED for pool members (don't touch COMPLETED)
        await admin
          .from('user_progress')
          .update({ status: 'LOCKED' })
          .eq('session_id', sessionId)
          .in('status', ['AVAILABLE', 'IN_PROGRESS'])
          .in('user_id', memberIds)
      }
    }

    return NextResponse.json({ success: true, isUnlocked: !!unlock })
  } catch (error) {
    console.error('Toggle pool session error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
