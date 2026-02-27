import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - List all pools with member count and session stats
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

    // Get all pools
    const { data: pools } = await admin
      .from('pools')
      .select('*')
      .order('created_at', { ascending: false })

    // Get member counts per pool
    const { data: users } = await admin
      .from('users')
      .select('pool_id')
      .not('pool_id', 'is', null)

    // Get unlocked session counts per pool
    const { data: poolSessions } = await admin
      .from('pool_sessions')
      .select('pool_id, is_unlocked')

    const memberCounts = new Map<string, number>()
    for (const u of users ?? []) {
      memberCounts.set(u.pool_id, (memberCounts.get(u.pool_id) ?? 0) + 1)
    }

    const unlockedCounts = new Map<string, number>()
    for (const ps of poolSessions ?? []) {
      if (ps.is_unlocked) {
        unlockedCounts.set(ps.pool_id, (unlockedCounts.get(ps.pool_id) ?? 0) + 1)
      }
    }

    // Get total session count
    const { count: totalSessions } = await admin
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)

    const poolsWithStats = (pools ?? []).map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.name,
      createdAt: p.created_at,
      memberCount: memberCounts.get(p.id as string) ?? 0,
      unlockedSessions: unlockedCounts.get(p.id as string) ?? 0,
      totalSessions: totalSessions ?? 0,
    }))

    return NextResponse.json({ pools: poolsWithStats })
  } catch (error) {
    console.error('List pools error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST - Create a new pool
export async function POST(request: Request) {
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

    const { name } = await request.json()
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nom de pool requis' }, { status: 400 })
    }

    // Create pool
    const { data: pool, error: insertError } = await admin
      .from('pools')
      .insert({ name: name.trim() })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Initialize pool_sessions for all published sessions (all locked by default)
    const { data: sessions } = await admin
      .from('sessions')
      .select('id')
      .eq('is_published', true)

    if (sessions && sessions.length > 0) {
      const records = sessions.map((s: { id: string }) => ({
        pool_id: pool.id,
        session_id: s.id,
        is_unlocked: false,
      }))
      await admin.from('pool_sessions').insert(records)
    }

    return NextResponse.json({
      pool: {
        id: pool.id,
        name: pool.name,
        createdAt: pool.created_at,
        memberCount: 0,
        unlockedSessions: 0,
        totalSessions: sessions?.length ?? 0,
      },
    })
  } catch (error) {
    console.error('Create pool error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
