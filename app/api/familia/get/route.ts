export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';
import type { FamilyOverview, DiagnoseAssessment } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Obter CPF do parâmetro de query para teste
    const { searchParams } = new URL(request.url);
    const testCpf = searchParams.get('cpf');
    
    let userCpf = testCpf;

    // Se não há CPF de teste, tentar obter da sessão customizada
    if (!testCpf) {
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        return NextResponse.json({ error: 'Token de autorização não fornecido' }, { status: 401 });
      }

      // Verificar se é um token customizado
      const token = authHeader.replace('Bearer ', '');
      if (!token.startsWith('custom_')) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }

      // Para simplificar, vamos usar o CPF conhecido do usuário de teste
      // Em produção, você deveria armazenar o CPF no token ou em uma tabela de sessões
      userCpf = '228.455.338-96';
    }

    // Buscar dados da família usando o CPF diretamente
    let { data: familyData, error: familyError } = await supabaseServerClient
      .from('families')
      .select('*')
      .eq('cpf', userCpf)
      .single();

    // Se a família não existe, criar uma automaticamente
    if (familyError || !familyData) {
      console.log('Família não encontrada, criando automaticamente para CPF:', userCpf);
      
      // Buscar dados do profile para criar a família
      const { data: profileData } = await supabaseServerClient
        .from('profiles')
        .select('*')
        .eq('cpf', userCpf)
        .eq('role', 'familia')
        .single();

      if (profileData) {
        // Criar família automaticamente
        const newFamilyData = {
          name: profileData.name,
          cpf: profileData.cpf,
          phone: profileData.phone || '(15) 99806-2305',
          whatsapp: profileData.phone || '(15) 99806-2305',
          email: profileData.email || 'marbergertony@gmail.com',
          street: 'Rua Teste, 123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          income_range: 'R$ 1.000 - R$ 2.000',
          family_size: 3,
          children_count: 1,
          status: 'ativo',
          status_aprovacao: 'aprovado',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: createdFamily, error: createError } = await supabaseServerClient
          .from('families')
          .insert([newFamilyData])
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar família:', createError);
          return NextResponse.json({ error: 'Erro ao criar família' }, { status: 500 });
        }

        familyData = createdFamily;
        console.log('Família criada automaticamente:', familyData.id);
      } else {
        return NextResponse.json({ error: 'Profile não encontrado' }, { status: 404 });
      }
    }

    // Buscar dados da family_overview usando o family_id
    const { data: overviewData, error: overviewError } = await supabaseServerClient
      .from('family_overview')
      .select('*')
      .eq('family_id', familyData.id)
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
        cpf: userCpf
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
        cpf: dashboardInfo.contacts.cpf || '',
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