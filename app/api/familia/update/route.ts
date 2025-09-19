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

    // Preparar dados para atualização (exceto email e senha)
    const updateData = {
      name: familyData.name || `Família ${user.email.split('@')[0]}`,
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

    // Atualizar dados na tabela families
    const { data: updatedFamily, error: updateError } = await supabaseServerClient
      .from('families')
      .update(updateData)
      .eq('email', user.email)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar família:', updateError);
      return NextResponse.json({ error: 'Erro ao atualizar dados da família' }, { status: 500 });
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
