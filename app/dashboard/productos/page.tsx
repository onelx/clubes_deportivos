'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Loader2,
  Plus,
  Trash2,
  Edit3,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import type { Producto, VarianteProducto } from '@/types';

interface ProductoConVariantes extends Omit<Producto, 'variantes'> {
  variantes: VarianteProducto[];
}

interface VarianteForm {
  talla: string;
  color: string;
}

const emptyProductoForm = {
  nombre: '',
  descripcion: '',
  precio_base: '',
  costo_produccion: '',
  categoria: '',
  imagenes: [] as string[],
};

export default function ProductosPage() {
  const { usuarioClub } = useAuth();
  const supabase = createClient();

  const [productos, setProductos] = useState<ProductoConVariantes[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProducto, setEditingProducto] = useState<ProductoConVariantes | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [productoForm, setProductoForm] = useState(emptyProductoForm);
  const [variantes, setVariantes] = useState<VarianteForm[]>([]);

  const fetchProductos = useCallback(async () => {
    if (!usuarioClub?.club_id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*, variantes:variantes_producto(*)')
      .eq('club_id', usuarioClub.club_id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProductos(data as ProductoConVariantes[]);
    }
    setLoading(false);
  }, [usuarioClub, supabase]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // ── Image upload helper ──────────────────────────────────────────────────
  const resizeAndUpload = async (file: File): Promise<string> => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    await new Promise<void>((resolve) => { img.onload = () => resolve(); img.src = objectUrl; });
    URL.revokeObjectURL(objectUrl);

    const MAX = 1200;
    let { width, height } = img;
    if (width > MAX || height > MAX) {
      if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
      else { width = Math.round(width * MAX / height); height = MAX; }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)
    );

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { data, error } = await supabase.storage
      .from('productos')
      .upload(filename, blob, { contentType: 'image/jpeg', upsert: false });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('productos')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  // ── Sheet helpers ────────────────────────────────────────────────────────
  const openAddSheet = () => {
    setEditingProducto(null);
    setProductoForm(emptyProductoForm);
    setVariantes([]);
    setError(null);
    setSheetOpen(true);
  };

  const openEditSheet = (producto: ProductoConVariantes) => {
    setEditingProducto(producto);
    setProductoForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio_base: String(producto.precio_base),
      costo_produccion: String(producto.costo_produccion),
      categoria: producto.categoria || '',
      imagenes: producto.imagenes || [],
    });
    setVariantes(
      (producto.variantes || []).map((v) => ({
        talla: v.talla || '',
        color: v.color || '',
      }))
    );
    setError(null);
    setSheetOpen(true);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioClub?.club_id) return;
    setSubmitting(true);
    setError(null);

    const body = {
      club_id: usuarioClub.club_id,
      nombre: productoForm.nombre,
      descripcion: productoForm.descripcion || undefined,
      precio_base: parseFloat(productoForm.precio_base) || 0,
      costo_produccion: parseFloat(productoForm.costo_produccion) || 0,
      categoria: productoForm.categoria || undefined,
      imagenes: productoForm.imagenes,
      variantes: variantes
        .filter((v) => v.talla || v.color)
        .map((v) => ({ talla: v.talla || undefined, color: v.color || undefined })),
    };

    try {
      let res: Response;
      if (editingProducto) {
        res = await fetch(`/api/dashboard/productos/${editingProducto.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/dashboard/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar producto');
      }

      setSheetOpen(false);
      await fetchProductos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Other actions ────────────────────────────────────────────────────────
  const toggleActivo = async (id: string, activo: boolean) => {
    await fetch(`/api/dashboard/productos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !activo }),
    });
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !activo } : p))
    );
  };

  const deleteProducto = async (id: string, nombre: string) => {
    if (!confirm(`¿Seguro que deseas eliminar "${nombre}"?`)) return;
    await fetch(`/api/dashboard/productos/${id}`, { method: 'DELETE' });
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Variante row helpers ─────────────────────────────────────────────────
  const addVarianteRow = () => setVariantes((prev) => [...prev, { talla: '', color: '' }]);
  const removeVarianteRow = (i: number) => setVariantes((prev) => prev.filter((_, j) => j !== i));
  const updateVariante = (i: number, field: 'talla' | 'color', value: string) =>
    setVariantes((prev) => prev.map((v, j) => (j === i ? { ...v, [field]: value } : v)));

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-1">Gestiona el catálogo de tu tienda</p>
        </div>

        <Button onClick={openAddSheet}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos todavía.</p>
              <p className="text-sm text-gray-400 mt-1">
                Crea tu primer producto haciendo clic en &quot;Nuevo Producto&quot;.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Nombre</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Categoría</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Precio Base</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Costo Prod.</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Variantes</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Estado</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {producto.imagenes?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={producto.imagenes[0]}
                              alt=""
                              className="w-8 h-8 object-cover rounded border flex-shrink-0"
                            />
                          )}
                          {producto.nombre}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-500">{producto.categoria || '-'}</td>
                      <td className="py-3 px-2 text-right">
                        ${producto.precio_base.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 text-right">
                        ${producto.costo_produccion.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant="secondary">{producto.variantes?.length || 0}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => toggleActivo(producto.id, producto.activo)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            producto.activo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditSheet(producto)}
                            className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProducto(producto.id, producto.nombre)}
                            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Product Sheet ─────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="p_nombre">Nombre *</Label>
              <Input
                id="p_nombre"
                value={productoForm.nombre}
                onChange={(e) => setProductoForm((f) => ({ ...f, nombre: e.target.value }))}
                required
                placeholder="Camiseta oficial"
                disabled={submitting}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="p_descripcion">Descripción</Label>
              <textarea
                id="p_descripcion"
                value={productoForm.descripcion}
                onChange={(e) => setProductoForm((f) => ({ ...f, descripcion: e.target.value }))}
                rows={3}
                placeholder="Descripción del producto..."
                disabled={submitting}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Precio / Costo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p_precio_base">Precio base *</Label>
                <Input
                  id="p_precio_base"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productoForm.precio_base}
                  onChange={(e) => setProductoForm((f) => ({ ...f, precio_base: e.target.value }))}
                  required
                  placeholder="0.00"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p_costo_produccion">Costo producción</Label>
                <Input
                  id="p_costo_produccion"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productoForm.costo_produccion}
                  onChange={(e) => setProductoForm((f) => ({ ...f, costo_produccion: e.target.value }))}
                  placeholder="0.00"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="p_categoria">Categoría</Label>
              <Input
                id="p_categoria"
                value={productoForm.categoria}
                onChange={(e) => setProductoForm((f) => ({ ...f, categoria: e.target.value }))}
                placeholder="Camisetas, Accesorios..."
                disabled={submitting}
              />
            </div>

            <Separator />

            {/* ── Imágenes ─────────────────────────────────────────────── */}
            <div>
              <Label>Imágenes del producto</Label>

              {productoForm.imagenes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {productoForm.imagenes.map((url, i) => (
                    <div key={i} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-20 h-20 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() =>
                          setProductoForm((f) => ({
                            ...f,
                            imagenes: f.imagenes.filter((_, j) => j !== i),
                          }))
                        }
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="mt-2 flex items-center gap-2 cursor-pointer">
                <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-600">
                  {uploadingImage ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Subiendo...</>
                  ) : (
                    <><ImageIcon className="w-4 h-4" />Subir imagen</>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage || submitting}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImage(true);
                    try {
                      const url = await resizeAndUpload(file);
                      setProductoForm((f) => ({ ...f, imagenes: [...f.imagenes, url] }));
                    } catch (err) {
                      console.error('Upload error:', err);
                      alert('Error al subir la imagen. Verificá que el bucket "productos" existe en Supabase Storage.');
                    } finally {
                      setUploadingImage(false);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">Máx 1200px, se convierte a JPEG automáticamente</p>
            </div>

            <Separator />

            {/* ── Variantes ────────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Variantes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVarianteRow}
                  disabled={submitting}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Agregar Variante
                </Button>
              </div>

              {variantes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">
                  Sin variantes. Haz clic en &quot;Agregar Variante&quot; para añadir tallas/colores.
                </p>
              ) : (
                <div className="space-y-2">
                  {variantes.map((variante, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        placeholder="Talla (S, M, L...)"
                        value={variante.talla}
                        onChange={(e) => updateVariante(i, 'talla', e.target.value)}
                        disabled={submitting}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Color (Azul, Rojo...)"
                        value={variante.color}
                        onChange={(e) => updateVariante(i, 'color', e.target.value)}
                        disabled={submitting}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeVarianteRow(i)}
                        disabled={submitting}
                        className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting || uploadingImage} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : editingProducto ? (
                  'Guardar Cambios'
                ) : (
                  'Crear Producto'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
