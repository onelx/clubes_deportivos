'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductoDetalleProps {
  producto: Producto;
  variantes: VarianteProducto[];
}

export function ProductoDetalle({ producto, variantes }: ProductoDetalleProps) {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>('');
  const [colorSeleccionado, setColorSeleccionado] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  const { addItem } = useCart();

  const imagenes = producto.imagenes || ['/placeholder-product.jpg'];
  const tallas = [...new Set(variantes.filter(v => v.activo).map(v => v.talla))];
  const colores = [...new Set(variantes.filter(v => v.activo).map(v => v.color))];

  const varianteSeleccionada = variantes.find(
    v => v.talla === tallaSeleccionada && v.color === colorSeleccionado && v.activo
  );

  const precioFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(producto.precio_base);

  const handleAddToCart = () => {
    if (!tallaSeleccionada || !colorSeleccionado) {
      toast.error('Por favor selecciona talla y color');
      return;
    }

    if (!varianteSeleccionada) {
      toast.error('La variante seleccionada no está disponible');
      return;
    }

    addItem({
      producto_id: producto.id,
      variante_id: varianteSeleccionada.id,
      cantidad,
      precio_unitario: producto.precio_base,
    });

    toast.success('Producto agregado al carrito', {
      icon: <Check className="h-4 w-4" />,
    });
  };

  const incrementar = () => {
    if (cantidad < 10) setCantidad(cantidad + 1);
  };

  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Galería de imágenes */}
      <div className="space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={imagenes[imagenSeleccionada]}
            alt={`${producto.nombre} - imagen ${imagenSeleccionada + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        {imagenes.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {imagenes.map((imagen, index) => (
              <button
                key={index}
                onClick={() => setImagenSeleccionada(index)}
                className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-all ${
                  imagenSeleccionada === index
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={imagen}
                  alt={`${producto.nombre} - miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="space-y-6">
        <div>
          <Badge variant="outline" className="mb-3">
            {producto.categoria}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {producto.nombre}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {producto.descripcion}
          </p>
        </div>

        <div className="flex items-baseline space-x-4">
          <span className="text-4xl font-bold text-gray-900">
            {precioFormateado}
          </span>
          <span className="text-gray-500">+ envío</span>
        </div>

        <Card className="p-6 space-y-6 bg-gray-50">
          {/* Selector de talla */}
          {tallas.length > 0 && (
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Talla
              </Label>
              <RadioGroup
                value={tallaSeleccionada}
                onValueChange={setTallaSeleccionada}
                className="grid grid-cols-4 gap-3"
              >
                {tallas.map(talla => (
                  <div key={talla}>
                    <RadioGroupItem
                      value={talla}
                      id={`talla-${talla}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`talla-${talla}`}
                      className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-3 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all font-medium"
                    >
                      {talla}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Selector de color */}
          {colores.length > 0 && (
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Color
              </Label>
              <RadioGroup
                value={colorSeleccionado}
                onValueChange={setColorSeleccionado}
                className="grid grid-cols-3 gap-3"
              >
                {colores.map(color => (
                  <div key={color}>
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all font-medium text-sm"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Selector de cantidad */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Cantidad
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementar}
                disabled={cantidad <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-semibold w-12 text-center">
                {cantidad}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementar}
                disabled={cantidad >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Button
          size="lg"
          className="w-full text-lg py-6"
          onClick={handleAddToCart}
          disabled={!producto.activo || !tallaSeleccionada || !colorSeleccionado}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {producto.activo ? 'Agregar al carrito' : 'No disponible'}
        </Button>

        {varianteSeleccionada && (
          <p className="text-sm text-gray-600 text-center">
            SKU: {varianteSeleccionada.sku}
          </p>
        )}

        <Card className="p-4 bg-blue-50 border-blue-200">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Producción bajo demanda - 7 a 10 días hábiles</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Envíos a todo el país</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Calidad premium garantizada</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
