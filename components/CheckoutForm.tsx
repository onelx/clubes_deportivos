'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CheckoutFormData {
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
}

interface CheckoutFormProps {
  clubId: string;
  clubSlug: string;
  clubColorPrimario?: string;
}

export function CheckoutForm({ clubId, clubSlug, clubColorPrimario }: CheckoutFormProps) {
  const [procesando, setProcesando] = useState(false);
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(precio);
  };

  const subtotal = getTotalPrice();
  const costoEnvio = 1500;
  const total = subtotal + costoEnvio;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setProcesando(true);

      const pedidoData = {
        club_id: clubId,
        cliente_email: data.email,
        cliente_nombre: `${data.nombre} ${data.apellido}`,
        direccion_envio: {
          direccion: data.direccion,
          ciudad: data.ciudad,
          provincia: data.provincia,
          codigo_postal: data.codigo_postal,
          telefono: data.telefono,
        },
        items: items.map(item => ({
          producto_id: item.producto_id,
          variante_id: item.variante_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
        subtotal,
        costo_envio: costoEnvio,
        total,
      };

      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });

      if (!response.ok) {
        throw new Error('Error al crear sesión de pago');
      }

      const { url } = await response.json();

      clearCart();
      window.location.href = url;
    } catch (error) {
      console.error('Error en checkout:', error);
      toast({
        title: 'Error',
        description: 'No se pudo procesar el pago. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: 'El nombre es requerido' })}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                {...register('apellido', { required: 'El apellido es requerido' })}
                className={errors.apellido ? 'border-red-500' : ''}
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              type="tel"
              {...register('telefono', { required: 'El teléfono es requerido' })}
              className={errors.telefono ? 'border-red-500' : ''}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dirección de Envío</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              {...register('direccion', { required: 'La dirección es requerida' })}
              className={errors.direccion ? 'border-red-500' : ''}
              placeholder="Calle, número, piso, depto"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input
                id="ciudad"
                {...register('ciudad', { required: 'La ciudad es requerida' })}
                className={errors.ciudad ? 'border-red-500' : ''}
              />
              {errors.ciudad && (
                <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="provincia">Provincia *</Label>
              <Input
                id="provincia"
                {...register('provincia', { required: 'La provincia es requerida' })}
                className={errors.provincia ? 'border-red-500' : ''}
              />
              {errors.provincia && (
                <p className="text-red-500 text-sm mt-1">{errors.provincia.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="codigo_postal">Código Postal *</Label>
            <Input
              id="codigo_postal"
              {...register('codigo_postal', { required: 'El código postal es requerido' })}
              className={errors.codigo_postal ? 'border-red-500' : ''}
            />
            {errors.codigo_postal && (
              <p className="text-red-500 text-sm mt-1">{errors.codigo_postal.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map(item => (
            <div key={item.variante_id} className="flex justify-between text-sm">
              <span>
                {item.cantidad}x {item.nombre_producto}
                {item.talla && ` - ${item.talla}`}
                {item.color && ` - ${item.color}`}
              </span>
              <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
            </div>
          ))}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span>{formatearPrecio(costoEnvio)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span style={{ color: clubColorPrimario }}>{formatearPrecio(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={procesando || items.length === 0}
        style={{
          backgroundColor: clubColorPrimario,
          color: 'white',
        }}
      >
        {procesando ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Procesando...
          </>
        ) : (
          'Proceder al Pago'
        )}
      </Button>
    </form>
  );
}
