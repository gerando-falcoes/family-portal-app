import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import type { FamilyDashboardInfo } from '@/lib/types';

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

    // Primeiro, buscar o family_id usando a tabela families
    const { data: familyData, error: familyError } = await supabaseServerClient
      .from('families')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (familyError) {
      if (familyError.code === 'PGRST116') {
        // Nenhum registro encontrado
        return NextResponse.json({ error: 'Família não encontrada' }, { status: 404 });
      }
      console.error('Erro ao buscar família:', familyError);
      return NextResponse.json({ error: 'Erro ao buscar dados da família' }, { status: 500 });
    }

    // Buscar dados organizados da família
    const { data: familyInfo, error: familyInfoError } = await supabaseServerClient
      .from('families')
      .select('*')
      .eq('id', familyData.id)
      .single();

    if (familyInfoError) {
      console.error('Erro ao buscar informações da família:', familyInfoError);
      return NextResponse.json({ error: 'Erro ao buscar dados da família' }, { status: 500 });
    }

    // Buscar avaliações
    const { data: assessments, error: assessmentsError } = await supabaseServerClient
      .from('dignometro_assessments')
      .select('*')
      .eq('family_id', familyData.id)
      .order('assessment_date', { ascending: false })
      .order('created_at', { ascending: false });

    const dashboardData = [{
      family_id: familyInfo.id,
      family_name: familyInfo.name,
      contacts: {
        phone: familyInfo.phone,
        whatsapp: familyInfo.whatsapp,
        email: familyInfo.email
      },
      socioeconomic_data: {
        income_range: familyInfo.income_range,
        family_size: familyInfo.family_size,
        children_count: familyInfo.children_count
      },
      address: {
        street: familyInfo.street,
        neighborhood: familyInfo.neighborhood,
        city: familyInfo.city,
        state: familyInfo.state,
        reference_point: familyInfo.reference_point
      },
      latest_assessment: assessments && assessments.length > 0 ? {
        assessment_id: assessments[0].id,
        poverty_score: assessments[0].poverty_score,
        poverty_level: assessments[0].poverty_level,
        assessment_date: assessments[0].assessment_date,
        dimension_scores: assessments[0].dimension_scores,
        answers: assessments[0].answers,
        created_at: assessments[0].created_at
      } : null,
      assessment_history: assessments || [],
      status: familyInfo.status,
      mentor_email: familyInfo.mentor_email,
      created_at: familyInfo.created_at,
      updated_at: familyInfo.updated_at
    }];

    const dashboardError = null;

    if (dashboardError) {
      console.error('Erro ao buscar dashboard da família:', dashboardError);
      
      // Fallback: buscar dados básicos da família
      const { data: basicFamilyData, error: basicError } = await supabaseServerClient
        .from('families')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (basicError) {
        return NextResponse.json({ error: 'Erro ao buscar dados da família' }, { status: 500 });
      }

      // Retornar dados básicos formatados
      const basicFamily = {
        id: basicFamilyData.id,
        name: basicFamilyData.name || 'Família',
        status: basicFamilyData.status === 'ativo' ? 'Ativa' : (basicFamilyData.status || 'Ativa'),
        contacts: {
          phone: basicFamilyData.phone || '',
          whatsapp: basicFamilyData.whatsapp || '',
          email: basicFamilyData.email || userEmail,
        },
        socioeconomic: {
          incomeRange: basicFamilyData.income_range || '',
          familySize: basicFamilyData.family_size || 1,
          numberOfChildren: basicFamilyData.children_count || 0,
        },
        address: {
          street: basicFamilyData.street || '',
          neighborhood: basicFamilyData.neighborhood || '',
          city: basicFamilyData.city || '',
          state: basicFamilyData.state || '',
          referencePoint: basicFamilyData.reference_point || '',
        },
        createdAt: new Date(basicFamilyData.created_at),
        updatedAt: new Date(basicFamilyData.updated_at || basicFamilyData.created_at),
      };

      return NextResponse.json({ family: basicFamily, isDashboard: false });
    }

    // Se temos dados do dashboard, retornar formatados
    const dashboardInfo = dashboardData[0] as FamilyDashboardInfo;
    
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
      assessmentHistory: dashboardInfo.assessment_history
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
