import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

function generateInviteCode(): string {
  return nanoid(8).toUpperCase()
}

// GET - List all invitations (admin only)
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

    const { data: invitations } = await admin
      .from('invitations')
      .select('*, created_by:users!created_by_id(email, display_name)')
      .order('created_at', { ascending: false })

    return NextResponse.json({ invitations: invitations ?? [] })
  } catch (error) {
    console.error('List invitations error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST - Create a new invitation (admin only)
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

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Check if invitation already exists
    const { data: existing } = await admin
      .from('invitations')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Une invitation existe déjà pour cet email' },
        { status: 400 }
      )
    }

    const { data: invitation, error: insertError } = await admin
      .from('invitations')
      .insert({
        email,
        code: generateInviteCode(),
        created_by_id: user.id,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ invitation })
  } catch (error) {
    console.error('Create invitation error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
