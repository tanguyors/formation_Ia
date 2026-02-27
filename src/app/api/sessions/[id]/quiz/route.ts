import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET: Fetch quiz questions for a session (without revealing correct answers)
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

    // Get all quiz sections for this session
    const { data: quizSections } = await admin
      .from('session_sections')
      .select('id')
      .eq('session_id', sessionId)
      .eq('type', 'quiz')

    if (!quizSections || quizSections.length === 0) {
      return NextResponse.json({ questions: [], hasQuiz: false })
    }

    const sectionIds = quizSections.map((s: { id: string }) => s.id)

    // Get questions with options (but NOT is_correct)
    const { data: questions } = await admin
      .from('quiz_questions')
      .select('id, question_text, question_type, sort_order, section_id')
      .in('section_id', sectionIds)
      .order('sort_order', { ascending: true })

    if (!questions || questions.length === 0) {
      return NextResponse.json({ questions: [], hasQuiz: false })
    }

    const questionIds = questions.map((q: { id: string }) => q.id)

    const { data: options } = await admin
      .from('quiz_options')
      .select('id, question_id, option_text, sort_order')
      .in('question_id', questionIds)
      .order('sort_order', { ascending: true })

    // Check if user already passed this quiz
    const { data: bestAttempt } = await admin
      .from('quiz_attempts')
      .select('score, total_questions, passed')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .eq('passed', true)
      .limit(1)
      .maybeSingle()

    // Combine questions with their options
    const questionsWithOptions = questions.map((q: { id: string; question_text: string; question_type: string; sort_order: number; section_id: string }) => ({
      id: q.id,
      questionText: q.question_text,
      questionType: q.question_type,
      sortOrder: q.sort_order,
      sectionId: q.section_id,
      options: (options ?? [])
        .filter((o: { question_id: string }) => o.question_id === q.id)
        .map((o: { id: string; option_text: string; sort_order: number }) => ({
          id: o.id,
          optionText: o.option_text,
          sortOrder: o.sort_order,
        })),
    }))

    return NextResponse.json({
      questions: questionsWithOptions,
      hasQuiz: true,
      alreadyPassed: bestAttempt?.passed ?? false,
    })
  } catch (error) {
    console.error('Quiz fetch error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST: Submit quiz answers and validate
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const answers: Record<string, string> = body.answers // { questionId: optionId }

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Aucune réponse fournie' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Get all quiz sections for this session
    const { data: quizSections } = await admin
      .from('session_sections')
      .select('id')
      .eq('session_id', sessionId)
      .eq('type', 'quiz')

    if (!quizSections || quizSections.length === 0) {
      return NextResponse.json({ error: 'Pas de quiz pour cette session' }, { status: 400 })
    }

    const sectionIds = quizSections.map((s: { id: string }) => s.id)

    // Get all questions for this session's quiz
    const { data: questions } = await admin
      .from('quiz_questions')
      .select('id')
      .in('section_id', sectionIds)

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'Aucune question trouvée' }, { status: 400 })
    }

    const questionIds = questions.map((q: { id: string }) => q.id)

    // Get correct options
    const { data: correctOptions } = await admin
      .from('quiz_options')
      .select('id, question_id, is_correct')
      .in('question_id', questionIds)
      .eq('is_correct', true)

    // Build a map of questionId -> correct optionId
    const correctMap = new Map<string, string>()
    for (const opt of (correctOptions ?? [])) {
      correctMap.set(opt.question_id, opt.id)
    }

    // Grade each answer
    const totalQuestions = questions.length
    let score = 0
    const results: Array<{
      questionId: string
      selectedOptionId: string
      correctOptionId: string
      isCorrect: boolean
    }> = []

    for (const q of questions) {
      const selectedOptionId = answers[q.id] || ''
      const correctOptionId = correctMap.get(q.id) || ''
      const isCorrect = selectedOptionId === correctOptionId

      if (isCorrect) score++

      results.push({
        questionId: q.id,
        selectedOptionId,
        correctOptionId,
        isCorrect,
      })
    }

    const passed = score === totalQuestions // Must get ALL correct

    // Save the attempt
    await admin.from('quiz_attempts').insert({
      user_id: user.id,
      session_id: sessionId,
      score,
      total_questions: totalQuestions,
      passed,
      answers: results,
    })

    // If passed, auto-complete the session
    if (passed) {
      // Check if session isn't already completed
      const { data: progress } = await admin
        .from('user_progress')
        .select('id, status, session:sessions(session_number)')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .single()

      if (progress && progress.status !== 'COMPLETED') {
        const XP_PER_SESSION = 100

        // Mark as completed
        await admin.from('user_progress').update({
          status: 'COMPLETED',
          xp_earned: XP_PER_SESSION,
          completed_at: new Date().toISOString(),
        }).eq('id', progress.id)

        // Update user XP and level
        const { data: dbUser } = await admin
          .from('users')
          .select('xp, pool_id')
          .eq('id', user.id)
          .single()

        const newXp = (dbUser?.xp ?? 0) + XP_PER_SESSION
        const newLevel = calculateLevel(newXp)

        await admin.from('users').update({
          xp: newXp,
          level: newLevel,
        }).eq('id', user.id)

        // Unlock next session
        const session = progress.session as unknown as { session_number: number }
        const nextSessionNumber = session.session_number + 1
        const { data: nextSession } = await admin
          .from('sessions')
          .select('id')
          .eq('session_number', nextSessionNumber)
          .eq('is_published', true)
          .single()

        if (nextSession) {
          let canUnlock = true
          if (dbUser?.pool_id) {
            const { data: poolSession } = await admin
              .from('pool_sessions')
              .select('is_unlocked')
              .eq('pool_id', dbUser.pool_id)
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
      }
    }

    return NextResponse.json({
      score,
      totalQuestions,
      passed,
      results,
    })
  } catch (error) {
    console.error('Quiz submit error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

function calculateLevel(xp: number): string {
  if (xp >= 900) return 'SENTINELLE'
  if (xp >= 600) return 'ARCHITECTE'
  if (xp >= 300) return 'CONNECTEUR'
  return 'OPERATEUR'
}
