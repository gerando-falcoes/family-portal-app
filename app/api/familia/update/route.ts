export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const body = await request.json();
    const { familyData } = body;

    if (!familyData) {
      return NextResponse.json({ error: 'Dados da família são obrigatórios' }, { status: 400 });
    }

    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização não fornecido' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseServerClient.auth.getUser(token);
    
    if (userError || !user?.email) {
      return NextResponse.json({ error: 'Token inválido ou usuário não encontrado' }, { status: 401 });
    }

    // Primeiro, tentar buscar o family_id usando o email na tabela families
    let familyId: string | null = null;
    
    // Tentar buscar diretamente na tabela families pelo email
    const { data: familyData, error: familyError } = await supabaseServerClient
      .from('families')
      .select('id')
      .eq('email', user.email)
      .single();

    if (familyData?.id) {
      familyId = familyData.id;
    } else {
      // Se não encontrou na tabela families, tentar na family_overview
      const { data: overviewData, error: overviewError } = await supabaseServerClient
        .from('family_overview')
        .select('family_id')
        .eq('email', user.email)
        .single();

      if (overviewData?.family_id) {
        familyId = overviewData.family_id;
      }
    }

    if (!familyId) {
      console.error('Erro ao buscar family_id para email:', user.email);
      return NextResponse.json({ error: 'Família não encontrada' }, { status: 404 });
    }

    // Preparar dados para atualização na tabela families
    const familyUpdateData = {
      name: familyData.name || `Família ${user.email.split('@')[0]}`,
      cpf: familyData.cpf || null,
      phone: familyData.contacts?.phone || null,
      whatsapp: familyData.contacts?.whatsapp || null,
      income_range: familyData.socioeconomic?.incomeRange || null,
      family_size: familyData.socioeconomic?.familySize || null,
      children_count: familyData.socioeconomic?.numberOfChildren || null,
      street: familyData.address?.street || null,
      neighborhood: familyData.address?.neighborhood || null,
      city: familyData.address?.city || null,
      state: familyData.address?.state || null,
      reference_point: familyData.address?.referencePoint || null,
      updated_at: new Date().toISOString(),
    };

    // Atualizar dados na tabela families usando o family_id
    const { data: updatedFamily, error: familyUpdateError } = await supabaseServerClient
      .from('families')
      .update(familyUpdateData)
      .eq('id', familyId)
      .select()
      .single();

    if (familyUpdateError) {
      console.error('Erro ao atualizar família:', familyUpdateError);
      return NextResponse.json({ error: 'Erro ao atualizar dados da família' }, { status: 500 });
    }

    // Também atualizar dados na tabela profiles se necessário
    const profileUpdateData = {
      phone: familyData.contacts?.phone || null,
      updated_at: new Date().toISOString(),
    };

    const { error: profileUpdateError } = await supabaseServerClient
      .from('profiles')
      .update(profileUpdateData)
      .eq('email', user.email);

    if (profileUpdateError) {
      console.warn('Erro ao atualizar perfil (não crítico):', profileUpdateError);
      // Não falha a operação se o perfil não for atualizado
    }

    // Retornar sucesso
    return NextResponse.json({ 
      message: 'Dados da família atualizados com sucesso!',
      family: updatedFamily
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
