'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Producto, VarianteProducto } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductoDetalleProps {
  producto: Producto;
  onAddToCart: (varianteId: string, cantidad: number) => void;
}

export function ProductoDetalle({ producto, onAddToCart }: ProductoDetalleProps) {
  const { toast } = useToast();
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>('');
  const [colorSeleccionado, setColorSeleccionado] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  const imagenes = Array.isArray(producto.imagenes) && producto.imagenes.length > 0 
    ? producto.imagenes 
    : ['/placeholder-product.png'];

  const variantesActivas = producto.variantes?.filter(v => v.activo) || [];
  const tallasDisponibles = [...new Set(variantesActivas.map(v => v.talla))];
  const coloresDisponibles = [...new Set(variantesActivas.map(v => v.color))];

  // Filtrar colores disponibles según la talla seleccionada
  const coloresPorTalla = tallaSeleccionada
    ? [...new Set(variantesActivas.filter(v => v.talla === tallaSeleccionada).map(v => v.color))]
    : coloresDisponibles;

  // Filtrar tallas disponibles según el color seleccionado
  const tallasPorColor = colorSeleccionado
    ? [...new Set(variantesActivas.filter(v => v.color === colorSeleccionado).map(v => v.talla))]
    : tallasDisponibles;

  // Obtener la variante seleccionada
  const varianteSeleccionada = variantesActivas.find(
    v => v.talla === tallaSeleccionada && v.color === colorSeleccionado
  );

  const handleAgregarAlCarrito = async () => {
    if (!varianteSeleccionada) {
      toast({
        title: 'Selección incompleta',
        description: 'Por favor, seleccioná talla y color',
        variant: 'destructive',
      });
      return;
    }

    setAgregando(true);
    try {
      await onAddToCart(varianteSeleccionada.id, cantidad);
      toast({
        title: 'Agregado al carrito',
        description: `${cantidad}x ${producto.nombre} agregado correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto al carrito',
        variant: 'destructive',
      });
    } finally {
      setAgregando(false);
    }
  };

  const incrementarCantidad = () => setCantidad(prev => Math.min(prev + 1, 10));
  const decrementarCantidad = () => setCantidad(prev => Math.max(prev - 1, 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Galería de imágenes */}
      <div className="space-y-4">
        {/* Imagen principal */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imagenes[imagenSeleccionada]}
            alt={`${producto.nombre} - Imagen ${imagenSeleccionada + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Miniaturas */}
        {imagenes.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {imagenes.map((imagen, idx) => (
              <button
                key={idx}
                onClick={() => setImagenSeleccionada(idx)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                  idx === imagenSeleccionada 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={imagen}
                  alt={`${producto.nombre} - Miniatura ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="space-y-6">
        {/* Título y categoría */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
          {producto.categoria && (
            <Badge variant="secondary" className="mb-4">
              {producto.categoria}
            </Badge>
          )}
        </div>

        {/* Precio */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">
            {formatPrice(producto.precio_base)}
          </span>
        </div>

        {/* Descripción */}
        {producto.descripcion && (
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{producto.descripcion}</p>
          </div>
        )}

        {/* Selector de talla */}
        {tallasDisponibles.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Talla</Label>
            <RadioGroup
              value={tallaSeleccionada}
              onValueChange={(value) => {
                setTallaSeleccionada(value);
                // Si el color actual no está disponible para esta talla, resetear
                if (colorSeleccionado && !variantesActivas.some(v => v.talla === value && v.color === colorSeleccionado)) {
                  setColorSeleccionado('');
                }
              }}
              className="flex flex-wrap gap-2"
            >
              {tallasDisponibles.map((talla) => {
                const disponible = !colorSeleccionado || tallasPorColor.includes(talla);
                return (
                  <div key={talla}>
                    <RadioGroupItem
                      value={talla}
                      id={`talla-${talla}`}
                      className="peer sr-only"
                      disabled={!disponible}
                    />
                    <Label
                      htmlFor={`talla-${talla}`}
                      className={`flex items-center justify-center px-4 py-2 border-2 rounded-md cursor-pointer transition-all min-w-[60px] ${
                        disponible
                          ? 'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:border-primary'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {talla}
                      {tallaSeleccionada === talla && <Check className="ml-1 h-4 w-4" />}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {/* Selector de color */}
        {coloresDisponibles.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Color</Label>
            <RadioGroup
              value={colorSeleccionado}
              onValueChange={(value) => {
                setColorSeleccionado(value);
                // Si la talla actual no está disponible para este color, resetear
                if (tallaSeleccionada && !variantesActivas.some(v => v.color === value && v.talla === tallaSeleccionada)) {
                  setTallaSeleccionada('');
                }
              }}
              className="flex flex-wrap gap-3"
            >
              {coloresDisponibles.map((color) => {
                const disponible = !tallaSeleccionada || coloresPorTalla.includes(color);
                return (
                  <div key={color}>
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="peer sr-only"
                      disabled={!disponible}
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className={`flex items-center gap-2 px-4 py-2 border-2 rounded-md cursor-pointer transition-all ${
                        disponible
                          ? 'peer-data-[state=checked]:border-primary hover:border-primary'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="capitalize">{color}</span>
                      {colorSeleccionado === color && <Check className="ml-1 h-4 w-4" />}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {/* Selector de cantidad */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Cantidad</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementarCantidad}
              disabled={cantidad <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold w-12 text-center">{cantidad}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementarCantidad}
              disabled={cantidad >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* SKU si hay variante seleccionada */}
        {varianteSeleccionada && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">SKU:</span> {varianteSeleccionada.sku}
          </div>
        )}

        {/* Botón agregar al carrito */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleAgregarAlCarrito}
          disabled={!varianteSeleccionada || agregando}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {agregando ? 'Agregando...' : 'Agregar al carrito'}
        </Button>
      </div>
    </div>
  );
}
