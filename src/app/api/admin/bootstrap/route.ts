import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// POST /api/admin/bootstrap
// Creates the first admin account. Only works when no admin exists yet.
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()

    // Check if any admin already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'ADMIN')
      .limit(1)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Un compte admin existe déjà' },
        { status: 403 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Create admin in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (authData.user) {
      // Create admin profile in DB
      const { error: insertError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        display_name: 'Admin',
        role: 'ADMIN',
      })

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Compte admin créé avec succès' })
  } catch (error) {
    console.error('Bootstrap error:', error)
    const message = error instanceof Error ? error.message : 'Erreur interne du serveur'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
