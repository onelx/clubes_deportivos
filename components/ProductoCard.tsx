'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Producto } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductoCardProps {
  producto: Producto;
  clubSlug: string;
}

export function ProductoCard({ producto, clubSlug }: ProductoCardProps) {
  const imagenPrincipal = Array.isArray(producto.imagenes) && producto.imagenes.length > 0 
    ? producto.imagenes[0] 
    : '/placeholder-product.png';

  const variantesDisponibles = producto.variantes?.filter(v => v.activo) || [];
  const coloresUnicos = [...new Set(variantesDisponibles.map(v => v.color))];
  const tallasUnicas = [...new Set(variantesDisponibles.map(v => v.talla))];

  return (
    <Link href={`/${clubSlug}/productos/${producto.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <CardContent className="p-0">
          {/* Imagen del producto */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={imagenPrincipal}
              alt={producto.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Badge si el producto es nuevo (creado hace menos de 7 días) */}
            {producto.created_at && 
             new Date().getTime() - new Date(producto.created_at).getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                Nuevo
              </Badge>
            )}

            {/* Badge si está inactivo (solo visible en dashboard) */}
            {!producto.activo && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                Inactivo
              </Badge>
            )}
          </div>

          {/* Información del producto */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {producto.nombre}
            </h3>
            
            {producto.categoria && (
              <p className="text-sm text-muted-foreground mb-2">
                {producto.categoria}
              </p>
            )}

            {producto.descripcion && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {producto.descripcion}
              </p>
            )}

            {/* Variantes disponibles */}
            <div className="flex flex-wrap gap-2 mb-3">
              {coloresUnicos.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Colores:</span>
                  <div className="flex gap-1">
                    {coloresUnicos.slice(0, 4).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {coloresUnicos.length > 4 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        +{coloresUnicos.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {tallasUnicas.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs text-muted-foreground">Tallas:</span>
                {tallasUnicas.slice(0, 5).map((talla, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {talla}
                  </Badge>
                ))}
                {tallasUnicas.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{tallasUnicas.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(producto.precio_base)}
              </p>
              {producto.costo_produccion > 0 && (
                <p className="text-xs text-muted-foreground">
                  Costo: {formatPrice(producto.costo_produccion)}
                </p>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {variantesDisponibles.length} variante{variantesDisponibles.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
