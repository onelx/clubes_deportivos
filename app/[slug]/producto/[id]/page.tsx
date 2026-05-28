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

  // Productos relacionados: misma categoría primero y, si no alcanzan,
  // se completa con otros productos del club (el catálogo suele ser chico
  // o estar sin categorizar, así la sección siempre tiene contenido).
  const LIMIT_RELACIONADOS = 4;
  const SELECT_RELACIONADOS = `*, variantes:variantes_producto(*)`;

  let relacionados: Producto[] = [];

  if (producto.categoria) {
    const { data } = await supabase
      .from('productos')
      .select(SELECT_RELACIONADOS)
      .eq('club_id', club.id)
      .eq('activo', true)
      .eq('categoria', producto.categoria)
      .neq('id', params.id)
      .limit(LIMIT_RELACIONADOS);
    relacionados = (data ?? []) as Producto[];
  }

  if (relacionados.length < LIMIT_RELACIONADOS) {
    const { data } = await supabase
      .from('productos')
      .select(SELECT_RELACIONADOS)
      .eq('club_id', club.id)
      .eq('activo', true)
      .neq('id', params.id)
      .order('created_at', { ascending: false })
      .limit(LIMIT_RELACIONADOS + relacionados.length);
    const yaIncluidos = new Set(relacionados.map((r) => r.id));
    const extra = ((data ?? []) as Producto[]).filter((p) => !yaIncluidos.has(p.id));
    relacionados = [...relacionados, ...extra].slice(0, LIMIT_RELACIONADOS);
  }

  return (
    <TiendaLayout club={club as Club}>
      <ProductoDetalleInteractivo
        club={club as Club}
        producto={producto}
        relacionados={relacionados}
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
