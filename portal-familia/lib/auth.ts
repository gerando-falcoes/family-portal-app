import { mockUsers } from "./mock-data"
import type { User } from "./types"

export class AuthService {
  private static currentUser: User | null = null

  static async login(email: string, password: string): Promise<User | null> {
    const user = mockUsers.find((u) => u.email === email && u.password === password)
    if (user) {
      this.currentUser = user
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }
    return null
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
