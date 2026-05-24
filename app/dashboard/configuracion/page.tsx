'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, X, Upload } from 'lucide-react';
import type { Club } from '@/types';

const HERO_KEYS = [
  'hero_imagen_1_url',
  'hero_imagen_2_url',
  'hero_imagen_3_url',
  'hero_imagen_4_url',
] as const;

type HeroKey = typeof HERO_KEYS[number];

function resizeImage(file: File, maxDimension: number, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/jpeg', quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function ConfiguracionPage() {
  const { usuarioClub } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState<Record<HeroKey, boolean>>({
    hero_imagen_1_url: false,
    hero_imagen_2_url: false,
    hero_imagen_3_url: false,
    hero_imagen_4_url: false,
  });

  const [form, setForm] = useState({
    nombre: '',
    color_primario: '#1d4ed8',
    color_secundario: '#64748b',
    hero_imagen_1_url: null as string | null,
    hero_imagen_2_url: null as string | null,
    hero_imagen_3_url: null as string | null,
    hero_imagen_4_url: null as string | null,
  });

  const heroInputRefs = useRef<Record<HeroKey, HTMLInputElement | null>>({
    hero_imagen_1_url: null,
    hero_imagen_2_url: null,
    hero_imagen_3_url: null,
    hero_imagen_4_url: null,
  });

  const fetchClub = useCallback(async () => {
    if (!usuarioClub?.club_id) return;
    setLoading(true);
    const { data } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', usuarioClub.club_id)
      .single();

    if (data) {
      setClub(data as Club);
      setForm({
        nombre: data.nombre || '',
        color_primario: data.color_primario || '#1d4ed8',
        color_secundario: data.color_secundario || '#64748b',
        hero_imagen_1_url: data.hero_imagen_1_url ?? null,
        hero_imagen_2_url: data.hero_imagen_2_url ?? null,
        hero_imagen_3_url: data.hero_imagen_3_url ?? null,
        hero_imagen_4_url: data.hero_imagen_4_url ?? null,
      });
    }
    setLoading(false);
  }, [usuarioClub, supabase]);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  const uploadHeroImage = useCallback(async (key: HeroKey, file: File) => {
    if (!club) return;
    setUploadingHero((prev) => ({ ...prev, [key]: true }));
    try {
      const blob = await resizeImage(file, 1600);
      const ext = 'jpg';
      const path = `hero/${club.id}/${key}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('productos').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      await fetch(`/api/dashboard/club/${club.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: publicUrl }),
      });

      setForm((prev) => ({ ...prev, [key]: publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploadingHero((prev) => ({ ...prev, [key]: false }));
    }
  }, [club, supabase]);

  const removeHeroImage = useCallback(async (key: HeroKey) => {
    if (!club) return;
    await fetch(`/api/dashboard/club/${club.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: null }),
    });
    setForm((prev) => ({ ...prev, [key]: null }));
  }, [club]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/dashboard/club/${club.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          color_primario: form.color_primario,
          color_secundario: form.color_secundario,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }

      setSuccess(true);
      await fetchClub();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Personaliza la apariencia de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del Club</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (solo lectura)</Label>
                <Input
                  id="slug"
                  value={club?.slug || ''}
                  readOnly
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-400">
                  URL de tu tienda: /tienda/{club?.slug}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Club</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  placeholder="Mi Club Deportivo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color_primario">Color Primario</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="color_primario"
                      type="color"
                      value={form.color_primario}
                      onChange={(e) => setForm({ ...form, color_primario: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border border-input"
                    />
                    <Input
                      value={form.color_primario}
                      onChange={(e) => setForm({ ...form, color_primario: e.target.value })}
                      placeholder="#1d4ed8"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color_secundario">Color Secundario</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="color_secundario"
                      type="color"
                      value={form.color_secundario}
                      onChange={(e) => setForm({ ...form, color_secundario: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer border border-input"
                    />
                    <Input
                      value={form.color_secundario}
                      onChange={(e) => setForm({ ...form, color_secundario: e.target.value })}
                      placeholder="#64748b"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-700">Cambios guardados correctamente.</p>
                </div>
              )}

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa de Colores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="rounded-lg p-6 text-white"
                style={{ backgroundColor: form.color_primario }}
              >
                <p className="font-bold text-lg">{form.nombre || 'Nombre del Club'}</p>
                <p className="text-sm opacity-80 mt-1">Color primario</p>
                <div className="mt-3">
                  <button
                    className="px-4 py-2 rounded text-sm font-medium"
                    style={{ backgroundColor: form.color_secundario, color: '#fff' }}
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>

              <div
                className="rounded-lg p-6 text-white"
                style={{ backgroundColor: form.color_secundario }}
              >
                <p className="font-bold">Color Secundario</p>
                <p className="text-sm opacity-80 mt-1">{form.color_secundario}</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 text-center">
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: form.color_primario }}
                  />
                  <p className="text-xs text-gray-500 font-mono">{form.color_primario}</p>
                </div>
                <div className="flex-1 text-center">
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: form.color_secundario }}
                  />
                  <p className="text-xs text-gray-500 font-mono">{form.color_secundario}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imágenes Hero */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Imágenes del Hero</CardTitle>
          <p className="text-sm text-gray-500">
            4 imágenes que se muestran en el panel derecho de la portada. Recomendado: 800×600 px, ratio 4:3, JPG.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HERO_KEYS.map((key, i) => {
              const url = form[key];
              const isUploading = uploadingHero[key];
              return (
                <div key={key} className="space-y-2">
                  <Label className="text-xs text-gray-500">Imagen {i + 1}</Label>
                  <div
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer group"
                    onClick={() => !isUploading && heroInputRefs.current[key]?.click()}
                  >
                    {url ? (
                      <>
                        <img
                          src={url}
                          alt={`Hero ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeHeroImage(key); }}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : isUploading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                        <Upload size={20} />
                        <span className="text-xs">Subir</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={(el) => { heroInputRefs.current[key] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadHeroImage(key, file);
                      e.target.value = '';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
