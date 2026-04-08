'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface CarritoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, cantidad: number) => void;
  onRemoveItem: (itemId: string) => void;
  clubSlug: string;
}

export function CarritoDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  clubSlug,
}: CarritoDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0);
  const itemsCount = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-xl transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              Carrito ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Tu carrito está vacío</h3>
              <p className="text-muted-foreground mt-2">
                Agregá productos para comenzar tu compra
              </p>
              <Button className="mt-6" onClick={onClose}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const imagenes = (item.producto?.imagenes as string[]) || [];
                const imagen = imagenes[0] || '/placeholder-product.jpg';
                
                return (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={imagen}
                        alt={item.producto?.nombre || 'Producto'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {item.producto?.nombre}
                      </h4>
                      
                      {(item.variante?.talla || item.variante?.color) && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.variante?.talla && `Talla: ${item.variante.talla}`}
                          {item.variante?.talla && item.variante?.color && ' | '}
                          {item.variante?.color && `Color: ${item.variante.color}`}
                        </p>
                      )}
                      
                      <p className="font-semibold text-primary mt-1">
                        {formatCurrency(item.precio_unitario)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.cantidad}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-muted-foreground">Calcular en checkout</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total estimado</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            
            <Link href={`/tienda/${clubSlug}/checkout`} onClick={onClose}>
              <Button className="w-full h-12 text-lg">
                Finalizar compra
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Seguir comprando
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
