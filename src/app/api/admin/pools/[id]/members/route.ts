import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// POST - Add a member to a pool
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poolId } = await params
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

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    // Assign user to pool
    const { error: updateError } = await admin
      .from('users')
      .update({ pool_id: poolId })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Sync user_progress based on pool's unlocked sessions
    const { data: poolSessions } = await admin
      .from('pool_sessions')
      .select('session_id, is_unlocked')
      .eq('pool_id', poolId)

    // Ensure user has progress records for all sessions
    const { data: sessions } = await admin
      .from('sessions')
      .select('id, session_number')
      .eq('is_published', true)

    if (sessions && sessions.length > 0) {
      // Check existing progress
      const { data: existingProgress } = await admin
        .from('user_progress')
        .select('session_id, status')
        .eq('user_id', userId)

      const existingMap = new Map(
        (existingProgress ?? []).map((p: { session_id: string; status: string }) => [p.session_id, p.status])
      )

      const unlockedSet = new Set(
        (poolSessions ?? [])
          .filter((ps: { is_unlocked: boolean }) => ps.is_unlocked)
          .map((ps: { session_id: string }) => ps.session_id)
      )

      // Create missing progress records
      const missingRecords = sessions
        .filter((s: { id: string }) => !existingMap.has(s.id))
        .map((s: { id: string }) => ({
          user_id: userId,
          session_id: s.id,
          status: unlockedSet.has(s.id) ? 'AVAILABLE' : 'LOCKED',
          xp_earned: 0,
        }))

      if (missingRecords.length > 0) {
        await admin.from('user_progress').insert(missingRecords)
      }

      // Update existing non-COMPLETED progress to match pool settings
      for (const [sessionId, status] of existingMap) {
        if (status === 'COMPLETED') continue

        const shouldBeUnlocked = unlockedSet.has(sessionId)
        const newStatus = shouldBeUnlocked ? 'AVAILABLE' : 'LOCKED'

        if (status !== newStatus) {
          await admin
            .from('user_progress')
            .update({ status: newStatus })
            .eq('user_id', userId)
            .eq('session_id', sessionId)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add pool member error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE - Remove a member from a pool
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poolId } = await params
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

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    // Remove user from pool
    const { error: updateError } = await admin
      .from('users')
      .update({ pool_id: null })
      .eq('id', userId)
      .eq('pool_id', poolId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove pool member error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
