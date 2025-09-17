export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import type { FamilyOverview, DiagnoseAssessment } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Obter email do parâmetro de query para teste
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');
    
    let userEmail = testEmail;

    // Se não há email de teste, tentar obter da sessão
    if (!testEmail) {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        return NextResponse.json({ error: 'Token de autorização não fornecido' }, { status: 401 });
      }

      // Usar server client para verificar o token
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabaseServerClient.auth.getUser(token);
      
      if (userError || !user?.email) {
        return NextResponse.json({ error: 'Token inválido ou usuário não encontrado' }, { status: 401 });
      }

      userEmail = user.email;
    }

    // Buscar dados da family_overview usando o email
    const { data: overviewData, error: overviewError } = await supabaseServerClient
      .from('family_overview')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (overviewError) {
      if (overviewError.code === 'PGRST116') {
        // Nenhum registro encontrado
        return NextResponse.json({ error: 'Família não encontrada' }, { status: 404 });
      }
      console.error('Erro ao buscar dados da família:', overviewError);
      return NextResponse.json({ error: 'Erro ao buscar dados da família' }, { status: 500 });
    }

    // Buscar histórico completo de avaliações
    const { data: assessmentHistory, error: historyError } = await supabaseServerClient
      .from('dignometro_assessments')
      .select('*')
      .eq('family_id', overviewData.family_id)
      .order('assessment_date', { ascending: false })
      .order('created_at', { ascending: false });

    // Organizar dados na estrutura esperada
    const familyOverview = overviewData as FamilyOverview;

    const dashboardData = [{
      family_id: familyOverview.family_id,
      family_name: familyOverview.family_name,
      contacts: {
        phone: familyOverview.phone,
        whatsapp: familyOverview.whatsapp,
        email: familyOverview.email
      },
      socioeconomic_data: {
        income_range: familyOverview.income_range,
        family_size: familyOverview.family_size,
        children_count: familyOverview.children_count
      },
      address: {
        street: familyOverview.street,
        neighborhood: familyOverview.neighborhood,
        city: familyOverview.city,
        state: familyOverview.state,
        reference_point: familyOverview.reference_point
      },
      latest_assessment: familyOverview.current_poverty_score ? {
        assessment_id: familyOverview.latest_assessment_id || '',
        poverty_score: familyOverview.current_poverty_score,
        poverty_level: familyOverview.current_poverty_level || '',
        assessment_date: familyOverview.latest_assessment_date || '',
        dimension_scores: familyOverview.current_dimension_scores,
        answers: null,
        created_at: familyOverview.latest_assessment_date || ''
      } : null,
      assessment_history: assessmentHistory || [],
      status: familyOverview.family_status,
      mentor_email: familyOverview.mentor_email,
      created_at: familyOverview.family_created_at || '',
      updated_at: familyOverview.family_updated_at || ''
    }];

    const dashboardError = null;

    // Dados do dashboard organizados
    const dashboardInfo = dashboardData[0];
    
    const family = {
      id: dashboardInfo.family_id,
      name: dashboardInfo.family_name || 'Família',
      status: dashboardInfo.status === 'ativo' ? 'Ativa' : (dashboardInfo.status || 'Ativa'),
      contacts: {
        phone: dashboardInfo.contacts.phone || '',
        whatsapp: dashboardInfo.contacts.whatsapp || '',
        email: dashboardInfo.contacts.email || userEmail,
      },
      socioeconomic: {
        incomeRange: dashboardInfo.socioeconomic_data.income_range || '',
        familySize: dashboardInfo.socioeconomic_data.family_size || 1,
        numberOfChildren: dashboardInfo.socioeconomic_data.children_count || 0,
      },
      address: {
        street: dashboardInfo.address.street || '',
        neighborhood: dashboardInfo.address.neighborhood || '',
        city: dashboardInfo.address.city || '',
        state: dashboardInfo.address.state || '',
        referencePoint: dashboardInfo.address.reference_point || '',
      },
      createdAt: new Date(dashboardInfo.created_at),
      updatedAt: new Date(dashboardInfo.updated_at),
    };

    return NextResponse.json({ 
      family, 
      isDashboard: true,
      latestAssessment: dashboardInfo.latest_assessment,
      assessmentHistory: assessmentHistory || []
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}