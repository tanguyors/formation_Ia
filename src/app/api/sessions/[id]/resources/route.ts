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

    const { data: resources } = await admin
      .from('session_resources')
      .select('id, title, url, type, sort_order')
      .eq('session_id', sessionId)
      .order('sort_order', { ascending: true })

    return NextResponse.json({
      resources: (resources ?? []).map((r: Record<string, unknown>) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        type: r.type,
        sortOrder: r.sort_order,
      })),
    })
  } catch (error) {
    console.error('Resources error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
