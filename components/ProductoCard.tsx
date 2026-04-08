import Image from 'next/image'
import Link from 'next/link'
import { Producto } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductoCardProps {
  producto: Producto
  clubSlug: string
}

// Tarjeta de producto para la tienda
export function ProductoCard({ producto, clubSlug }: ProductoCardProps) {
  const imagenPrincipal = producto.imagenes?.[0] || '/placeholder-product.jpg'

  return (
    <Link href={`/tienda/${clubSlug}/producto/${producto.id}`}>
      <article className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Imagen del producto */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imagenPrincipal}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge de categoría */}
          <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {producto.categoria}
          </span>
        </div>

        {/* Info del producto */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {producto.nombre}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {producto.descripcion}
          </p>
          <p className="mt-3 text-lg font-bold text-primary">
            {formatPrice(producto.precio_base)}
          </p>
        </div>
      </article>
    </Link>
  )
}
