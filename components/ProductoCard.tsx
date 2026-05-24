"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Producto, VarianteProducto, CuotasConfig } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

interface ProductoCardProps {
  producto: Producto & { variantes?: VarianteProducto[] };
  clubSlug: string;
  index?: number;
  accentColor?: string;
  cuotasConfig?: CuotasConfig | null;
}

export function ProductoCard({
  producto,
  clubSlug,
  index = 0,
  accentColor = "#FF4D1F",
  cuotasConfig = null,
}: ProductoCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const [hovered, setHovered] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [tallePopupOpen, setTallePopupOpen] = useState(false);

  const variantesActivas = (producto.variantes ?? []).filter((v) => v.activo);
  const imagen1 = producto.imagenes?.[0] ?? null;
  const imagen2 = producto.imagenes?.[1] ?? null;
  const nuevo = isNew(producto.created_at);
  const hasPrecioComparacion =
    producto.precio_comparacion != null &&
    producto.precio_comparacion > producto.precio_base;

  // Load favorito from localStorage
  useEffect(() => {
    try {
      const key = `fav_${clubSlug}_${producto.id}`;
      setFavorito(localStorage.getItem(key) === "1");
    } catch {
      // localStorage not available (SSR safety)
    }
  }, [clubSlug, producto.id]);

  const toggleFavorito = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const key = `fav_${clubSlug}_${producto.id}`;
      const next = !favorito;
      if (next) {
        localStorage.setItem(key, "1");
      } else {
        localStorage.removeItem(key);
      }
      setFavorito(next);
    } catch {
      // ignore
    }
  };

  const openTallePopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantesActivas.length === 0) {
      // No variants — add directly
      addItem(producto, null, 1);
      toast({ title: `${producto.nombre} agregado al carrito` });
      return;
    }
    setTallePopupOpen(true);
  };

  const handleSelectTalle = (e: React.MouseEvent, variante: VarianteProducto) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(producto, variante, 1);
    toast({ title: `${producto.nombre} (${variante.talla ?? variante.color ?? "variante"}) agregado al carrito` });
    setTallePopupOpen(false);
  };

  const closeTallePopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTallePopupOpen(false);
  };

  const handleWrapperClick = (e: React.MouseEvent) => {
    if (tallePopupOpen) {
      e.preventDefault();
      setTallePopupOpen(false);
    }
  };

  // Cuotas calculation
  const cuotasMonto =
    cuotasConfig != null
      ? Math.round(producto.precio_base / cuotasConfig.cantidad)
      : null;

  return (
    <div style={{ position: "relative" }}>
      <Link
        href={`/${clubSlug}/producto/${producto.id}`}
        onClick={handleWrapperClick}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {/* ── Image ─────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/5",
            background: "#eeece5",
            overflow: "hidden",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Dashed inner border */}
          <div
            style={{
              position: "absolute",
              inset: 16,
              border: "1px dashed rgba(0,0,0,.1)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Image 1 */}
          {imagen1 ? (
            <img
              src={imagen1}
              alt={producto.nombre}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.4s ease",
                opacity: hovered && imagen2 ? 0 : 1,
              }}
            />
          ) : (
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,.32)",
              }}
            >
              {producto.nombre}
            </span>
          )}

          {/* Image 2 (crossfade on hover) */}
          {imagen2 && (
            <img
              src={imagen2}
              alt={`${producto.nombre} — vista 2`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.4s ease",
                opacity: hovered ? 1 : 0,
              }}
            />
          )}

          {/* Badge NUEVO */}
          {nuevo && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "5px 9px",
                background: accentColor,
                color: "#fff",
                zIndex: 2,
              }}
            >
              Nuevo
            </div>
          )}

          {/* Favorito button */}
          <button
            onClick={toggleFavorito}
            aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 3,
              background: "rgba(255,255,255,0.85)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "transform 0.15s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={favorito ? "#e11d48" : "none"}
              stroke={favorito ? "#e11d48" : "#0a0a0a"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* PERSONALIZABLE bar */}
          {producto.personalizable && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(30,30,30,0.75)",
                color: "#fafaf7",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                textAlign: "center",
                padding: "6px 0",
                zIndex: 2,
              }}
            >
              Personalizable
            </div>
          )}
        </div>

        {/* ── Info ──────────────────────────────────────── */}

        {/* Categoría */}
        {producto.categoria && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#8c8a82",
            }}
          >
            {producto.categoria}
          </div>
        )}

        {/* Nombre */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "17px",
            letterSpacing: "-.01em",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {producto.nombre}
        </h3>

        {/* Precios */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {hasPrecioComparacion && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "#9ca3af",
                textDecoration: "line-through",
              }}
            >
              {fmt(producto.precio_comparacion!)}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: ".02em",
                color: "#0a0a0a",
              }}
            >
              {fmt(producto.precio_base)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "#6b7280",
              }}
            >
              (IVA incluido)
            </span>
          </div>

          {/* Cuotas */}
          {cuotasConfig && cuotasMonto !== null && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#374151",
                marginTop: 2,
              }}
            >
              {cuotasConfig.cantidad} cuotas{cuotasConfig.sin_interes ? " S/I" : ""} de{" "}
              {fmt(cuotasMonto)} con {cuotasConfig.banco}
            </div>
          )}
        </div>

        {/* Talle button */}
        <button
          onClick={openTallePopup}
          style={{
            padding: "10px 16px",
            background: "#0a0a0a",
            color: "#fafaf7",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {variantesActivas.length > 0 ? "Seleccionar talle" : "Agregar al carrito"}
          {variantesActivas.length > 0 && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </button>
      </Link>

      {/* ── Talle popup ──────────────────────────────── */}
      {tallePopupOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTallePopupOpen(false); }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% - 48px)",
              left: 0,
              right: 0,
              zIndex: 50,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                Elegir talle
              </span>
              <button
                onClick={(e) => closeTallePopup(e)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: 1,
                  padding: 2,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {variantesActivas.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => handleSelectTalle(e, v)}
                  style={{
                    padding: "8px 16px",
                    background: "#0a0a0a",
                    color: "#fafaf7",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: ".1em",
                    border: "1px solid #0a0a0a",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {v.talla ?? v.color ?? "Variante"}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
