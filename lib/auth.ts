import { supabaseBrowserClient } from '@/lib/supabase/browser'
import type { User } from './types'
import { useState, useEffect } from 'react';

export class AuthService {
  private static supabase = supabaseBrowserClient

  static async login(email: string, password: string): Promise<any | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Error logging in:', error)
      return null
    }
    return data.user
  }

  static async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
    }
  }

  static async getCurrentUser(): Promise<any | null> {
    const { data } = await this.supabase.auth.getUser()
    return data.user
  }

  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }
}

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
