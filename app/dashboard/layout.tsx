'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Loader2, LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, ArrowLeft } from 'lucide-react';
import { DashboardImpersonationContext } from '@/contexts/DashboardImpersonation';
import type { Club } from '@/types';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/productos', label: 'Productos', icon: Package },
  { href: '/dashboard/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, usuarioClub, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createClient(), []);

  const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;
  const asClubId = searchParams.get('as'); // ?as={club_id}
  const isImpersonating = isSuperAdmin && !!asClubId;

  const [club, setClub] = useState<Club | null>(null);
  const [impersonatedClub, setImpersonatedClub] = useState<Club | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch el club real del usuario logueado (para el sidebar)
  useEffect(() => {
    const clubId = isImpersonating ? asClubId : usuarioClub?.club_id;
    if (!clubId) return;

    supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single()
      .then(({ data }) => {
        if (data) {
          if (isImpersonating) {
            setImpersonatedClub(data as Club);
          } else {
            setClub(data as Club);
          }
        }
      });
  }, [usuarioClub, asClubId, isImpersonating, supabase]);

  // Fetch el club real del superadmin para el sidebar (cuando impersona)
  useEffect(() => {
    if (!isImpersonating || !usuarioClub?.club_id) return;
    // El superadmin no tiene club propio, pero si lo tuviera lo cargaríamos aquí
  }, [isImpersonating, usuarioClub]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Navega preservando ?as= si está impersonando
  const buildHref = (base: string) =>
    isImpersonating ? `${base}?as=${asClubId}` : base;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  const displayClub = isImpersonating ? impersonatedClub : club;

  return (
    <DashboardImpersonationContext.Provider
      value={{
        effectiveClubId: isImpersonating ? asClubId : (usuarioClub?.club_id ?? null),
        isImpersonating,
        impersonatedClubName: impersonatedClub?.nombre ?? null,
      }}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Banner de impersonación */}
        {isImpersonating && (
          <div className="bg-amber-400 text-amber-900 px-4 py-2 flex items-center justify-between text-sm font-medium z-50">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>
                Viendo como: <strong>{impersonatedClub?.nombre ?? 'Club'}</strong>
                {' '}— Modo superadmin (solo lectura de contexto, todas las acciones aplican al club)
              </span>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1 underline hover:text-amber-950"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al admin
            </Link>
          </div>
        )}

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-10" style={{ top: isImpersonating ? 40 : 0 }}>
            {/* Club header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: displayClub?.color_primario || '#1d4ed8' }}
                >
                  {displayClub?.logo_url ? (
                    <img src={displayClub.logo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <Store className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {displayClub?.nombre || 'Club Stores'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {isImpersonating ? 'Vista superadmin' : 'Panel Admin'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const href = buildHref(item.href);
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 space-y-1">
              {isImpersonating ? (
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors w-full"
                >
                  <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                  <span>Volver al admin</span>
                </Link>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="ml-64 flex-1 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </DashboardImpersonationContext.Provider>
  );
}
