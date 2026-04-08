import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductoCardProps {
  producto: Producto;
  clubSlug: string;
}

// Tarjeta de producto para el catálogo
export function ProductoCard({ producto, clubSlug }: ProductoCardProps) {
  const imagenPrincipal = producto.imagenes?.[0] || "/placeholder-product.jpg";

  return (
    <Link 
      href={`/${clubSlug}/producto/${producto.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Imagen del producto */}
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        <Image
          src={imagenPrincipal}
          alt={producto.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info del producto */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{producto.categoria}</p>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-club-primary transition-colors">
          {producto.nombre}
        </h3>
        <p className="text-lg font-bold text-club-primary">
          {formatPrice(producto.precio_base)}
        </p>
      </div>
    </Link>
  );
}
