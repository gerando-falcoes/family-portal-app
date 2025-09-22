import { createClient } from '@supabase/supabase-js'
import type { User } from "./types"

function getSupabaseClient() {
  const supabaseUrl = 'https://iawcvuzhrkayzpdyhbii.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhd2N2dXpocmtheXpwZHloYmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDk3NTcsImV4cCI6MjA3MzAyNTc1N30.kZWg2kwBqKRFEE4441YxvizdIRKmd9d1P1NCjcXZERk'
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()

// Interface para sessão customizada
interface CustomSession {
  user: User
  access_token: string
  expires_at: number
}

// Gerenciamento de sessão no localStorage
class SessionManager {
  private static readonly SESSION_KEY = 'portal_familia_session'

  static setSession(session: CustomSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    }
  }

  static getSession(): CustomSession | null {
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (sessionData) {
        const session = JSON.parse(sessionData)
        // Verificar se a sessão não expirou
        if (session.expires_at > Date.now()) {
          return session
        } else {
          this.clearSession()
        }
      }
    }
    return null
  }

  static clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  static generateToken(cpf?: string): string {
    const randomPart = Math.random().toString(36).substr(2, 9);
    const timePart = Date.now();
    const cpfPart = cpf ? '_' + btoa(cpf) : '';
    return 'custom_' + randomPart + '_' + timePart + cpfPart;
  }
}

export class AuthService {
  static async login(cpf: string, password: string): Promise<User | null> {
    try {
      // Usar API route server-side para evitar problemas de RLS
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.error('Erro no login:', data.error)
        return null
      }

      const user: User = data.user

      // Criar sessão customizada
      const session: CustomSession = {
        user,
        access_token: SessionManager.generateToken(user.cpf),
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      }

      SessionManager.setSession(session)

      return user
    } catch (error) {
      console.error('Erro no login:', error)
      return null
    }
  }

  static async logout(): Promise<void> {
    SessionManager.clearSession()
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const session = SessionManager.getSession()
      
      if (session && session.user) {
        // Verificar se a sessão não expirou
        if (session.expires_at <= Date.now()) {
          this.logout()
          return null
        }

        // Por enquanto, confiar na sessão local
        // Em produção, você pode querer verificar o status no servidor
        return session.user
      }

      return null
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return null
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  static async getSession(): Promise<CustomSession | null> {
    return SessionManager.getSession()
  }

  static async getAccessToken(): Promise<string | null> {
    const session = SessionManager.getSession()
    return session?.access_token || null
  }
}
