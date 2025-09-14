import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Hello from create-user Function!')

Deno.serve(async (req) => {
  try {
    // 1. Crie um cliente de admin. As variáveis de ambiente são injetadas automaticamente.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 2. Extraia os dados do novo usuário do corpo da requisição.
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email e senha são obrigatórios' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 3. Use o método admin para criar o usuário.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Marcar o e-mail como confirmado
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    return new Response(JSON.stringify({ user: data.user }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
