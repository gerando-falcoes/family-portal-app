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

    // 2. Chamar a Edge Function 'create-user' para criar o usuário
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

    // 3. Salvar os dados da família na tabela 'families'
    const familyRecord = {
      email: familyData.contacts.email,
      name: `Família ${familyData.contacts.email.split('@')[0]}`, // Nome baseado no email
      phone: familyData.contacts.phone,
      whatsapp: familyData.contacts.whatsapp,
      income_range: familyData.socioeconomic.incomeRange,
      family_size: familyData.socioeconomic.familySize,
      children_count: familyData.socioeconomic.numberOfChildren, // Usar children_count
      street: familyData.address.street,
      neighborhood: familyData.address.neighborhood,
      city: familyData.address.city,
      state: familyData.address.state,
      reference_point: familyData.address.referencePoint || null,
      status: 'ativo', // Usar 'ativo' como na estrutura real
      // Removido user_id pois não existe na tabela
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

    // 4. Retornar sucesso
    return NextResponse.json({ 
      message: 'Família e usuário criados com sucesso!', 
      user: userData.user,
      family: familyInsertData
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
