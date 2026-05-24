'use client';

import { createContext, useContext } from 'react';

interface DashboardImpersonationContextValue {
  /** club_id efectivo: el real del usuario o el impersonado por el superadmin */
  effectiveClubId: string | null;
  /** true cuando el superadmin está viendo un club ajeno */
  isImpersonating: boolean;
  /** nombre del club impersonado (para el banner) */
  impersonatedClubName: string | null;
}

export const DashboardImpersonationContext =
  createContext<DashboardImpersonationContextValue>({
    effectiveClubId: null,
    isImpersonating: false,
    impersonatedClubName: null,
  });

export function useDashboardImpersonation() {
  return useContext(DashboardImpersonationContext);
}
