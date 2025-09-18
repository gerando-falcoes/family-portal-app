'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { supabaseBrowserClient } from '@/lib/supabase/browser'
import { diagnosticoQuestions } from '@/lib/diagnostico'
import { QuestionCard } from './components/QuestionCard'
import { useDiagnostico } from './hooks/useDiagnostico'
import { useProgress } from './hooks/useProgress'
import { Badge, type BadgeProps } from "@/components/ui/badge"

// --- UTILS ---
const formatPovertyLevel = (level: string): string => {
  const levels: { [key: string]: string } = { 'extrema pobreza': 'Extrema Pobreza', 'pobreza': 'Pobreza', 'vulnerabilidade': 'Vulnerabilidade', 'dignidade': 'Dignidade', 'desenvolvimento': 'Desenvolvimento' };
  return levels[level?.toLowerCase()] || level;
};

const getPovertyLevelVariant = (level: string): BadgeProps["variant"] => {
  const formattedLevel = level.toLowerCase();
  switch (formattedLevel) {
    case 'desenvolvimento': return 'secondary';
    case 'dignidade': return 'default';
    case 'vulnerabilidade': return 'accent';
    case 'pobreza':
    case 'extrema pobreza': return 'destructive';
    default: return 'outline';
  }
};

// --- ANIMATION VARIANTS ---
const questionVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 }),
};

// --- MAIN PAGE ---
export default function DignometroPage() {
  const { responses, updateResponse, isAnswered } = useDiagnostico();
  const { currentStep, totalSteps, nextStep, previousStep, currentQuestion, direction } = useProgress();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState('');
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFamilyId = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabaseBrowserClient.auth.getSession();
        if (sessionError || !session?.user?.email) {
          setAuthError('Usuário não autenticado. Redirecionando...');
          router.push('/');
          return;
        }
        const response = await fetch('/api/familia/get', { headers: { 'Authorization': `Bearer ${session.access_token}` } });
        if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Erro ao carregar dados.'); }
        const data = await response.json();
        setFamilyId(data.family.id);
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : 'Erro de conexão.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFamilyId();
  }, [router]);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!familyId) throw new Error('ID da família não encontrado.');
      const { data: { session } } = await supabaseBrowserClient.auth.getSession();
      if (!session?.user?.email) throw new Error('Usuário não autenticado.');

      const response = await fetch('/api/dignometro/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId, responses, userEmail: session.user.email }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro ao salvar avaliação.');

      setFinalScore(result.score);
      setFinalLevel(result.povertyLevel);
      setIsCompleted(true);
      toast({ title: "Avaliação concluída com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao salvar avaliação", description: error instanceof Error ? error.message : 'Erro inesperado.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <StateScreen icon={Loader2} title="Carregando..." message="Buscando informações da sua família." spinner />;
  if (authError) return <StateScreen icon={AlertTriangle} title="Erro de Autenticação" message={authError} isError />;

  if (isCompleted) {
    return (
      <StateScreen icon={CheckCircle} title="Avaliação Concluída!" isSuccess>
        <div className="text-center space-y-4">
          <div>
            <span className="text-6xl font-bold text-gray-800">{finalScore.toFixed(1)}</span>
            <span className="text-gray-600"> / 10</span>
          </div>
          <Badge variant={getPovertyLevelVariant(finalLevel)} className="text-base py-1 px-3 rounded-md">{formatPovertyLevel(finalLevel)}</Badge>
          <button 
            onClick={() => router.push("/familia")} 
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Voltar ao Perfil
          </button>
        </div>
      </StateScreen>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"32\" height=\"32\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 32 0 L 0 0 0 32\" fill=\"none\" stroke=\"%23e2e8f0\" stroke-width=\"1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"}}></div>
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header melhorado */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
          <button 
            onClick={() => router.push("/familia")} 
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Voltar
          </button>
            <div className="flex-1" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Dignômetro</h1>
            <p className="text-gray-600">Avaliação socioeconômica para medir a dignidade familiar</p>
          </div>
          
          {/* Progress bar melhorada */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Pergunta {currentStep + 1} de {totalSteps}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Card da pergunta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <div className="p-8 min-h-[400px] flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="w-full absolute"
                >
                  <QuestionCard question={currentQuestion} onAnswer={updateResponse} selectedValue={responses[currentQuestion.id]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Navegação melhorada */}
        <motion.div 
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button 
            className="flex items-center gap-2 px-6 py-3 text-lg border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={previousStep} 
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button 
            className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
            onClick={currentStep < totalSteps - 1 ? nextStep : handleSubmit} 
            disabled={!isAnswered(currentQuestion.id) || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finalizando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {currentStep === totalSteps - 1 ? "Finalizar Avaliação" : "Próxima"}
                {currentStep < totalSteps - 1 && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />}
              </div>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const StateScreen = ({ icon: Icon, title, message, children, isError, isSuccess, spinner }: any) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-4">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isError ? 'bg-red-50' : isSuccess ? 'bg-green-50' : 'bg-gray-100'}`}>
          <Icon className={`w-8 h-8 ${isError ? 'text-red-500' : isSuccess ? 'text-green-500' : 'text-blue-600'} ${spinner && 'animate-spin'}`} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        {message && <p className="text-gray-600">{message}</p>}
        {children}
      </div>
    </motion.div>
  </div>
);
