'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useClub } from '@/hooks/useClub';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CarritoDrawer } from '@/components/CarritoDrawer';

interface TiendaLayoutProps {
  children: ReactNode;
  clubSlug: string;
}

export function TiendaLayout({ children, clubSlug }: TiendaLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const { items } = useCart();
  const { club, isLoading } = useClub(clubSlug);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  const colorPrimario = club?.color_primario || '#1e40af';
  const colorSecundario = club?.color_secundario || '#3b82f6';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Club no encontrado</h1>
          <p className="text-gray-600">El club que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        :root {
          --club-primary: ${colorPrimario};
          --club-secondary: ${colorSecundario};
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y nombre */}
            <Link href={`/${clubSlug}`} className="flex items-center space-x-3">
              {club.logo_url && (
                <img
                  src={club.logo_url}
                  alt={club.nombre}
                  className="h-10 w-10 object-contain"
                />
              )}
              <span className="text-xl font-bold" style={{ color: colorPrimario }}>
                {club.nombre}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href={`/${clubSlug}`}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Productos
              </Link>
              <Link
                href={`/${clubSlug}/sobre-nosotros`}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link
                href={`/${clubSlug}/contacto`}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Contacto
              </Link>
            </nav>

            {/* Carrito */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCarritoOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-semibold"
                    style={{ backgroundColor: colorPrimario }}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link
                      href={`/${clubSlug}`}
                      className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Productos
                    </Link>
                    <Link
                      href={`/${clubSlug}/sobre-nosotros`}
                      className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sobre Nosotros
                    </Link>
                    <Link
                      href={`/${clubSlug}/contacto`}
                      className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contacto
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div
        className="py-8 px-4 sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(135deg, ${colorPrimario} 0%, ${colorSecundario} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Tienda Oficial {club.nombre}
          </h1>
          <p className="text-white/90 text-lg">
            Productos exclusivos para verdaderos fanáticos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{club.nombre}</h3>
              <p className="text-gray-400">
                Tienda oficial con productos de la más alta calidad.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${clubSlug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${clubSlug}/sobre-nosotros`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${clubSlug}/contacto`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Información</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Envíos a todo el país</li>
                <li>Producción bajo demanda</li>
                <li>Calidad garantizada</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {club.nombre}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Carrito Drawer */}
      <CarritoDrawer
        open={carritoOpen}
        onOpenChange={setCarritoOpen}
        clubSlug={clubSlug}
      />
    </div>
  );
}
