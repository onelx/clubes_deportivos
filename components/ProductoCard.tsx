'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Producto, VarianteProducto } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductoCardProps {
  producto: Producto;
  clubSlug: string;
  variantes?: VarianteProducto[];
}

export function ProductoCard({ producto, clubSlug, variantes = [] }: ProductoCardProps) {
  const imagenes = producto.imagenes as string[] || [];
  const imagenPrincipal = imagenes[0] || '/placeholder-product.jpg';
  
  const tallasDisponibles = [...new Set(variantes.filter(v => v.activo && v.talla).map(v => v.talla))];
  const coloresDisponibles = [...new Set(variantes.filter(v => v.activo && v.color).map(v => v.color))];

  return (
    <Link href={`/tienda/${clubSlug}/producto/${producto.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imagenPrincipal}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!producto.activo && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded">
                No disponible
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {producto.nombre}
          </h3>
          
          {producto.categoria && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {producto.categoria}
            </span>
          )}
          
          <div className="mt-2">
            <span className="text-xl font-bold text-primary">
              {formatCurrency(producto.precio_base)}
            </span>
          </div>

          {tallasDisponibles.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">Tallas: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {tallasDisponibles.slice(0, 5).map((talla) => (
                  <span 
                    key={talla} 
                    className="text-xs px-2 py-0.5 bg-secondary rounded"
                  >
                    {talla}
                  </span>
                ))}
                {tallasDisponibles.length > 5 && (
                  <span className="text-xs px-2 py-0.5 text-muted-foreground">
                    +{tallasDisponibles.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {coloresDisponibles.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Colores: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {coloresDisponibles.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {coloresDisponibles.length > 4 && (
                  <span className="text-xs flex items-center text-muted-foreground">
                    +{coloresDisponibles.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
