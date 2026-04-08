import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/supabase-js';
import { UsuarioClub } from '@/types';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  usuarioClub: UsuarioClub | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refetchUsuarioClub: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [usuarioClub, setUsuarioClub] = useState<UsuarioClub | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  const fetchUsuarioClub = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios_club')
        .select(`
          *,
          club:clubs(*)
        `)
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching usuario_club:', error);
        setUsuarioClub(null);
        return;
      }

      if (data) {
        setUsuarioClub(data as unknown as UsuarioClub);
      }
    } catch (err) {
      console.error('Error in fetchUsuarioClub:', err);
      setUsuarioClub(null);
    }
  }, [supabase]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchUsuarioClub(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchUsuarioClub(newSession.user.id);
        } else {
          setUsuarioClub(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUsuarioClub]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error('Error al iniciar sesión'),
        };
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error('Error al registrarse'),
        };
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUsuarioClub(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error('Error al resetear contraseña'),
        };
      }
    },
    [supabase]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error('Error al actualizar contraseña'),
        };
      }
    },
    [supabase]
  );

  const refetchUsuarioClub = useCallback(async () => {
    if (user) {
      await fetchUsuarioClub(user.id);
    }
  }, [user, fetchUsuarioClub]);

  return {
    user,
    session,
    usuarioClub,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refetchUsuarioClub,
  };
}
