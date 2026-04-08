'use client';

import { Pedido } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Truck, Package, CreditCard } from 'lucide-react';

interface PedidoTimelineProps {
  pedido: Pedido;
}

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-500' },
  pagado: { label: 'Pagado', color: 'bg-green-500' },
  produccion: { label: 'En Producción', color: 'bg-blue-500' },
  enviado: { label: 'Enviado', color: 'bg-purple-500' },
  entregado: { label: 'Entregado', color: 'bg-gray-500' },
  cancelado: { label: 'Cancelado', color: 'bg-red-500' },
};

export function PedidoTimeline({ pedido }: PedidoTimelineProps) {
  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return null;
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(fecha));
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(precio);
  };

  const estadoActual = ESTADOS[pedido.estado as keyof typeof ESTADOS] || ESTADOS.pendiente;

  const etapas = [
    {
      id: 'pagado',
      label: 'Pago Confirmado',
      icono: CreditCard,
      completado: ['pagado', 'produccion', 'enviado', 'entregado'].includes(pedido.estado),
      fecha: pedido.paid_at,
    },
    {
      id: 'produccion',
      label: 'En Producción',
      icono: Package,
      completado: ['produccion', 'enviado', 'entregado'].includes(pedido.estado),
      fecha: null,
    },
    {
      id: 'enviado',
      label: 'Enviado',
      icono: Truck,
      completado: ['enviado', 'entregado'].includes(pedido.estado),
      fecha: pedido.shipped_at,
    },
    {
      id: 'entregado',
      label: 'Entregado',
      icono: CheckCircle2,
      completado: pedido.estado === 'entregado',
      fecha: null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Estado del Pedido #{pedido.numero_pedido}</CardTitle>
          <Badge className={estadoActual.color}>{estadoActual.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Cliente:</span> {pedido.cliente_nombre}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Email:</span> {pedido.cliente_email}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Total:</span> {formatearPrecio(pedido.total)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Fecha:</span> {formatearFecha(pedido.created_at)}
          </p>
        </div>

        {pedido.estado !== 'cancelado' && (
          <div className="space-y-4">
            {etapas.map((etapa, index) => {
              const Icono = etapa.icono;
              return (
                <div key={etapa.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-2 ${
                        etapa.completado
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icono className="h-5 w-5" />
                    </div>
                    {index < etapas.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          etapa.completado ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p
                      className={`font-semibold ${
                        etapa.completado ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {etapa.label}
                    </p>
                    {etapa.fecha && (
                      <p className="text-sm text-gray-500">{formatearFecha(etapa.fecha)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pedido.tracking_number && (
          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-1">Número de Seguimiento</p>
            <p className="text-sm text-gray-600 font-mono">{pedido.tracking_number}</p>
          </div>
        )}

        {pedido.direccion_envio && (
          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-2">Dirección de Envío</p>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p>{pedido.direccion_envio.direccion}</p>
              <p>
                {pedido.direccion_envio.ciudad}, {pedido.direccion_envio.provincia}
              </p>
              <p>CP: {pedido.direccion_envio.codigo_postal}</p>
              <p>Tel: {pedido.direccion_envio.telefono}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
