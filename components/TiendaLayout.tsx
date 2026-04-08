'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { Club } from '@/types'
import { useCart } from '@/hooks/useCart'
import { CarritoDrawer } from '@/components/CarritoDrawer'

interface TiendaLayoutProps {
  club: Club
  children: React.ReactNode
}

// Layout de la tienda con branding dinámico del club
export function TiendaLayout({ club, children }: TiendaLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <div
      className="min-h-screen"
      style={{
        '--color-primary': club.color_primario,
        '--color-secondary': club.color_secundario,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y nombre del club */}
            <Link href={`/tienda/${club.slug}`} className="flex items-center gap-3">
              {club.logo_url && (
                <Image
                  src={club.logo_url}
                  alt={club.nombre}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span className="font-bold text-xl text-gray-900">
                {club.nombre}
              </span>
            </Link>

            {/* Navegación desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href={`/tienda/${club.slug}`}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Inicio
              </Link>
              <Link
                href={`/tienda/${club.slug}/productos`}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Productos
              </Link>
            </nav>

            {/* Carrito */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Menú móvil */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {menuOpen && (
            <nav className="md:hidden py-4 border-t">
              <Link
                href={`/tienda/${club.slug}`}
                className="block py-2 text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href={`/tienda/${club.slug}/productos`}
                className="block py-2 text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Productos
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {club.logo_url && (
                  <Image
                    src={club.logo_url}
                    alt={club.nombre}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <span className="font-bold text-xl">{club.nombre}</span>
              </div>
              <p className="text-gray-400">
                Tienda oficial de {club.nombre}. Productos exclusivos para socios.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href={`/tienda/${club.slug}`} className="hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href={`/tienda/${club.slug}/productos`} className="hover:text-white">
                    Productos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <p className="text-gray-400">
                ¿Tienes alguna pregunta? Contacta con tu club directamente.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>Powered by ClubShop Platform © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

      {/* Drawer del carrito */}
      <CarritoDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
