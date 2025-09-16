import { createClient } from '@supabase/supabase-js'
import type { User } from "./types"

function getSupabaseClient() {
  const supabaseUrl = 'https://iawcvuzhrkayzpdyhbii.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhd2N2dXpocmtheXpwZHloYmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDk3NTcsImV4cCI6MjA3MzAyNTc1N30.kZWg2kwBqKRFEE4441YxvizdIRKmd9d1P1NCjcXZERk'
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()

export class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erro de autenticação:', error.message)
        return null
      }

      if (data.user) {
        // Buscar dados da família usando o email do usuário
        const { data: familyData, error: familyError } = await supabase
          .from('families')
          .select('*')
          .eq('email', email)
          .single()

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          password: '', // Por segurança, não armazenamos a senha
          familyId: familyData?.id || '',
        }

        return user
      }

      return null
    } catch (error) {
      console.error('Erro no login:', error)
      return null
    }
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut()
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Buscar dados da família usando o email do usuário
        const { data: familyData, error: familyError } = await supabase
          .from('families')
          .select('*')
          .eq('email', user.email!)
          .single()

        return {
          id: user.id,
          email: user.email!,
          password: '',
          familyId: familyData?.id || '',
        }
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

  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}
