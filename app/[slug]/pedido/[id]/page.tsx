import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { TiendaLayout } from '@/components/TiendaLayout';
import type { Club, Pedido } from '@/types';

const INK = '#0a0a0a';
const PAPER = '#fafaf7';
const LINE = '#e6e4dd';
const F_DISPLAY = "var(--font-display, 'Space Grotesk', system-ui, sans-serif)";
const F_MONO = "var(--font-mono, 'Space Mono', monospace)";

interface PedidoPageProps {
  params: { slug: string; id: string };
  searchParams?: { success?: string };
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

const ESTADO_LABELS: Record<string, { label: string; color: string }> = {
  pendiente_pago: { label: 'Pendiente de pago', color: '#f59e0b' },
  pendiente:      { label: 'Pendiente',          color: '#f59e0b' },
  pagado:         { label: 'Pagado',             color: '#10b981' },
  produccion:     { label: 'En producción',      color: '#3b82f6' },
  enviado:        { label: 'Enviado',            color: '#8b5cf6' },
  entregado:      { label: 'Entregado',          color: '#10b981' },
  cancelado:      { label: 'Cancelado',          color: '#ef4444' },
};

export default async function PedidoPage({ params, searchParams }: PedidoPageProps) {
  const supabase = await createClient();

  // Fetch club
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .eq('activo', true)
    .single();

  if (clubError || !club) notFound();

  // Fetch pedido with items → products + variants
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .select(`
      *,
      items:items_pedido(
        *,
        producto:productos(id, nombre, imagenes, precio_base, categoria),
        variante:variantes_producto(id, talla, color, sku)
      )
    `)
    .eq('id', params.id)
    .eq('club_id', club.id)
    .single();

  if (pedidoError || !pedido) notFound();

  const isSuccess = searchParams?.success === 'true';
  const estadoInfo = ESTADO_LABELS[pedido.estado] ?? { label: pedido.estado, color: '#6b7280' };
  const dir = pedido.direccion_envio as {
    nombre?: string; apellido?: string; direccion: string;
    ciudad: string; provincia: string; codigo_postal: string; telefono?: string;
  };

  return (
    <TiendaLayout club={club as Club}>
      <div
        style={{ background: PAPER, minHeight: '100vh' }}
      >
        {/* Hero de confirmación */}
        <div
          style={{
            background: INK,
            color: PAPER,
            padding: '64px 24px 56px',
            textAlign: 'center',
          }}
        >
          {/* Ícono de estado */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `2px solid ${isSuccess ? 'var(--accent, #22c55e)' : estadoInfo.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            {isSuccess ? (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #22c55e)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={estadoInfo.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>

          <p
            style={{
              fontFamily: F_MONO,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,247,0.45)',
              marginBottom: 12,
            }}
          >
            {isSuccess ? 'Pedido confirmado' : 'Detalle del pedido'}
          </p>

          <h1
            style={{
              fontFamily: F_DISPLAY,
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}
          >
            {isSuccess ? '¡Gracias por tu compra!' : `Pedido ${pedido.numero_pedido}`}
          </h1>

          {isSuccess && (
            <p style={{ color: 'rgba(250,250,247,0.6)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Recibimos tu pedido y ya empezamos a prepararlo.
              Te enviaremos actualizaciones a <strong style={{ color: PAPER }}>{pedido.cliente_email}</strong>.
            </p>
          )}

          {/* Número de pedido pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(250,250,247,0.08)',
              border: `1px solid rgba(250,250,247,0.15)`,
              borderRadius: 4,
              padding: '8px 20px',
            }}
          >
            <span style={{ fontFamily: F_MONO, fontSize: 12, color: 'rgba(250,250,247,0.5)', letterSpacing: '0.12em' }}>
              Nº
            </span>
            <span style={{ fontFamily: F_MONO, fontSize: 14, letterSpacing: '0.08em', fontWeight: 700 }}>
              {pedido.numero_pedido}
            </span>
          </div>

          {/* Estado pill */}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                fontFamily: F_MONO,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: 2,
                background: `${estadoInfo.color}22`,
                color: estadoInfo.color,
                border: `1px solid ${estadoInfo.color}44`,
              }}
            >
              {estadoInfo.label}
            </span>
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

            {/* Items del pedido */}
            <section>
              <h2
                style={{
                  fontFamily: F_DISPLAY,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: INK,
                  opacity: 0.4,
                  marginBottom: 16,
                }}
              >
                Productos
              </h2>

              <div style={{ border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden' }}>
                {(pedido.items ?? []).map((item: any, idx: number) => {
                  const prod = item.producto;
                  const vari = item.variante;
                  const varLabel = vari
                    ? [vari.talla, vari.color].filter(Boolean).join(' / ')
                    : null;

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: 16,
                        padding: '16px 20px',
                        borderTop: idx > 0 ? `1px solid ${LINE}` : 'none',
                        background: '#fff',
                      }}
                    >
                      {/* Imagen */}
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 6,
                          background: '#eeece5',
                          flexShrink: 0,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {prod?.imagenes?.[0] ? (
                          <Image
                            src={prod.imagenes[0]}
                            alt={prod.nombre}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 15, color: INK, marginBottom: 2 }}>
                          {prod?.nombre ?? 'Producto'}
                        </p>
                        {varLabel && (
                          <p style={{ fontFamily: F_MONO, fontSize: 11, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                            {varLabel}
                          </p>
                        )}
                        <p style={{ fontSize: 13, color: '#777' }}>
                          Cantidad: {item.cantidad}
                        </p>
                      </div>

                      {/* Precio */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 15, color: INK }}>
                          {formatPrice(item.subtotal)}
                        </p>
                        {item.cantidad > 1 && (
                          <p style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                            {formatPrice(item.precio_unitario)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Grid inferior: dirección + resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

              {/* Dirección de envío */}
              <section>
                <h2
                  style={{
                    fontFamily: F_DISPLAY,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: INK,
                    opacity: 0.4,
                    marginBottom: 16,
                  }}
                >
                  Dirección de envío
                </h2>
                <div
                  style={{
                    border: `1px solid ${LINE}`,
                    borderRadius: 8,
                    padding: '20px 24px',
                    background: '#fff',
                    lineHeight: 1.7,
                  }}
                >
                  <p style={{ fontFamily: F_DISPLAY, fontWeight: 600, color: INK }}>
                    {pedido.cliente_nombre}
                  </p>
                  <p style={{ color: '#555', fontSize: 14 }}>{dir.direccion}</p>
                  <p style={{ color: '#555', fontSize: 14 }}>
                    {dir.ciudad}, {dir.provincia} {dir.codigo_postal}
                  </p>
                  {dir.telefono && (
                    <p style={{ color: '#777', fontSize: 13, marginTop: 8 }}>
                      Tel: {dir.telefono}
                    </p>
                  )}
                  <p style={{ color: '#777', fontSize: 13, marginTop: 4 }}>
                    {pedido.cliente_email}
                  </p>
                </div>
              </section>

              {/* Resumen de costos */}
              <section>
                <h2
                  style={{
                    fontFamily: F_DISPLAY,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: INK,
                    opacity: 0.4,
                    marginBottom: 16,
                  }}
                >
                  Resumen
                </h2>
                <div
                  style={{
                    border: `1px solid ${LINE}`,
                    borderRadius: 8,
                    padding: '20px 24px',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: '#666' }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(pedido.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${LINE}` }}>
                    <span style={{ fontSize: 14, color: '#666' }}>Envío</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{formatPrice(pedido.costo_envio)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 16, color: INK }}>Total</span>
                    <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 18, color: 'var(--accent, #0a0a0a)' }}>
                      {formatPrice(pedido.total)}
                    </span>
                  </div>

                  {pedido.created_at && (
                    <p style={{ fontFamily: F_MONO, fontSize: 11, color: '#aaa', marginTop: 16, letterSpacing: '0.04em' }}>
                      {formatDate(pedido.created_at)}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Tira informativa */}
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 1,
                background: LINE,
                border: `1px solid ${LINE}`,
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
                      <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
                      <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
                      <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
                      <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                      <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
                      <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
                    </svg>
                  ),
                  title: 'Fabricación bajo demanda',
                  desc: '5 a 10 días hábiles de producción',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="m16 8 4.5 3L23 8v8a2 2 0 0 1-2 2H4" />
                    </svg>
                  ),
                  title: 'Seguimiento por email',
                  desc: `Actualizaciones a ${pedido.cliente_email}`,
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  title: '¿Consultas?',
                  desc: 'Escribinos por redes sociales',
                },
              ].map((cell, i) => (
                <div
                  key={i}
                  style={{
                    background: PAPER,
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ color: 'var(--accent, #0a0a0a)', opacity: 0.7 }}>{cell.icon}</div>
                  <p style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 14, color: INK }}>
                    {cell.title}
                  </p>
                  <p style={{ fontSize: 13, color: '#777', lineHeight: 1.4 }}>{cell.desc}</p>
                </div>
              ))}
            </section>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href={`/${params.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: INK,
                  color: PAPER,
                  padding: '14px 28px',
                  borderRadius: 4,
                  fontFamily: F_DISPLAY,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                Seguir comprando
              </Link>
              <Link
                href={`/${params.slug}/productos`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: INK,
                  padding: '14px 28px',
                  borderRadius: 4,
                  border: `1px solid ${LINE}`,
                  fontFamily: F_DISPLAY,
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                Ver todos los productos
              </Link>
            </div>

          </div>
        </div>
      </div>
    </TiendaLayout>
  );
}

export async function generateMetadata({ params }: PedidoPageProps) {
  return {
    title: `Pedido confirmado — #${params.id.slice(0, 8).toUpperCase()}`,
    robots: 'noindex',
  };
}
