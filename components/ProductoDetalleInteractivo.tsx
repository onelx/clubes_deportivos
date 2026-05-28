'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, X, Minus, Plus, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { ProductoCard } from '@/components/ProductoCard';
import type { Club, Producto, VarianteProducto } from '@/types';

/* ─── Design tokens ──────────────────────────────────── */
const INK   = '#0a0a0a';
const PAPER = '#fafaf7';
const LINE  = '#e6e4dd';
const F_DISPLAY = "var(--font-display, 'Space Grotesk', system-ui, sans-serif)";
const F_MONO    = "var(--font-mono, 'Space Mono', monospace)";

/* ─── Color mapping ──────────────────────────────────── */
const COLOR_MAP: Record<string, string> = {
  negro: '#0a0a0a', blanco: '#f5f5f0', rojo: '#dc2626',
  azul: '#1d4ed8', 'azul marino': '#1e3a5f', celeste: '#38bdf8',
  verde: '#16a34a', amarillo: '#fbbf24', naranja: '#f97316',
  gris: '#9ca3af', violeta: '#7c3aed', rosa: '#ec4899',
  bordo: '#881337', beige: '#d4b896', marron: '#92400e',
  'gris oscuro': '#4b5563', turquesa: '#0891b2', dorado: '#d97706',
};
function colorToHex(name: string | null): string {
  if (!name) return '#ccc';
  return COLOR_MAP[name.toLowerCase()] ?? '#ccc';
}

/* ─── Price formatter ────────────────────────────────── */
function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);
}

/* ─── Orden canónico de talles ───────────────────────── */
const TALLA_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL'];
function tallaPos(t: string): number {
  const i = TALLA_ORDER.indexOf(t.toUpperCase());
  if (i !== -1) return i;
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? 999 : 100 + n;
}
function tallaRank(a: string, b: string): number {
  return tallaPos(a) - tallaPos(b);
}

/* ─── Guía de talles data ────────────────────────────── */
const GUIA_TALLES = [
  { talla: 'XXS', busto: '< 78', cintura: '57 – 60', cadera: '82 – 85' },
  { talla: 'XS',  busto: '79 – 83', cintura: '61 – 66', cadera: '86 – 91' },
  { talla: 'S',   busto: '84 – 88', cintura: '67 – 72', cadera: '92 – 97' },
  { talla: 'M',   busto: '89 – 93', cintura: '73 – 78', cadera: '98 – 103' },
  { talla: 'L',   busto: '94 – 98', cintura: '79 – 85', cadera: '104 – 110' },
  { talla: 'XL',  busto: '99 – 103', cintura: '86 – 94', cadera: '111 – 117' },
];

const COSTO_ENVIO = 500;

/* ─── Sub-components ─────────────────────────────────── */

function GuiaTallesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,10,10,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: PAPER, borderRadius: 8, maxWidth: 580, width: '100%',
          maxHeight: '85vh', overflow: 'auto', position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 20, color: INK }}>
            Guía de talles
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#888', borderRadius: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 28px 28px' }}>
          <p style={{ fontSize: 13, color: '#777', marginBottom: 20, lineHeight: 1.5 }}>
            Medidas en centímetros. Para una mejor experiencia, recomendamos tomar las medidas sobre la ropa interior.
          </p>

          {/* Tabla */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 14 }}>
              <thead>
                <tr>
                  {['Etiqueta', 'Busto', 'Cintura', 'Cadera'].map((h, hi) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 13,
                        color: INK, background: '#FBBF24', padding: '16px 12px', textAlign: 'center',
                        borderTopLeftRadius: hi === 0 ? 10 : 0,
                        borderTopRightRadius: hi === 3 ? 10 : 0,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GUIA_TALLES.map((row) => (
                  <tr key={row.talla}>
                    <td style={{ padding: '14px 12px', fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 15, color: INK, textAlign: 'center', borderBottom: `1px solid ${LINE}` }}>
                      {row.talla}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#555', textAlign: 'center', borderBottom: `1px solid ${LINE}` }}>{row.busto} cm</td>
                    <td style={{ padding: '14px 12px', color: '#555', textAlign: 'center', borderBottom: `1px solid ${LINE}` }}>{row.cintura} cm</td>
                    <td style={{ padding: '14px 12px', color: '#555', textAlign: 'center', borderBottom: `1px solid ${LINE}` }}>{row.cadera} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cómo medirse */}
          <div style={{ marginTop: 24, padding: '16px 20px', background: '#f0ede5', borderRadius: 6 }}>
            <p style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 13, color: INK, marginBottom: 8 }}>
              ¿Cómo medirme?
            </p>
            <ul style={{ fontSize: 13, color: '#666', lineHeight: 1.6, paddingLeft: 16 }}>
              <li><strong>Pecho:</strong> la parte más ancha del pecho, con los brazos relajados.</li>
              <li><strong>Cintura:</strong> la parte más estrecha del torso, sobre el ombligo.</li>
              <li><strong>Cadera:</strong> la parte más ancha de la cadera, unos 20 cm bajo la cintura.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvioModal({ onClose }: { onClose: () => void }) {
  const [cp, setCp] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);

  const calcular = () => {
    const cpLimpio = cp.trim();
    if (!cpLimpio) return;
    setResultado(`Envío a CP ${cpLimpio}: ${formatPrice(COSTO_ENVIO)} · 5–10 días hábiles`);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,10,10,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: PAPER, borderRadius: 8, maxWidth: 460, width: '100%', position: 'relative', padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 20, color: INK }}>
            Calculá el costo de envío
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            inputMode="numeric"
            value={cp}
            onChange={e => { setCp(e.target.value.replace(/\D/g, '').slice(0, 8)); setResultado(null); }}
            placeholder="Tu código postal"
            style={{ flex: 1, padding: '13px 16px', border: `1px solid ${LINE}`, borderRadius: 6, fontFamily: F_DISPLAY, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
          <button
            onClick={calcular}
            style={{ padding: '0 20px', background: 'var(--accent, #0a0a0a)', color: PAPER, border: 'none', borderRadius: 6, fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Calcular envío
          </button>
        </div>

        {resultado && (
          <div style={{ marginTop: 16, padding: '14px 16px', background: '#f0ede5', borderRadius: 6, fontFamily: F_DISPLAY, fontSize: 14, color: INK }}>
            {resultado}
          </div>
        )}

        <p style={{ marginTop: 14, fontFamily: F_MONO, fontSize: 11, letterSpacing: '0.04em', color: '#888', lineHeight: 1.5 }}>
          Envío de costo fijo a todo el país. El plazo puede variar según la localidad.
        </p>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */

interface ProductoDetalleInteractivoProps {
  club: Club;
  producto: Producto;
  relacionados: Producto[];
  clubSlug: string;
}

export function ProductoDetalleInteractivo({
  club,
  producto,
  relacionados,
  clubSlug,
}: ProductoDetalleInteractivoProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const variantes: VarianteProducto[] = producto.variantes ?? [];
  const tallas  = ([...new Set(variantes.map(v => v.talla).filter(Boolean))] as string[]).sort(tallaRank);
  const colores  = [...new Set(variantes.map(v => v.color).filter(Boolean))] as string[];
  const hasTallas = tallas.length > 0;
  const hasColores = colores.length > 0;
  const hasVariantes = variantes.length > 0;

  const [selectedTalla, setSelectedTalla]   = useState<string | null>(tallas[0] ?? null);
  const [selectedColor, setSelectedColor]   = useState<string | null>(colores[0] ?? null);
  const [cantidad, setCantidad]             = useState(1);
  const [added, setAdded]                   = useState(false);
  const [guiaOpen, setGuiaOpen]             = useState(false);
  const [envioOpen, setEnvioOpen]           = useState(false);
  const [lightbox, setLightbox]             = useState<string | null>(null);
  const [favorito, setFavorito]             = useState(false);

  useEffect(() => {
    try {
      setFavorito(localStorage.getItem(`fav_${clubSlug}_${producto.id}`) === '1');
    } catch {
      // localStorage no disponible (SSR)
    }
  }, [clubSlug, producto.id]);

  const toggleFavorito = useCallback(() => {
    try {
      const key = `fav_${clubSlug}_${producto.id}`;
      setFavorito((prev) => {
        const next = !prev;
        if (next) localStorage.setItem(key, '1');
        else localStorage.removeItem(key);
        return next;
      });
    } catch {
      // ignore
    }
  }, [clubSlug, producto.id]);

  // Encuentra la variante que coincide con talla+color seleccionados
  const selectedVariante: VarianteProducto | null = hasVariantes
    ? variantes.find(v => {
        const matchTalla = !hasTallas  || v.talla === selectedTalla;
        const matchColor = !hasColores || v.color === selectedColor;
        return matchTalla && matchColor;
      }) ?? variantes[0]
    : null;

  // Tallas disponibles: por color+activo si hay colores, o por activo si no
  const tallasDisponibles = hasColores && selectedColor
    ? new Set(variantes.filter(v => v.color === selectedColor && v.activo).map(v => v.talla))
    : new Set(variantes.filter(v => v.activo).map(v => v.talla));

  // Colores disponibles para la talla seleccionada
  const coloresDisponibles = hasTallas && selectedTalla
    ? new Set(variantes.filter(v => v.talla === selectedTalla && v.activo).map(v => v.color))
    : new Set(colores);

  const handleTalla = useCallback((t: string) => {
    setSelectedTalla(t);
    // Si el color actual no está disponible para la nueva talla, resetear
    if (selectedColor && !variantes.some(v => v.talla === t && v.color === selectedColor && v.activo)) {
      const primerColorDisp = variantes.find(v => v.talla === t && v.activo)?.color ?? null;
      setSelectedColor(primerColorDisp);
    }
  }, [selectedColor, variantes]);

  const handleColor = useCallback((c: string) => {
    setSelectedColor(c);
    if (selectedTalla && !variantes.some(v => v.color === c && v.talla === selectedTalla && v.activo)) {
      const primerTallaDisp = variantes.find(v => v.color === c && v.activo)?.talla ?? null;
      setSelectedTalla(primerTallaDisp);
    }
  }, [selectedTalla, variantes]);

  const handleAddToCart = () => {
    if (!producto) return;
    if (hasVariantes && !selectedVariante) return;
    addItem(producto, selectedVariante, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const canAdd = !hasVariantes || !!selectedVariante;
  const imagenes = producto.imagenes ?? [];

  return (
    <>
      {guiaOpen && <GuiaTallesModal onClose={() => setGuiaOpen(false)} />}
      {envioOpen && <EnvioModal onClose={() => setEnvioOpen(false)} />}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,10,10,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}
          >
            <X size={22} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt={producto.nombre}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 8 }}
          />
        </div>
      )}

      <div style={{ background: PAPER, minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ borderBottom: `1px solid ${LINE}`, background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44 }}>
              <button
                onClick={() => router.back()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: F_DISPLAY, fontSize: 13, color: '#888',
                  padding: 0,
                }}
              >
                <ChevronLeft size={14} />
                Volver
              </button>
              <span style={{ color: LINE }}>·</span>
              {producto.categoria && (
                <>
                  <Link
                    href={`/${clubSlug}/productos?categoria=${encodeURIComponent(producto.categoria)}`}
                    style={{ fontFamily: F_DISPLAY, fontSize: 13, color: '#888', textDecoration: 'none' }}
                  >
                    {producto.categoria}
                  </Link>
                  <span style={{ color: LINE }}>·</span>
                </>
              )}
              <span style={{ fontFamily: F_DISPLAY, fontSize: 13, color: INK, fontWeight: 500 }}>
                {producto.nombre}
              </span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
              gap: 64,
              alignItems: 'start',
            }}
          >
            {/* ── Galería: frente + dorso (lado a lado, click para ampliar) ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[0, 1].map((slot) => {
                const img = imagenes[slot];
                const esDorso = slot === 1;
                return (
                  <div
                    key={slot}
                    onClick={() => img && setLightbox(img)}
                    style={{
                      aspectRatio: '4/5',
                      background: '#eeece5',
                      borderRadius: 8,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: img ? 'zoom-in' : 'default',
                    }}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${producto.nombre} — ${esDorso ? 'dorso' : 'frente'}`}
                        fill
                        priority={!esDorso}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#bbb' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                        <span style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {esDorso ? 'Dorso — sin imagen' : 'Sin imagen'}
                        </span>
                      </div>
                    )}

                    {/* Corazón de favorito (sobre la primera imagen) */}
                    {slot === 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorito(); }}
                        aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        style={{
                          position: 'absolute', top: 12, right: 12, zIndex: 3,
                          background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', backdropFilter: 'blur(4px)',
                        }}
                      >
                        <svg
                          width="20" height="20" viewBox="0 0 24 24"
                          fill={favorito ? '#e11d48' : 'none'}
                          stroke={favorito ? '#e11d48' : '#0a0a0a'}
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Info del producto ─────────────────── */}
            <div>
              {/* Categoría eyebrow */}
              {producto.categoria && (
                <p
                  style={{
                    fontFamily: F_MONO, fontSize: 11, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: '#999', marginBottom: 12,
                  }}
                >
                  {producto.categoria}
                </p>
              )}

              {/* Nombre */}
              <h1
                style={{
                  fontFamily: F_DISPLAY, fontWeight: 700,
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  letterSpacing: '-0.025em', color: INK,
                  lineHeight: 1.1, marginBottom: 16,
                }}
              >
                {producto.nombre}
              </h1>

              {/* Precio */}
              <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Precio comparación tachado */}
                {producto.precio_comparacion != null && producto.precio_comparacion > producto.precio_base && (
                  <span
                    style={{
                      fontFamily: F_MONO, fontSize: 15,
                      color: '#9ca3af', textDecoration: 'line-through',
                    }}
                  >
                    {formatPrice(producto.precio_comparacion)}
                  </span>
                )}

                {/* Precio base + IVA */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: F_DISPLAY, fontWeight: 700,
                      fontSize: 28, color: 'var(--accent, #0a0a0a)',
                    }}
                  >
                    {formatPrice(producto.precio_base)}
                  </span>
                  <span style={{ fontFamily: F_MONO, fontSize: 11, color: '#6b7280' }}>
                    (IVA incluido)
                  </span>
                </div>

                {/* Cuotas */}
                {club.cuotas_config && (
                  <span style={{ fontFamily: F_MONO, fontSize: 12, color: '#374151' }}>
                    {club.cuotas_config.cantidad} cuotas
                    {club.cuotas_config.sin_interes ? ' S/I' : ''} de{' '}
                    {formatPrice(Math.round(producto.precio_base / club.cuotas_config.cantidad))} con{' '}
                    {club.cuotas_config.banco}
                  </span>
                )}
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 32 }}>
                  {producto.descripcion}
                </p>
              )}

              <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Selector de talla */}
                {hasTallas && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <label style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 13, color: INK }}>
                        Talla{selectedTalla ? `: ${selectedTalla}` : ''}
                      </label>
                      <button
                        onClick={() => setGuiaOpen(true)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: F_DISPLAY, fontSize: 12, color: '#888',
                          textDecoration: 'underline', padding: 0,
                        }}
                      >
                        Guía de talles
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {tallas.map(t => {
                        const disponible = tallasDisponibles.has(t);
                        const isSelected = selectedTalla === t;
                        return (
                          <button
                            key={t}
                            onClick={() => disponible && handleTalla(t)}
                            disabled={!disponible}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 4,
                              border: isSelected
                                ? `2px solid var(--accent, ${INK})`
                                : `1px solid ${disponible ? LINE : '#e0ddd6'}`,
                              background: isSelected ? 'var(--accent, #0a0a0a)' : '#fff',
                              color: isSelected ? PAPER : disponible ? INK : '#ccc',
                              fontFamily: F_DISPLAY,
                              fontWeight: isSelected ? 600 : 400,
                              fontSize: 13,
                              cursor: disponible ? 'pointer' : 'not-allowed',
                              position: 'relative',
                              textDecoration: !disponible ? 'line-through' : 'none',
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selector de color */}
                {hasColores && (
                  <div>
                    <label style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 13, color: INK, display: 'block', marginBottom: 10 }}>
                      Color{selectedColor ? `: ${selectedColor}` : ''}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {colores.map(c => {
                        const disponible = coloresDisponibles.has(c);
                        const isSelected = selectedColor === c;
                        const hex = colorToHex(c);
                        const isLight = ['blanco', 'beige', 'amarillo', 'celeste'].includes(c.toLowerCase());

                        return (
                          <button
                            key={c}
                            onClick={() => disponible && handleColor(c)}
                            disabled={!disponible}
                            title={c}
                            style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: hex,
                              border: isSelected
                                ? `3px solid var(--accent, ${INK})`
                                : isLight ? `1px solid ${LINE}` : '3px solid transparent',
                              outline: isSelected ? `2px solid ${PAPER}` : 'none',
                              outlineOffset: isSelected ? -5 : 0,
                              cursor: disponible ? 'pointer' : 'not-allowed',
                              opacity: disponible ? 1 : 0.3,
                              position: 'relative',
                            }}
                          >
                            {isSelected && (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Check size={14} color={isLight ? '#333' : '#fff'} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Cantidad */}
                <div>
                  <label style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 13, color: INK, display: 'block', marginBottom: 10 }}>
                    Cantidad
                  </label>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${LINE}`, borderRadius: 4, overflow: 'hidden' }}>
                    <button
                      onClick={() => setCantidad(q => Math.max(1, q - 1))}
                      disabled={cantidad <= 1}
                      style={{
                        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'none', border: 'none', cursor: cantidad <= 1 ? 'default' : 'pointer',
                        color: cantidad <= 1 ? '#ccc' : INK,
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontFamily: F_MONO, fontSize: 14, fontWeight: 700, width: 40, textAlign: 'center', color: INK }}>
                      {cantidad}
                    </span>
                    <button
                      onClick={() => setCantidad(q => Math.min(10, q + 1))}
                      disabled={cantidad >= 10}
                      style={{
                        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'none', border: 'none', cursor: cantidad >= 10 ? 'default' : 'pointer',
                        color: cantidad >= 10 ? '#ccc' : INK,
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Botón agregar */}
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  style={{
                    width: '100%', height: 52, borderRadius: 4, border: 'none',
                    background: added ? '#16a34a' : canAdd ? 'var(--accent, #0a0a0a)' : '#ddd',
                    color: added ? '#fff' : canAdd ? PAPER : '#aaa',
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 15,
                    letterSpacing: '0.01em', cursor: canAdd ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    'Agregar al carrito'
                  )}
                </button>

                {hasVariantes && !selectedVariante && (
                  <p style={{ fontFamily: F_MONO, fontSize: 11, color: '#f59e0b', letterSpacing: '0.08em', textAlign: 'center', marginTop: -12 }}>
                    Seleccioná talla y color para continuar
                  </p>
                )}

                {/* Calcular envío */}
                <button
                  type="button"
                  onClick={() => setEnvioOpen(true)}
                  style={{
                    alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0,
                    fontFamily: F_DISPLAY, fontSize: 13, color: INK, cursor: 'pointer',
                    textDecoration: 'underline', textUnderlineOffset: 3,
                  }}
                >
                  Calculá el costo de envío
                </button>

                {/* Detalles adicionales */}
                <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    '✓ Fabricado bajo demanda en 5–10 días hábiles',
                    '✓ Envíos a todo el país',
                    '✓ Defectos de fabricación cubiertos',
                  ].map((line, i) => (
                    <p key={i} style={{ fontFamily: F_DISPLAY, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                      {line}
                    </p>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* ── Productos relacionados ─────────────── */}
          {relacionados.length > 0 && (
            <div style={{ marginTop: 80 }}>
              {/* Encabezado de sección */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                  <h2
                    style={{
                      fontFamily: F_DISPLAY, fontWeight: 700,
                      fontSize: 'clamp(22px, 3vw, 32px)',
                      letterSpacing: '-0.025em', color: INK,
                    }}
                  >
                    También te puede interesar…
                  </h2>
                </div>
                <Link
                  href={`/${clubSlug}/productos${producto.categoria ? `?categoria=${encodeURIComponent(producto.categoria)}` : ''}`}
                  style={{
                    fontFamily: F_DISPLAY, fontSize: 13, fontWeight: 600,
                    color: INK, textDecoration: 'none', display: 'flex',
                    alignItems: 'center', gap: 4,
                    borderBottom: `1px solid ${INK}`, paddingBottom: 2,
                  }}
                >
                  Ver todos <ChevronRight size={14} />
                </Link>
              </div>

              {/* Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 24,
                }}
              >
                {relacionados.map((rel, i) => (
                  <ProductoCard
                    key={rel.id}
                    producto={rel}
                    clubSlug={clubSlug}
                    index={i}
                    accentColor={club.color_primario || undefined}
                    cuotasConfig={club.cuotas_config ?? null}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
