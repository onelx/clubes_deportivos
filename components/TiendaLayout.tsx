"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CarritoDrawer } from "@/components/CarritoDrawer";
import type { Club } from "@/types";

interface TiendaLayoutProps {
  club: Club;
  children: React.ReactNode;
}

// Layout principal de la tienda con branding dinámico del club
export function TiendaLayout({ club, children }: TiendaLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());

  // Aplicamos los colores del club como variables CSS
  const clubStyles = {
    "--club-primary": club.color_primario,
    "--club-secondary": club.color_secundario,
  } as React.CSSProperties;

  return (
    <div style={clubStyles} className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y nombre del club */}
            <Link href={`/${club.slug}`} className="flex items-center gap-3">
              {club.logo_url ? (
                <Image
                  src={club.logo_url}
                  alt={club.nombre}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: club.color_primario }}
                >
                  {club.nombre.charAt(0)}
                </div>
              )}
              <span className="font-bold text-xl hidden sm:block">{club.nombre}</span>
            </Link>

            {/* Navegación desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href={`/${club.slug}`} 
                className="text-gray-600 hover:text-gray-900"
              >
                Inicio
              </Link>
              <Link 
                href={`/${club.slug}/productos`} 
                className="text-gray-600 hover:text-gray-900"
              >
                Productos
              </Link>
              <Link 
                href={`/${club.slug}/contacto`} 
                className="text-gray-600 hover:text-gray-900"
              >
                Contacto
              </Link>
            </div>

            {/* Carrito y menú móvil */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-club-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link 
                  href={`/${club.slug}`} 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  href={`/${club.slug}/productos`} 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link 
                  href={`/${club.slug}/contacto`} 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{club.nombre}</h3>
              <p className="text-gray-400">
                Tienda oficial del club. Todos los productos son fabricados bajo demanda.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href={`/${club.slug}`} className="hover:text-white">Inicio</Link></li>
                <li><Link href={`/${club.slug}/productos`} className="hover:text-white">Productos</Link></li>
                <li><Link href={`/${club.slug}/contacto`} className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/envios" className="hover:text-white">Envíos</Link></li>
                <li><Link href="/devoluciones" className="hover:text-white">Devoluciones</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2024 {club.nombre}. Powered by ClubStores.</p>
          </div>
        </div>
      </footer>

      {/* Drawer del carrito */}
      <CarritoDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        clubSlug={club.slug}
      />
    </div>
  );
}
