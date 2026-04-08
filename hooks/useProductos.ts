"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Producto } from '@/types';

interface UseProductosOptions {
  clubSlug?: string;
  categoria?: string;
  activo?: boolean;
}

interface UseProductosReturn {
  productos: Producto[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProductos(options: UseProductosOptions = {}): UseProductosReturn {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProductos = useCallback(async () => {
    if (!options.clubSlug) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.categoria) params.append('categoria', options.categoria);
      if (options.activo !== undefined) params.append('activo', String(options.activo));

      const queryString = params.toString();
      const url = `/api/clubs/${options.clubSlug}/productos${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      setProductos(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      setProductos([]);
    } finally {
      setIsLoading(false);
    }
  }, [options.clubSlug, options.categoria, options.activo]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return {
    productos,
    isLoading,
    error,
    refetch: fetchProductos,
  };
}
