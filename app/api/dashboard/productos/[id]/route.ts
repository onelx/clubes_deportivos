import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  try {
    const body = await request.json();
    const { nombre, descripcion, precio_base, precio_comparacion, personalizable, imagen_personalizacion, costo_produccion, categoria, activo, imagenes, variantes } = body;

    const updateData: Record<string, unknown> = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (precio_base !== undefined) updateData.precio_base = precio_base;
    if (precio_comparacion !== undefined) updateData.precio_comparacion = precio_comparacion;
    if (personalizable !== undefined) updateData.personalizable = personalizable;
    if (imagen_personalizacion !== undefined) updateData.imagen_personalizacion = imagen_personalizacion;
    if (costo_produccion !== undefined) updateData.costo_produccion = costo_produccion;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (activo !== undefined) updateData.activo = activo;
    if (imagenes !== undefined) updateData.imagenes = Array.isArray(imagenes) ? imagenes : [];

    let { data, error } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    // Si falla por columnas que aún no existen (migración pendiente),
    // reintentamos sin esas columnas para que el resto se guarde igual.
    if (error && (error.message?.includes('precio_comparacion') || error.message?.includes('personalizable'))) {
      const fallbackData = { ...updateData };
      delete fallbackData.precio_comparacion;
      delete fallbackData.personalizable;
      const fallback = await supabase
        .from('productos')
        .update(fallbackData)
        .eq('id', params.id)
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;

    // Replace variantes if provided
    if (Array.isArray(variantes)) {
      // Delete existing
      const { error: deleteError } = await supabase
        .from('variantes_producto')
        .delete()
        .eq('producto_id', params.id);

      if (deleteError) throw deleteError;

      // Insert new ones (skip empty rows)
      const validVariantes = variantes.filter(
        (v: { talla?: string; color?: string }) => v.talla || v.color
      );

      if (validVariantes.length > 0) {
        const variantesData = validVariantes.map(
          (v: { talla?: string; color?: string; sku?: string }) => ({
            producto_id: params.id,
            talla: v.talla || null,
            color: v.color || null,
            sku: v.sku || null,
            activo: true,
          })
        );

        const { error: insertError } = await supabase
          .from('variantes_producto')
          .insert(variantesData);

        if (insertError) throw insertError;
      }
    }

    // Return full product with variantes
    const { data: productoCompleto } = await supabase
      .from('productos')
      .select('*, variantes:variantes_producto(*)')
      .eq('id', params.id)
      .single();

    return NextResponse.json(productoCompleto || data);
  } catch (error) {
    console.error('Error updating producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  try {
    const { error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
