import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient } from '@/lib/supabase/browser';
import type { Family, DiagnoseAssessment } from '@/lib/types';

interface UseFamilyDataReturn {
  family: Family | null;
  latestAssessment: DiagnoseAssessment | null;
  assessmentHistory: DiagnoseAssessment[];
  isDashboard: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFamilyData(): UseFamilyDataReturn {
  const [family, setFamily] = useState<Family | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<DiagnoseAssessment | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<DiagnoseAssessment[]>([]);
  const [isDashboard, setIsDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFamilyData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar se o usuário está autenticado
      const { data: { session }, error: sessionError } = await supabaseBrowserClient.auth.getSession();
      
      if (sessionError || !session?.user?.email) {
        setError('Usuário não autenticado');
        router.push('/');
        return;
      }

      // Buscar dados da família com token de autenticação
      const response = await fetch('/api/familia/get', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Família não encontrada. Verifique se você completou o cadastro.');
        } else if (response.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
          router.push('/');
        } else {
          setError('Erro ao carregar dados da família');
        }
        return;
      }

      const data = await response.json();
      setFamily(data.family);
      setLatestAssessment(data.latestAssessment || null);
      setAssessmentHistory(data.assessmentHistory || []);
      setIsDashboard(data.isDashboard || false);

    } catch (err) {
      console.error('Erro ao buscar dados da família:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchFamilyData();
  };

  useEffect(() => {
    fetchFamilyData();
  }, []);

  return {
    family,
    latestAssessment,
    assessmentHistory,
    isDashboard,
    isLoading,
    error,
    refetch,
  };
}
