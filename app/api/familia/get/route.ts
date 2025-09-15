import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

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

    // Buscar dados da família na tabela 'familie' usando o email
    const { data: familyData, error: familyError } = await supabaseServerClient
      .from('familie')
      .select('*')
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

    // Transformar os dados do Supabase para o formato esperado pela aplicação
    const family = {
      id: familyData.id,
      name: familyData.name || 'Família',
      status: familyData.status === 'ativo' ? 'Ativa' : (familyData.status || 'Ativa'),
      contacts: {
        phone: familyData.phone || '',
        whatsapp: familyData.whatsapp || '',
        email: familyData.email || userEmail, // Usar email da sessão se não estiver na tabela
      },
      socioeconomic: {
        incomeRange: familyData.income_range || '',
        familySize: familyData.family_size || 1,
        numberOfChildren: familyData.children_count || 0, // Usar children_count
      },
      address: {
        street: familyData.street || '',
        neighborhood: familyData.neighborhood || '',
        city: familyData.city || '',
        state: familyData.state || '',
        referencePoint: familyData.reference_point || '',
      },
      createdAt: new Date(familyData.created_at),
      updatedAt: new Date(familyData.updated_at || familyData.created_at),
    };

    return NextResponse.json({ family });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
