import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { cpf, password } = await request.json();
    
    if (!cpf || !password) {
      return NextResponse.json({ error: 'CPF e senha são obrigatórios' }, { status: 400 });
    }

    // Buscar usuário na tabela profiles pelo CPF usando server-side client
    const { data: profileDataArray, error: profileError } = await supabaseServerClient
      .from('profiles')
      .select('*')
      .eq('cpf', cpf)
      .eq('role', 'familia')
      .order('created_at', { ascending: false })
      .limit(1);

    const profileData = profileDataArray?.[0] || null;

    if (profileError || !profileData) {
      console.error('CPF não encontrado:', profileError?.message);
      return NextResponse.json({ error: 'CPF não encontrado' }, { status: 401 });
    }

    // Verificar status de aprovação
    if (profileData.status_aprovacao !== 'aprovado') {
      console.error('Usuário não aprovado. Status:', profileData.status_aprovacao);
      return NextResponse.json({ error: 'Usuário não aprovado' }, { status: 401 });
    }

    // Verificar senha
    if (profileData.senha !== password) {
      console.error('Senha incorreta');
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Buscar dados da família usando o familie_id do profile ou CPF como fallback
    let familyData = null;
    
    if (profileData.familie_id) {
      // Usar familie_id se disponível
      const { data: familyById } = await supabaseServerClient
        .from('families')
        .select('*')
        .eq('id', profileData.familie_id)
        .single();
      familyData = familyById;
    } else {
      // Fallback: buscar por CPF
      const { data: familyByCpf } = await supabaseServerClient
        .from('families')
        .select('*')
        .eq('cpf', cpf)
        .single();
      familyData = familyByCpf;
    }

    const user = {
      id: profileData.id,
      email: profileData.email || '',
      cpf: profileData.cpf,
      password: '', // Por segurança, não retornar a senha
      familyId: familyData?.id || '',
      name: profileData.name,
      role: profileData.role,
    };

    return NextResponse.json({ user, success: true });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
