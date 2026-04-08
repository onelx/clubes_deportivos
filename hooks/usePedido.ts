import { useState, useEffect, useCallback } from 'react';
import { Pedido } from '@/types';

interface UsePedidoReturn {
  pedido: Pedido | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePedido(pedidoId: string, token?: string): UsePedidoReturn {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedido = useCallback(async () => {
    if (!pedidoId) {
      setIsLoading(false);
      setError('No pedido ID provided');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = token
        ? `/api/pedidos/${pedidoId}?token=${token}`
        : `/api/pedidos/${pedidoId}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pedido no encontrado');
        }
        if (response.status === 401) {
          throw new Error('No autorizado para ver este pedido');
        }
        throw new Error('Error al cargar el pedido');
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error('Respuesta inválida del servidor');
      }

      setPedido(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setPedido(null);
    } finally {
      setIsLoading(false);
    }
  }, [pedidoId, token]);

  useEffect(() => {
    fetchPedido();
  }, [fetchPedido]);

  const refetch = useCallback(async () => {
    await fetchPedido();
  }, [fetchPedido]);

  return {
    pedido,
    isLoading,
    error,
    refetch,
  };
}
