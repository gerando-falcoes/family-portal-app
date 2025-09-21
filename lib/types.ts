export interface User {
  id: string
  email: string
  password: string
  familyId?: string
}

export interface Family {
  id: string
  name: string
  cpf?: string
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
    cep?: string
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
  povertyLevel: "pobreza extrema" | "pobreza" | "dignidade" | "prosperidade em desenvolvimento" | "quebra de ciclo da pobreza"
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

export interface FamilyOverview {
  family_id: string
  family_name: string
  phone: string | null
  whatsapp: string | null
  email: string | null
  family_size: number | null
  children_count: number | null
  family_status: string | null
  income_range: string | null
  street: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  reference_point: string | null
  full_address: string | null
  mentor_email: string | null
  mentor_name: string | null
  mentor_phone: string | null
  mentor_role: string | null
  latest_assessment_id: string | null
  current_poverty_score: number | null
  current_poverty_level: string | null
  current_dimension_scores: any
  latest_assessment_date: string | null
  total_assessments: number | null
  first_assessment_date: string | null
  last_assessment_date: string | null
  total_goals: number | null
  active_goals: number | null
  completed_goals: number | null
  suggested_goals: number | null
  avg_goal_progress: number | null
  assessment_status: string | null
  dignity_classification: string | null
  family_created_at: string | null
  family_updated_at: string | null
  has_active_mentor: boolean | null
  has_active_goals: boolean | null
  days_since_last_assessment: number | null
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

// ✅ FASE 1.1: Novos tipos para Dignômetro (Sim/Não)
export interface DiagnosticoQuestion {
  id: string;
  dimensao: string;
  pergunta: string;
}

export interface DiagnosticoResponse {
  id: string;
  userId: string;
  userEmail: string;
  familyId: string;
  responses: Record<string, boolean>; // ✅ Sim/Não apenas
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosticoProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export interface DignometroAssessment {
  id: string;
  family_id: string;
  answers: Record<string, boolean>; // ✅ Nova estrutura
  poverty_score: number;
  poverty_level: string;
  dimension_scores: Record<string, number>; // ✅ JSONB estruturado
  assessment_date: string;
  created_at: string;
}