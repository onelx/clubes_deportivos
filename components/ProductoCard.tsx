'use client';

import Link from 'next/link';
import { Producto } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface ProductoCardProps {
  producto: Producto;
  clubSlug: string;
  clubColorPrimario?: string;
}

export function ProductoCard({ producto, clubSlug, clubColorPrimario }: ProductoCardProps) {
  const imagenPrincipal = producto.imagenes?.[0] || '/placeholder-product.png';
  const tieneTallas = producto.variantes?.some(v => v.talla);
  const tieneColores = producto.variantes?.some(v => v.color);
  const variantesActivas = producto.variantes?.filter(v => v.activo) || [];

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(precio);
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/${clubSlug}/productos/${producto.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imagenPrincipal}
            alt={producto.nombre}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {!producto.activo && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              No Disponible
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/${clubSlug}/productos/${producto.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:underline line-clamp-2">
            {producto.nombre}
          </h3>
        </Link>

        {producto.categoria && (
          <p className="text-sm text-gray-500 mb-2">{producto.categoria}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold" style={{ color: clubColorPrimario }}>
            {formatearPrecio(producto.precio_base)}
          </span>
        </div>

        {(tieneTallas || tieneColores) && (
          <div className="flex gap-2 mb-3 text-xs text-gray-600">
            {tieneTallas && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {variantesActivas.length} tallas
              </span>
            )}
            {tieneColores && (
              <div className="flex items-center gap-1">
                {Array.from(new Set(variantesActivas.map(v => v.color).filter(Boolean)))
                  .slice(0, 4)
                  .map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        <Link href={`/${clubSlug}/productos/${producto.id}`}>
          <Button
            className="w-full"
            disabled={!producto.activo || variantesActivas.length === 0}
            style={{
              backgroundColor: clubColorPrimario,
              color: 'white',
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ver Producto
          </Button>
        </Link>
      </div>
    </div>
  );
}
