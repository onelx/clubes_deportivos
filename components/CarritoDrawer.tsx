'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CarritoDrawerProps {
  clubSlug: string;
  clubColorPrimario?: string;
}

export function CarritoDrawer({ clubSlug, clubColorPrimario }: CarritoDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(precio);
  };

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const total = getTotalPrice();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          style={{
            borderColor: clubColorPrimario,
            color: clubColorPrimario,
          }}
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ backgroundColor: clubColorPrimario }}
            >
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-500 mb-4">Agrega productos para comenzar tu compra</p>
            <Link href={`/${clubSlug}/productos`}>
              <Button
                style={{
                  backgroundColor: clubColorPrimario,
                  color: 'white',
                }}
              >
                Ver Productos
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map(item => (
                  <div key={item.variante_id} className="flex gap-4 pb-4 border-b">
                    <img
                      src={item.imagen || '/placeholder-product.png'}
                      alt={item.nombre_producto}
                      className="w-20 h-20 object-cover rounded-md bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">
                        {item.nombre_producto}
                      </h4>
                      <div className="text-xs text-gray-600 space-y-0.5">
                        {item.talla && <p>Talla: {item.talla}</p>}
                        {item.color && (
                          <p className="flex items-center gap-1">
                            Color:
                            <span
                              className="inline-block w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.color}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold mt-1">
                        {formatearPrecio(item.precio_unitario)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeItem(item.variante_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.variante_id, Math.max(1, item.cantidad - 1))
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.cantidad}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.variante_id, item.cantidad + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold" style={{ color: clubColorPrimario }}>
                  {formatearPrecio(total)}
                </span>
              </div>

              <Link href={`/${clubSlug}/checkout`} className="block">
                <Button
                  size="lg"
                  className="w-full"
                  style={{
                    backgroundColor: clubColorPrimario,
                    color: 'white',
                  }}
                >
                  Proceder al Checkout
                </Button>
              </Link>

              <Link href={`/${clubSlug}/productos`}>
                <Button variant="outline" className="w-full">
                  Seguir Comprando
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
