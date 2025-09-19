import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Obter os dados do formulário
    const body = await request.json();
    const { email, password, familyData } = body;

    if (!email || !password || !familyData) {
      return NextResponse.json({ error: 'Email, senha e dados da família são obrigatórios' }, { status: 400 });
    }

    // 2. Validar campos obrigatórios da família (incluindo CPF)
    if (!familyData.name || !familyData.cpf || !familyData.contacts?.phone || !familyData.address?.street || 
        !familyData.address?.neighborhood || !familyData.address?.city || !familyData.address?.state) {
      return NextResponse.json({ error: 'Campos obrigatórios da família não preenchidos (nome, CPF, telefone, endereço)' }, { status: 400 });
    }

    // 3. Chamar a Edge Function 'create-user' para criar o usuário
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-user`;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const userResponse = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return NextResponse.json({ error: userData.error || 'Falha ao criar usuário' }, { status: userResponse.status });
    }

    // 4. Salvar os dados da família na tabela 'families' (com todos os campos incluindo CPF)
    const familyRecord = {
      name: familyData.name,
      cpf: familyData.cpf,
      phone: familyData.contacts.phone,
      whatsapp: familyData.contacts.phone, // WhatsApp é o mesmo que telefone
      email: familyData.contacts.email || email, // Usar email do form ou email do usuário
      street: familyData.address.street,
      neighborhood: familyData.address.neighborhood,
      city: familyData.address.city,
      state: familyData.address.state,
      reference_point: familyData.address.referencePoint || null,
      income_range: familyData.socioeconomic.incomeRange || null,
      family_size: familyData.socioeconomic.familySize || 1,
      children_count: 0, // Removido do formulário, manter como 0
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: familyInsertData, error: familyError } = await supabaseServerClient
      .from('families')
      .insert([familyRecord])
      .select()
      .single();

    if (familyError) {
      console.error('Erro ao inserir família:', familyError);
      return NextResponse.json({ error: 'Erro ao salvar dados da família' }, { status: 500 });
    }

    // 5. Criar perfil na tabela 'profiles'
    const profileRecord = {
      name: familyData.name,
      cpf: familyData.cpf,
      phone: familyData.contacts.phone,
      email: familyData.contacts.email || email, // Email da família ou do usuário
      role: 'familia',
      status_aprovacao: 'pendente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: profileInsertData, error: profileError } = await supabaseServerClient
      .from('profiles')
      .insert([profileRecord])
      .select()
      .single();

    if (profileError) {
      console.error('Erro ao inserir perfil:', profileError);
      // Se falhar ao criar o perfil, não falha o cadastro da família
      // mas loga o erro para investigação
      console.warn('Família criada mas perfil não foi criado:', familyInsertData.id);
    }

    // 6. Retornar sucesso
    return NextResponse.json({ 
      message: 'Família, usuário e perfil criados com sucesso!', 
      user: userData.user,
      family: familyInsertData,
      profile: profileInsertData || null
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}