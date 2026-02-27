import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const XP_PER_SESSION = 100
const LEVEL_THRESHOLDS = {
  OPERATEUR: 0,
  CONNECTEUR: 300,
  ARCHITECTE: 600,
  SENTINELLE: 900,
} as const

function calculateLevel(xp: number): string {
  if (xp >= LEVEL_THRESHOLDS.SENTINELLE) return 'SENTINELLE'
  if (xp >= LEVEL_THRESHOLDS.ARCHITECTE) return 'ARCHITECTE'
  if (xp >= LEVEL_THRESHOLDS.CONNECTEUR) return 'CONNECTEUR'
  return 'OPERATEUR'
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Get current progress
    const { data: progress } = await admin
      .from('user_progress')
      .select('*, session:sessions(*)')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .single()

    if (!progress) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    if (progress.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Session déjà complétée' }, { status: 400 })
    }

    if (progress.status === 'LOCKED') {
      return NextResponse.json({ error: 'Session verrouillée' }, { status: 403 })
    }

    // Mark as completed
    await admin.from('user_progress').update({
      status: 'COMPLETED',
      xp_earned: XP_PER_SESSION,
      completed_at: new Date().toISOString(),
    }).eq('id', progress.id)

    // Update user XP and level
    const { data: dbUser } = await admin
      .from('users')
      .select('xp')
      .eq('id', user.id)
      .single()

    const newXp = (dbUser?.xp ?? 0) + XP_PER_SESSION
    const newLevel = calculateLevel(newXp)

    await admin.from('users').update({
      xp: newXp,
      level: newLevel,
    }).eq('id', user.id)

    // Unlock next session — only if user's pool has it unlocked
    const nextSessionNumber = progress.session.session_number + 1
    const { data: nextSession } = await admin
      .from('sessions')
      .select('id')
      .eq('session_number', nextSessionNumber)
      .eq('is_published', true)
      .single()

    if (nextSession) {
      // Check if user belongs to a pool
      const { data: userRecord } = await admin
        .from('users')
        .select('pool_id')
        .eq('id', user.id)
        .single()

      let canUnlock = true

      if (userRecord?.pool_id) {
        // User is in a pool — check if the pool has this session unlocked
        const { data: poolSession } = await admin
          .from('pool_sessions')
          .select('is_unlocked')
          .eq('pool_id', userRecord.pool_id)
          .eq('session_id', nextSession.id)
          .single()

        canUnlock = poolSession?.is_unlocked ?? false
      }

      if (canUnlock) {
        await admin.from('user_progress').update({
          status: 'AVAILABLE',
        })
          .eq('user_id', user.id)
          .eq('session_id', nextSession.id)
          .eq('status', 'LOCKED')
      }
    }

    return NextResponse.json({ success: true, xpEarned: XP_PER_SESSION })
  } catch (error) {
    console.error('Complete session error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
