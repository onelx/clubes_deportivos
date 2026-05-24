'use client';

import { useDashboardImpersonation } from '@/contexts/DashboardImpersonation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Devuelve el club_id efectivo para las páginas del dashboard.
 * Si el superadmin está impersonando un club, devuelve ese club_id.
 * Si no, devuelve el club_id del usuario autenticado.
 */
export function useDashboardClub() {
  const { usuarioClub } = useAuth();
  const { effectiveClubId, isImpersonating } = useDashboardImpersonation();

  if (isImpersonating && effectiveClubId) {
    return {
      club_id: effectiveClubId,
      isImpersonating,
    };
  }

  return {
    club_id: usuarioClub?.club_id ?? null,
    isImpersonating: false,
  };
}
