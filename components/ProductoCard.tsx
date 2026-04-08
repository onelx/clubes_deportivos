'use client';

import Link from 'next/link';
import { Producto } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductoCardProps {
  producto: Producto;
  clubSlug: string;
  onAddToCart?: (productoId: string) => void;
}

export function ProductoCard({ producto, clubSlug, onAddToCart }: ProductoCardProps) {
  const imagenPrincipal = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes[0] 
    : '/placeholder-product.jpg';

  const precioFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(producto.precio_base);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(producto.id);
    }
  };

  return (
    <Link href={`/${clubSlug}/productos/${producto.id}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <CardContent className="p-0 flex-grow">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={imagenPrincipal}
              alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {!producto.activo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg">
                  No Disponible
                </Badge>
              </div>
            )}
            {producto.activo && (
              <Badge
                className="absolute top-3 right-3 bg-white/90 text-gray-900 hover:bg-white"
              >
                Nuevo
              </Badge>
            )}
          </div>
          <div className="p-4">
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {producto.categoria}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {producto.nombre}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {producto.descripcion}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {precioFormateado}
            </span>
            <span className="text-xs text-gray-500">
              + envío
            </span>
          </div>
          {producto.activo && onAddToCart && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Agregar
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
