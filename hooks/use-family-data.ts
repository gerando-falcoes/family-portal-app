import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient } from '@/lib/supabase/browser';
import type { Family } from '@/lib/types';

interface UseFamilyDataReturn {
  family: Family | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFamilyData(): UseFamilyDataReturn {
  const [family, setFamily] = useState<Family | null>(null);
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

      // Buscar dados da família
      const response = await fetch('/api/familia/get');
      
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
    isLoading,
    error,
    refetch,
  };
}
