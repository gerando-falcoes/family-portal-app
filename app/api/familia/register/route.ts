import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Obter os dados do formulário
    const body = await request.json();
    const { familyData } = body;

    if (!familyData) {
      return NextResponse.json({ error: 'Dados da família são obrigatórios' }, { status: 400 });
    }

    // 2. Validar campos obrigatórios (incluindo CPF)
    if (!familyData.name || !familyData.cpf || !familyData.contacts?.phone || !familyData.address?.street || 
        !familyData.address?.neighborhood || !familyData.address?.city || !familyData.address?.state) {
      return NextResponse.json({ error: 'Campos obrigatórios não preenchidos' }, { status: 400 });
    }

    // 3. Salvar os dados da família na tabela 'families'
    const familyRecord = {
      name: familyData.name,
      cpf: familyData.cpf,
      phone: familyData.contacts.phone,
      whatsapp: familyData.contacts.phone, // WhatsApp é o mesmo que telefone
      email: familyData.contacts.email || null, // Email é opcional
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

    // 4. Criar perfil na tabela 'profiles'
    const profileRecord = {
      name: familyData.name,
      cpf: familyData.cpf,
      phone: familyData.contacts.phone,
      email: familyData.contacts.email || null, // Email é opcional
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

    // 5. Retornar sucesso
    return NextResponse.json({ 
      message: 'Família cadastrada com sucesso!', 
      family: familyInsertData,
      profile: profileInsertData || null
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}