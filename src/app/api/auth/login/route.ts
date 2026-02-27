import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Get user role to redirect admin properly
    let role = 'STUDENT'
    if (authData.user) {
      const admin = createAdminClient()
      const { data: dbUser } = await admin
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single()
      if (dbUser) role = dbUser.role
    }

    return NextResponse.json({ success: true, role })
  } catch (error) {
    console.error('Login error:', error)
    const message = error instanceof Error ? error.message : 'Erreur interne du serveur'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
