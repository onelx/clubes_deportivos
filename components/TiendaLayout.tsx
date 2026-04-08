'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Club } from '@/types';
import { useState } from 'react';

interface TiendaLayoutProps {
  club: Club;
  children: React.ReactNode;
  cartItemsCount?: number;
  onCartClick?: () => void;
}

export function TiendaLayout({ 
  club, 
  children, 
  cartItemsCount = 0,
  onCartClick 
}: TiendaLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryColor = club.color_primario || '#1a1a2e';
  const secondaryColor = club.color_secundario || '#16213e';

  return (
    <div className="min-h-screen flex flex-col">
      <header 
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href={`/tienda/${club.slug}`} className="flex items-center gap-3">
              {club.logo_url ? (
                <Image
                  src={club.logo_url}
                  alt={club.nombre}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {club.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-white font-semibold text-lg hidden sm:block">
                {club.nombre}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href={`/tienda/${club.slug}`}
                className="text-white/90 hover:text-white transition-colors"
              >
                Inicio
              </Link>
              <Link 
                href={`/tienda/${club.slug}/productos`}
                className="text-white/90 hover:text-white transition-colors"
              >
                Productos
              </Link>
              <Link 
                href={`/tienda/${club.slug}/contacto`}
                className="text-white/90 hover:text-white transition-colors"
              >
                Contacto
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <Link 
                  href={`/tienda/${club.slug}`}
                  className="text-white/90 hover:text-white py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  href={`/tienda/${club.slug}/productos`}
                  className="text-white/90 hover:text-white py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link 
                  href={`/tienda/${club.slug}/contacto`}
                  className="text-white/90 hover:text-white py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer 
        className="py-8 text-white/80"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {club.logo_url ? (
                  <Image
                    src={club.logo_url}
                    alt={club.nombre}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    {club.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold">{club.nombre}</span>
              </div>
              <p className="text-sm text-white/60">
                Tienda oficial del club. Productos de calidad fabricados bajo demanda.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/tienda/${club.slug}/productos`} className="hover:text-white transition-colors">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href={`/tienda/${club.slug}/seguimiento`} className="hover:text-white transition-colors">
                    Seguir pedido
                  </Link>
                </li>
                <li>
                  <Link href={`/tienda/${club.slug}/contacto`} className="hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terminos" className="hover:text-white transition-colors">
                    Términos y condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-white transition-colors">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/devoluciones" className="hover:text-white transition-colors">
                    Devoluciones
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">
            <p>© {new Date().getFullYear()} {club.nombre}. Todos los derechos reservados.</p>
            <p className="mt-1">Powered by IdeaForge</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
