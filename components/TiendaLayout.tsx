'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useClub } from '@/hooks/useClub';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

interface TiendaLayoutProps {
  children: ReactNode;
  clubSlug: string;
}

export function TiendaLayout({ children, clubSlug }: TiendaLayoutProps) {
  const { club, loading } = useClub(clubSlug);
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Club no encontrado</h1>
          <p className="text-gray-600">El club que buscas no existe o no está activo.</p>
        </div>
      </div>
    );
  }

  const primaryColor = club.color_primario || '#1a1a1a';
  const secondaryColor = club.color_secundario || '#f5f5f5';

  return (
    <div className="min-h-screen flex flex-col">
      <style jsx global>{`
        :root {
          --club-primary: ${primaryColor};
          --club-secondary: ${secondaryColor};
        }
      `}</style>

      {/* Header */}
      <header 
        className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        style={{ borderBottomColor: primaryColor }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo y nombre */}
            <Link href={`/${clubSlug}`} className="flex items-center gap-3">
              {club.logo_url && (
                <img 
                  src={club.logo_url} 
                  alt={club.nombre}
                  className="h-10 w-10 object-contain"
                />
              )}
              <span 
                className="text-xl font-bold hidden sm:inline"
                style={{ color: primaryColor }}
              >
                {club.nombre}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href={`/${clubSlug}`}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: primaryColor }}
              >
                Inicio
              </Link>
              <Link 
                href={`/${clubSlug}/productos`}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: primaryColor }}
              >
                Productos
              </Link>
              <Link 
                href={`/${clubSlug}/contacto`}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: primaryColor }}
              >
                Contacto
              </Link>
            </nav>

            {/* Cart Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  const event = new CustomEvent('openCart');
                  window.dispatchEvent(event);
                }}
              >
                <ShoppingCart className="h-5 w-5" style={{ color: primaryColor }} />
                {mounted && totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" style={{ color: primaryColor }} />
                ) : (
                  <Menu className="h-5 w-5" style={{ color: primaryColor }} />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link 
                  href={`/${clubSlug}`}
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: primaryColor }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  href={`/${clubSlug}/productos`}
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: primaryColor }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link 
                  href={`/${clubSlug}/contacto`}
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: primaryColor }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-auto"
        style={{ 
          borderTopColor: primaryColor,
          backgroundColor: secondaryColor 
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>
                {club.nombre}
              </h3>
              <p className="text-sm text-gray-600">
                Tienda oficial del club. Todos los productos son fabricados bajo demanda.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>
                Enlaces
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${clubSlug}`} className="text-sm text-gray-600 hover:opacity-80">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href={`/${clubSlug}/productos`} className="text-sm text-gray-600 hover:opacity-80">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href={`/${clubSlug}/contacto`} className="text-sm text-gray-600 hover:opacity-80">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>
                Información
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">
                  Envíos a todo el país
                </li>
                <li className="text-sm text-gray-600">
                  Producción bajo demanda
                </li>
                <li className="text-sm text-gray-600">
                  Pago seguro con Stripe
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} {club.nombre}. Todos los derechos reservados.</p>
            <p className="mt-1">Powered by IdeaForge Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
