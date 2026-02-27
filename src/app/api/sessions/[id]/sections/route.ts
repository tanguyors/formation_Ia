import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
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

    const { data: sections } = await admin
      .from('session_sections')
      .select('id, title, type, content, code_language, sort_order')
      .eq('session_id', sessionId)
      .order('sort_order', { ascending: true })

    return NextResponse.json({
      sections: (sections ?? []).map((s: Record<string, unknown>) => ({
        id: s.id,
        title: s.title,
        type: s.type,
        content: s.content,
        codeLanguage: s.code_language,
        sortOrder: s.sort_order,
      })),
    })
  } catch (error) {
    console.error('Sections error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
