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

export interface DiagnoseAssessment {
  assessment_id: string
  poverty_score: number
  poverty_level: string
  assessment_date: string
  dimension_scores: any
  answers: any
  created_at: string
}

export interface FamilyDashboardInfo {
  family_id: string
  family_name: string
  contacts: {
    phone: string | null
    whatsapp: string | null
    email: string | null
  }
  socioeconomic_data: {
    income_range: string | null
    family_size: number | null
    children_count: number | null
  }
  address: {
    street: string | null
    neighborhood: string | null
    city: string | null
    state: string | null
    reference_point: string | null
  }
  latest_assessment: DiagnoseAssessment | null
  assessment_history: DiagnoseAssessment[]
  status: string | null
  mentor_email: string | null
  created_at: string
  updated_at: string
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
