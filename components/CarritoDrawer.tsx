'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function CarritoDrawer() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => {
      setIsOpen(true);
    };

    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  const totalFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(total);

  const handleCheckout = () => {
    setIsOpen(false);
    const clubSlug = window.location.pathname.split('/')[1];
    router.push(`/${clubSlug}/checkout`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 
              ? 'Tu carrito está vacío' 
              : `${items.length} ${items.length === 1 ? 'producto' : 'productos'} en tu carrito`
            }
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Button onClick={() => setIsOpen(false)}>
                Seguir comprando
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const precioFormateado = new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(item.precio_unitario);

                  const subtotalFormateado = new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(item.subtotal);

                  return (
                    <div key={`${item.producto_id}-${item.variante_id}`} className="flex gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.producto.imagen}
                          alt={item.producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.producto.nombre}
                        </h4>
                        
                        <div className="flex gap-2 mt-1 text-xs text-gray-600">
                          {item.variante.talla && (
                            <span>Talla: {item.variante.talla}</span>
                          )}
                          {item.variante.color && (
                            <span>Color: {item.variante.color}</span>
                          )}
                        </div>

                        <p className="text-sm font-medium mt-1">
                          {precioFormateado}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.producto_id, item.variante_id, Math.max(1, item.cantidad - 1))}
                            disabled={item.cantidad <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.cantidad}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.producto_id, item.variante_id, Math.min(99, item.cantidad + 1))}
                            disabled={item.cantidad >= 99}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.producto_id, item.variante_id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {subtotalFormateado}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {totalFormateado}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar compra
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Seguir comprando
                </Button>

                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      clearCart();
                      setIsOpen(false);
                    }}
                  >
                    Vaciar carrito
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
