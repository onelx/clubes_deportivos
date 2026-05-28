'use client';

import { useState, useCallback } from 'react';
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

/* ─── Guía de talles data ────────────────────────────── */
const GUIA_TALLES = [
  { talla: 'XS', pecho: '82–86', cintura: '64–68', cadera: '88–92' },
  { talla: 'S',  pecho: '86–90', cintura: '68–72', cadera: '92–96' },
  { talla: 'M',  pecho: '90–94', cintura: '72–76', cadera: '96–100' },
  { talla: 'L',  pecho: '94–98', cintura: '76–80', cadera: '100–104' },
  { talla: 'XL', pecho: '98–102', cintura: '80–84', cadera: '104–108' },
  { talla: 'XXL',pecho: '102–108', cintura: '84–90', cadera: '108–114' },
];

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
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${LINE}` }}>
                  {['Talla', 'Pecho', 'Cintura', 'Cadera'].map(h => (
                    <th
                      key={h}
                      style={{
                        fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 11,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: '#999', padding: '8px 12px', textAlign: 'left',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GUIA_TALLES.map((row, i) => (
                  <tr
                    key={row.talla}
                    style={{ background: i % 2 === 0 ? '#fff' : 'transparent', borderBottom: `1px solid ${LINE}` }}
                  >
                    <td style={{ padding: '10px 12px', fontFamily: F_MONO, fontWeight: 700, fontSize: 13, color: INK }}>
                      {row.talla}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#555' }}>{row.pecho}</td>
                    <td style={{ padding: '10px 12px', color: '#555' }}>{row.cintura}</td>
                    <td style={{ padding: '10px 12px', color: '#555' }}>{row.cadera}</td>
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
  const tallas  = [...new Set(variantes.map(v => v.talla).filter(Boolean))] as string[];
  const colores  = [...new Set(variantes.map(v => v.color).filter(Boolean))] as string[];
  const hasTallas = tallas.length > 0;
  const hasColores = colores.length > 0;
  const hasVariantes = variantes.length > 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTalla, setSelectedTalla]   = useState<string | null>(tallas[0] ?? null);
  const [selectedColor, setSelectedColor]   = useState<string | null>(colores[0] ?? null);
  const [cantidad, setCantidad]             = useState(1);
  const [added, setAdded]                   = useState(false);
  const [guiaOpen, setGuiaOpen]             = useState(false);

  // Encuentra la variante que coincide con talla+color seleccionados
  const selectedVariante: VarianteProducto | null = hasVariantes
    ? variantes.find(v => {
        const matchTalla = !hasTallas  || v.talla === selectedTalla;
        const matchColor = !hasColores || v.color === selectedColor;
        return matchTalla && matchColor;
      }) ?? variantes[0]
    : null;

  // Tallas disponibles para el color seleccionado
  const tallasDisponibles = hasColores && selectedColor
    ? new Set(variantes.filter(v => v.color === selectedColor && v.activo).map(v => v.talla))
    : new Set(tallas);

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
            {/* ── Galería ───────────────────────────── */}
            <div>
              {/* Imagen principal */}
              <div
                style={{
                  aspectRatio: '4/5',
                  background: '#eeece5',
                  borderRadius: 8,
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: 12,
                }}
              >
                {imagenes.length > 0 ? (
                  <Image
                    src={imagenes[selectedImage]}
                    alt={producto.nombre}
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#bbb' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sin imagen</span>
                  </div>
                )}

                {/* Flechas navegación */}
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(i => Math.max(0, i - 1))}
                      disabled={selectedImage === 0}
                      style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(250,250,247,0.9)', border: 'none', borderRadius: '50%',
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: selectedImage === 0 ? 'default' : 'pointer',
                        opacity: selectedImage === 0 ? 0.3 : 1,
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedImage(i => Math.min(imagenes.length - 1, i + 1))}
                      disabled={selectedImage === imagenes.length - 1}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(250,250,247,0.9)', border: 'none', borderRadius: '50%',
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: selectedImage === imagenes.length - 1 ? 'default' : 'pointer',
                        opacity: selectedImage === imagenes.length - 1 ? 0.3 : 1,
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {imagenes.length > 1 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {imagenes.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{
                        width: 72, height: 72, borderRadius: 6, overflow: 'hidden',
                        flexShrink: 0, position: 'relative', border: 'none',
                        outline: selectedImage === i ? `2px solid var(--accent, ${INK})` : `2px solid transparent`,
                        outlineOffset: 2,
                        cursor: 'pointer', background: '#eeece5',
                      }}
                    >
                      <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
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
