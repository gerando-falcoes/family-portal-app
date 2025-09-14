import { mockUsers } from "./mock-data"
import type { User } from "./types"

// TEMPORÁRIO: Sistema de autenticação mockado para aceitar qualquer login
// Para reverter: descomente o código original e remova o código mockado

export class AuthService {
  private static currentUser: User | null = null

  // TEMPORÁRIO: Login que aceita qualquer credencial
  static async login(email: string, password: string): Promise<User | null> {
    // Código original (comentado):
    // const user = mockUsers.find((u) => u.email === email && u.password === password)
    // if (user) {
    //   this.currentUser = user
    //   localStorage.setItem("currentUser", JSON.stringify(user))
    //   return user
    // }
    // return null

    // TEMPORÁRIO: Aceita qualquer email/senha e retorna um usuário mock
    const mockUser: User = {
      id: "temp-user",
      email: email,
      password: password,
      familyId: "FAM001",
    }
    
    this.currentUser = mockUser
    localStorage.setItem("currentUser", JSON.stringify(mockUser))
    return mockUser
  }

  static logout(): void {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser")
      if (stored) {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      }
    }
    return null
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}
