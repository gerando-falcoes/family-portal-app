import type { User, Family, Assessment } from "./types"

export const mockUsers: User[] = [
  {
    id: "user1",
    email: "joao.souza@example.com",
    password: "123456",
    familyId: "FAM001",
  },
]

export const mockFamilies: Family[] = [
  {
    id: "FAM001",
    name: "Família Souza",
    status: "Ativa",
    contacts: {
      phone: "(11) 99876-5432",
      whatsapp: "(11) 99876-5432",
      email: "joao.souza@example.com",
    },
    socioeconomic: {
      incomeRange: "R$ 1.500 - R$ 2.000",
      familySize: 4,
      numberOfChildren: 2,
    },
    address: {
      street: "Rua das Acácias, 456, Apto 101",
      neighborhood: "Liberdade",
      city: "São Paulo",
      state: "SP",
      referencePoint: "Ao lado da padaria central.",
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-07-25"),
  },
]

export const mockAssessments: Assessment[] = [
  {
    id: "assess1",
    familyId: "FAM001",
    date: new Date("2024-07-25"),
    score: 8.5,
    povertyLevel: "Baixo",
  },
  {
    id: "assess2",
    familyId: "FAM001",
    date: new Date("2024-01-15"),
    score: 6.8,
    povertyLevel: "Médio",
  },
]
