export interface User {
  id: string
  email: string
  password: string
  familyId?: string
}

export interface Family {
  id: string
  name: string
  status: "Ativa" | "Inativa"
  contacts: {
    phone: string
    whatsapp: string
    email: string
  }
  socioeconomic: {
    incomeRange: string
    familySize: number
    numberOfChildren: number
  }
  address: {
    street: string
    neighborhood: string
    city: string
    state: string
    referencePoint: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Assessment {
  id: string
  familyId: string
  date: Date
  score: number
  povertyLevel: "Baixo" | "Médio" | "Alto"
  details?: string
}

export type IncomeRange =
  | "Até R$ 500"
  | "R$ 501 - R$ 1.000"
  | "R$ 1.001 - R$ 1.500"
  | "R$ 1.501 - R$ 2.000"
  | "R$ 2.001 - R$ 3.000"
  | "Acima de R$ 3.000"

export type BrazilianState =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO"
