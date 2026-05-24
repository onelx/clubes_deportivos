import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  try {
    const { data: usuariosClub, error: ucError } = await supabase
      .from('usuarios_club')
      .select('*')
      .eq('club_id', params.id);

    if (ucError) throw ucError;

    if (!usuariosClub || usuariosClub.length === 0) {
      return NextResponse.json([]);
    }

    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    const merged = usuariosClub.map((uc) => {
      const authUser = users.find((u) => u.id === uc.auth_user_id);
      return { ...uc, email: authUser?.email || null };
    });

    return NextResponse.json(merged);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  try {
    const body = await request.json();
    const { email, rol, password } = body;

    if (!email || !rol) {
      return NextResponse.json({ error: 'email y rol son requeridos' }, { status: 400 });
    }

    const validRoles = ['admin', 'editor', 'viewer'];
    if (!validRoles.includes(rol)) {
      return NextResponse.json({ error: 'rol inválido' }, { status: 400 });
    }

    // Look up user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let authUserId: string;
    let tempPassword: string | null = null;
    let wasCreated = false;

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      authUserId = existingUser.id;
    } else {
      // Create the user — use provided password or generate one
      const generated = password && password.length >= 6
        ? password
        : Math.random().toString(36).slice(2, 10) +
          Math.random().toString(36).slice(2, 6).toUpperCase() + '!';
      tempPassword = generated;

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: generated,
        email_confirm: true,
      });

      if (createError) throw createError;

      authUserId = newUser.user.id;
      wasCreated = true;
    }

    // Check if already linked to this club
    const { data: existing } = await supabase
      .from('usuarios_club')
      .select('id')
      .eq('club_id', params.id)
      .eq('auth_user_id', authUserId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Este usuario ya está vinculado a este club' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('usuarios_club')
      .insert({ club_id: params.id, auth_user_id: authUserId, rol })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { ...data, email, wasCreated, tempPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  try {
    const body = await request.json();
    const { auth_user_id, newPassword } = body;

    if (!auth_user_id || !newPassword) {
      return NextResponse.json({ error: 'auth_user_id y newPassword son requeridos' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const { error } = await supabase.auth.admin.updateUserById(auth_user_id, {
      password: newPassword,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
