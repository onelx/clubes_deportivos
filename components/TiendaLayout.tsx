'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { Club } from '@/types';

interface TiendaLayoutProps {
  children: ReactNode;
  club: Club;
}

export function TiendaLayout({ children, club }: TiendaLayoutProps) {
  const { items } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  const estilosBranding = {
    '--color-primary': club.color_primario,
    '--color-secondary': club.color_secundario,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gray-50" style={estilosBranding}>
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${club.slug}`} className="flex items-center gap-3">
              {club.logo_url && (
                <img
                  src={club.logo_url}
                  alt={club.nombre}
                  className="h-12 w-12 object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold" style={{ color: club.color_primario }}>
                  {club.nombre}
                </h1>
                <p className="text-sm text-gray-600">Tienda Oficial</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href={`/${club.slug}`}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Inicio
              </Link>
              <Link
                href={`/${club.slug}/productos`}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Productos
              </Link>
              <Link
                href={`/${club.slug}/contacto`}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Contacto
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href={`/${club.slug}/carrito`}>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  style={{
                    borderColor: club.color_primario,
                    color: club.color_primario,
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: club.color_primario }}
                    >
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link
                      href={`/${club.slug}`}
                      className="text-lg font-medium hover:underline"
                    >
                      Inicio
                    </Link>
                    <Link
                      href={`/${club.slug}/productos`}
                      className="text-lg font-medium hover:underline"
                    >
                      Productos
                    </Link>
                    <Link
                      href={`/${club.slug}/contacto`}
                      className="text-lg font-medium hover:underline"
                    >
                      Contacto
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4" style={{ color: club.color_primario }}>
                {club.nombre}
              </h3>
              <p className="text-gray-600 text-sm">
                Tienda oficial con productos de alta calidad fabricados bajo demanda.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href={`/${club.slug}`} className="hover:underline">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href={`/${club.slug}/productos`} className="hover:underline">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href={`/${club.slug}/seguimiento`} className="hover:underline">
                    Seguimiento de Pedido
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href={`/${club.slug}/contacto`} className="hover:underline">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="hover:underline">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:underline">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {club.nombre}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
