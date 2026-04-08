import { useState, useEffect } from 'react'
import { Club } from '@/types'
import { createClient } from '@/lib/supabase/client'

// Hook para obtener datos del club desde el slug
export function useClub(slug: string | null) {
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchClub = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('slug', slug)
          .eq('activo', true)
          .single()

        if (error) throw error
        setClub(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el club')
      } finally {
        setLoading(false)
      }
    }

    fetchClub()
  }, [slug])

  return { club, loading, error }
}
