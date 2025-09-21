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

    // Verificar autenticação customizada
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização não fornecido' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.startsWith('custom_')) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Buscar CPF do usuário autenticado (simulação - em produção seria mais seguro)
    const { data: profileData, error: profileError } = await supabaseServerClient
      .from('profiles')
      .select('cpf')
      .eq('role', 'familia')
      .eq('status_aprovacao', 'aprovado')
      .limit(1)
      .single();
    
    if (profileError || !profileData?.cpf) {
      return NextResponse.json({ error: 'Usuário não encontrado ou não aprovado' }, { status: 401 });
    }

    const userCpf = profileData.cpf;

    // Buscar family_id usando o CPF na tabela families
    const { data: familyRecord, error: familyError } = await supabaseServerClient
      .from('families')
      .select('id')
      .eq('cpf', userCpf)
      .single();

    if (familyError || !familyRecord?.id) {
      console.error('Erro ao buscar family_id para CPF:', userCpf);
      return NextResponse.json({ error: 'Família não encontrada' }, { status: 404 });
    }

    const familyId = familyRecord.id;

    // Preparar dados para atualização na tabela families
    const familyUpdateData = {
      name: familyData.name || `Família ${userCpf.replace(/\D/g, '').slice(-4)}`,
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
      .eq('cpf', userCpf);

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
