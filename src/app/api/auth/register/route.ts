import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, inviteCode } = await request.json()

    if (!email || !password || !inviteCode) {
      return NextResponse.json(
        { error: 'Email, mot de passe et code d\'invitation requis' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // Verify invite code
    const { data: invitation } = await admin
      .from('invitations')
      .select('*')
      .eq('code', inviteCode)
      .single()

    if (!invitation) {
      return NextResponse.json(
        { error: 'Code d\'invitation invalide' },
        { status: 400 }
      )
    }

    if (invitation.used) {
      return NextResponse.json(
        { error: 'Ce code d\'invitation a déjà été utilisé' },
        { status: 400 }
      )
    }

    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Ce code d\'invitation a expiré' },
        { status: 400 }
      )
    }

    if (invitation.email !== email) {
      return NextResponse.json(
        { error: 'Ce code d\'invitation n\'est pas associé à cet email' },
        { status: 400 }
      )
    }

    // Create user in Supabase Auth
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (authData.user) {
      // Create user profile
      await admin.from('users').insert({
        id: authData.user.id,
        email,
        display_name: email.split('@')[0],
      })

      // Mark invitation as used
      await admin.from('invitations').update({
        used: true,
        used_at: new Date().toISOString(),
      }).eq('id', invitation.id)

      // Initialize progress for all published sessions
      const { data: sessions } = await admin
        .from('sessions')
        .select('id, session_number')
        .eq('is_published', true)
        .order('session_number', { ascending: true })

      if (sessions && sessions.length > 0) {
        await admin.from('user_progress').insert(
          sessions.map((session: { id: string; session_number: number }, index: number) => ({
            user_id: authData.user!.id,
            session_id: session.id,
            status: index === 0 ? 'AVAILABLE' : 'LOCKED',
          }))
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
