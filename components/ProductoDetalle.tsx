'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Producto, VarianteProducto, CartItem } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface ProductoDetalleProps {
  producto: Producto;
  variantes: VarianteProducto[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

export function ProductoDetalle({ producto, variantes, onAddToCart }: ProductoDetalleProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

  const imagenes = (producto.imagenes as string[]) || [];
  
  const tallasDisponibles = useMemo(() => {
    return [...new Set(variantes.filter(v => v.activo && v.talla).map(v => v.talla!))];
  }, [variantes]);

  const coloresDisponibles = useMemo(() => {
    let filteredVariantes = variantes.filter(v => v.activo);
    if (selectedTalla) {
      filteredVariantes = filteredVariantes.filter(v => v.talla === selectedTalla);
    }
    return [...new Set(filteredVariantes.filter(v => v.color).map(v => v.color!))];
  }, [variantes, selectedTalla]);

  const selectedVariante = useMemo(() => {
    if (!selectedTalla && !selectedColor) return null;
    return variantes.find(v => 
      v.activo &&
      (!selectedTalla || v.talla === selectedTalla) &&
      (!selectedColor || v.color === selectedColor)
    ) || null;
  }, [variantes, selectedTalla, selectedColor]);

  const canAddToCart = useMemo(() => {
    if (tallasDisponibles.length > 0 && !selectedTalla) return false;
    if (coloresDisponibles.length > 0 && !selectedColor) return false;
    return true;
  }, [tallasDisponibles, coloresDisponibles, selectedTalla, selectedColor]);

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    onAddToCart({
      producto_id: producto.id,
      producto,
      variante_id: selectedVariante?.id || null,
      variante: selectedVariante || undefined,
      cantidad,
      precio_unitario: producto.precio_base,
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {imagenes.length > 0 ? (
            <Image
              src={imagenes[selectedImageIndex]}
              alt={producto.nombre}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
          
          {imagenes.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {imagenes.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imagenes.map((img, index) => (
              <button
                key={index}
                className={cn(
                  "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors",
                  index === selectedImageIndex ? "border-primary" : "border-transparent"
                )}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={img}
                  alt={`${producto.nombre} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          {producto.categoria && (
            <span className="text-sm text-muted-foreground uppercase tracking-wide">
              {producto.categoria}
            </span>
          )}
          <h1 className="text-3xl font-bold mt-1">{producto.nombre}</h1>
          <p className="text-3xl font-bold text-primary mt-4">
            {formatCurrency(producto.precio_base)}
          </p>
        </div>

        {producto.descripcion && (
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {producto.descripcion}
            </p>
          </div>
        )}

        <Card>
          <CardContent className="p-6 space-y-6">
            {tallasDisponibles.length > 0 && (
              <div>
                <Label className="text-base font-semibold">Talla</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tallasDisponibles.map((talla) => (
                    <Button
                      key={talla}
                      variant={selectedTalla === talla ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTalla(talla)}
                      className="min-w-[48px]"
                    >
                      {talla}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {coloresDisponibles.length > 0 && (
              <div>
                <Label className="text-base font-semibold">Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {coloresDisponibles.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === color 
                          ? "border-primary ring-2 ring-primary ring-offset-2" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Seleccionado: {selectedColor}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label className="text-base font-semibold">Cantidad</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {cantidad}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidad(cantidad + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(producto.precio_base * cantidad)}
                </span>
              </div>
              
              <Button 
                className="w-full h-12 text-lg"
                onClick={handleAddToCart}
                disabled={!canAddToCart || !producto.activo}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al carrito
              </Button>
              
              {!canAddToCart && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Seleccioná {!selectedTalla && tallasDisponibles.length > 0 ? 'una talla' : ''}
                  {!selectedTalla && tallasDisponibles.length > 0 && !selectedColor && coloresDisponibles.length > 0 ? ' y ' : ''}
                  {!selectedColor && coloresDisponibles.length > 0 ? 'un color' : ''}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedVariante?.sku && (
          <p className="text-sm text-muted-foreground">
            SKU: {selectedVariante.sku}
          </p>
        )}
      </div>
    </div>
  );
}
