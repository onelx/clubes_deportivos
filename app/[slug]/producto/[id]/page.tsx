import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TiendaLayout } from '@/components/TiendaLayout';
import { ProductoDetalleInteractivo } from '@/components/ProductoDetalleInteractivo';
import type { Club, Producto, VarianteProducto } from '@/types';

interface ProductoPageProps {
  params: { slug: string; id: string };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const supabase = await createClient();

  // Club
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .eq('activo', true)
    .single();

  if (clubError || !club) notFound();

  // Producto con variantes
  const { data: productoData, error: prodError } = await supabase
    .from('productos')
    .select(`
      *,
      variantes:variantes_producto(*)
    `)
    .eq('id', params.id)
    .eq('activo', true)
    .single();

  if (prodError || !productoData) notFound();

  const producto = productoData as Producto;

  // Productos relacionados (misma categoría, excluyendo el actual)
  const { data: relacionados } = await supabase
    .from('productos')
    .select(`
      id, nombre, precio_base, imagenes, categoria,
      variantes:variantes_producto(id, talla, color, activo)
    `)
    .eq('club_id', club.id)
    .eq('activo', true)
    .eq('categoria', producto.categoria ?? '')
    .neq('id', params.id)
    .limit(4);

  return (
    <TiendaLayout club={club as Club}>
      <ProductoDetalleInteractivo
        club={club as Club}
        producto={producto}
        relacionados={(relacionados ?? []) as Producto[]}
        clubSlug={params.slug}
      />
    </TiendaLayout>
  );
}

export async function generateMetadata({ params }: ProductoPageProps) {
  const supabase = await createClient();
  const { data: prod } = await supabase
    .from('productos')
    .select('nombre, descripcion')
    .eq('id', params.id)
    .single();

  const { data: club } = await supabase
    .from('clubs')
    .select('nombre')
    .eq('slug', params.slug)
    .single();

  return {
    title: prod ? `${prod.nombre} — ${club?.nombre ?? ''}` : 'Producto',
    description: prod?.descripcion ?? undefined,
  };
}
