import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - Pool detail with sessions status and members
export async function GET(
  _request: Request,
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

    // Get pool
    const { data: pool } = await admin
      .from('pools')
      .select('*')
      .eq('id', poolId)
      .single()

    if (!pool) {
      return NextResponse.json({ error: 'Pool non trouvée' }, { status: 404 })
    }

    // Get sessions with unlock status for this pool
    const { data: sessions } = await admin
      .from('sessions')
      .select('id, session_number, title, week, day')
      .eq('is_published', true)
      .order('session_number', { ascending: true })

    const { data: poolSessions } = await admin
      .from('pool_sessions')
      .select('session_id, is_unlocked')
      .eq('pool_id', poolId)

    const unlockedMap = new Map(
      (poolSessions ?? []).map((ps: { session_id: string; is_unlocked: boolean }) => [ps.session_id, ps.is_unlocked])
    )

    const sessionsWithStatus = (sessions ?? []).map((s: Record<string, unknown>) => ({
      id: s.id,
      sessionNumber: s.session_number,
      title: s.title,
      week: s.week,
      day: s.day,
      isUnlocked: unlockedMap.get(s.id as string) ?? false,
    }))

    // Get pool members
    const { data: members } = await admin
      .from('users')
      .select('id, email, display_name, level, xp')
      .eq('pool_id', poolId)
      .order('display_name', { ascending: true })

    // Get unassigned students (no pool)
    const { data: unassigned } = await admin
      .from('users')
      .select('id, email, display_name')
      .is('pool_id', null)
      .neq('role', 'ADMIN')
      .order('display_name', { ascending: true })

    return NextResponse.json({
      pool: {
        id: pool.id,
        name: pool.name,
        createdAt: pool.created_at,
      },
      sessions: sessionsWithStatus,
      members: (members ?? []).map((m: Record<string, unknown>) => ({
        id: m.id,
        email: m.email,
        displayName: m.display_name,
        level: m.level,
        xp: m.xp,
      })),
      unassigned: (unassigned ?? []).map((m: Record<string, unknown>) => ({
        id: m.id,
        email: m.email,
        displayName: m.display_name,
      })),
    })
  } catch (error) {
    console.error('Pool detail error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE - Delete a pool
export async function DELETE(
  _request: Request,
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

    // Unassign users from this pool first
    await admin
      .from('users')
      .update({ pool_id: null })
      .eq('pool_id', poolId)

    // Delete pool (pool_sessions cascade-deleted)
    const { error: deleteError } = await admin
      .from('pools')
      .delete()
      .eq('id', poolId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete pool error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
