import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { familyId, responses, userEmail } = await request.json();
    
    // Validação básica dos dados
    if (!familyId || !responses || !userEmail) {
      return NextResponse.json({ 
        error: 'Dados obrigatórios ausentes: familyId, responses e userEmail são necessários' 
      }, { status: 400 });
    }

    // Calcular score baseado em respostas Sim/Não
    const totalQuestions = Object.keys(responses).length;
    const positiveAnswers = Object.values(responses).filter(Boolean).length;
    const score = (positiveAnswers / totalQuestions) * 10;
    
    // Classificar nível de pobreza
    const povertyLevel = score >= 7 ? 'Baixo' : score >= 4 ? 'Médio' : 'Alto';
    
    // Calcular scores por dimensão (cada dimensão = 1 se Sim, 0 se Não)
    const dimensionScores = Object.entries(responses).reduce((acc, [key, value]) => {
      acc[key] = value ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    // ✅ Inserir na tabela dignometro_assessments
    const { data, error } = await supabaseServerClient
      .from('dignometro_assessments')
      .insert({
        family_id: familyId,
        answers: responses, // ✅ JSONB com estrutura Sim/Não
        poverty_score: score,
        poverty_level: povertyLevel,
        dimension_scores: dimensionScores, // ✅ JSONB estruturado
        assessment_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json({ 
        error: 'Erro ao salvar avaliação', 
        details: error.message 
      }, { status: 500 });
    }

    // ✅ Retorno de sucesso com dados estruturados
    return NextResponse.json({ 
      success: true, 
      assessment: data,
      score,
      povertyLevel,
      message: 'Avaliação salva com sucesso!'
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// ✅ GET method para recuperar histórico de avaliações de uma família
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');

    if (!familyId) {
      return NextResponse.json({ 
        error: 'familyId é obrigatório como parâmetro de query' 
      }, { status: 400 });
    }

    // Buscar histórico de avaliações
    const { data, error } = await supabaseServerClient
      .from('dignometro_assessments')
      .select('*')
      .eq('family_id', familyId)
      .order('assessment_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      return NextResponse.json({ 
        error: 'Erro ao buscar histórico de avaliações',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      assessments: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Erro interno GET:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
