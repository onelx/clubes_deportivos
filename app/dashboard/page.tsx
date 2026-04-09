'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: 'Ventas del Mes',
      value: '$12,450',
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Pedidos Totales',
      value: '156',
      icon: ShoppingBag,
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'Productos Activos',
      value: '24',
      icon: Package,
      trend: '+3',
      trendUp: true
    },
    {
      title: 'Comisión Ganada',
      value: '$2,890',
      icon: TrendingUp,
      trend: '+15.3%',
      trendUp: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido al panel de administración
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs mt-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend} desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">Pedido #{1000 + i}</p>
                      <p className="text-sm text-gray-500">Cliente {i}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(Math.random() * 200 + 50).toFixed(2)}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                      <div>
                        <p className="font-medium">Producto {i}</p>
                        <p className="text-sm text-gray-500">{Math.floor(Math.random() * 50 + 10)} unidades</p>
                      </div>
                    </div>
                    <p className="font-medium">${(Math.random() * 100 + 50).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
