import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Obter os dados do formulário (incluindo email e senha do novo usuário)
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são necessários para criar o usuário da família' }, { status: 400 });
    }

    // 2. Chamar a Edge Function 'create-user' de forma segura
    // As variáveis de ambiente são acessadas com segurança no lado do servidor
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-user`;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Se a resposta da Edge Function não for OK, repasse o erro
      return NextResponse.json({ error: responseData.error || 'Falha ao criar usuário na Edge Function' }, { status: response.status });
    }

    // Aqui você pode adicionar a lógica para salvar os outros dados da família no banco de dados,
    // associando-os ao ID do usuário recém-criado: responseData.user.id

    // 3. Retornar o sucesso para o cliente
    return NextResponse.json({ message: 'Família e usuário criados com sucesso!', user: responseData.user });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
