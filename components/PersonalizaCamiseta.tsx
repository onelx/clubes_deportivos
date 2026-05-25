"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";
import type { Producto, VarianteProducto } from "@/types";

const F_DISPLAY = "var(--font-display, 'Space Grotesk', system-ui, sans-serif)";
const F_MONO = "var(--font-mono, 'Space Mono', ui-monospace, monospace)";

interface PersonalizaCamisetaProps {
  producto: Producto & { variantes?: VarianteProducto[] };
  clubSlug: string;
  clubNombre: string;
  accentColor: string;   // color primario del club (fondo de la sección)
  secondaryColor: string; // color secundario (botones, chips activos)
}

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

export function PersonalizaCamiseta({
  producto,
  clubSlug,
  clubNombre,
  accentColor,
  secondaryColor,
}: PersonalizaCamisetaProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(null);
  const [agregado, setAgregado] = useState(false);

  const variantesActivas = (producto.variantes ?? []).filter((v) => v.activo);
  const tallas = [...new Set(variantesActivas.map((v) => v.talla).filter(Boolean))] as string[];
  const hasTallas = tallas.length > 0;

  // Imagen de personalización dedicada, con fallback a segunda imagen del producto
  const imagenDorso = producto.imagen_personalizacion ?? producto.imagenes?.[1] ?? producto.imagenes?.[0] ?? null;

  const bgLight = isLight(accentColor);
  const textColor = bgLight ? "#0a0a0a" : "#fafaf7";
  const textMuted = bgLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)";
  const inputBg = bgLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.1)";
  const inputBorder = bgLight ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.2)";
  const chipBg = bgLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";

  // Color del chip activo: usar secondaryColor si está definido, sino blanco/negro
  const chipActiveBg = secondaryColor || (bgLight ? "#0a0a0a" : "#fff");
  const chipActiveText = isLight(chipActiveBg) ? "#0a0a0a" : "#fff";

  const handleAgregar = () => {
    if (hasTallas && !talleSeleccionado) {
      toast({ title: "Seleccioná un talle antes de agregar" });
      return;
    }

    const variante = talleSeleccionado
      ? variantesActivas.find((v) => v.talla === talleSeleccionado) ?? null
      : null;

    const personalizacion =
      nombre.trim() || numero.trim()
        ? { nombre: nombre.trim().toUpperCase(), numero: numero.trim() }
        : undefined;

    addItem(producto, variante, 1, personalizacion);

    const desc = [
      talleSeleccionado && `Talle ${talleSeleccionado}`,
      nombre.trim() && nombre.trim().toUpperCase(),
      numero.trim() && `#${numero.trim()}`,
    ]
      .filter(Boolean)
      .join(" · ");

    toast({
      title: "¡Camiseta agregada al carrito!",
      description: desc || undefined,
    });

    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  // Tamaño dinámico del nombre en el preview
  const nombrePreview = nombre.trim().toUpperCase() || "TU NOMBRE";
  const numeroPreview = numero.trim() || "10";
  const nombreFontSize = nombrePreview.length > 10 ? 22 : nombrePreview.length > 7 ? 28 : 34;

  return (
    <section
      style={{
        background: accentColor,
        color: textColor,
        padding: "64px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ruido decorativo de fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${textColor} 0px,
            ${textColor} 1px,
            transparent 1px,
            transparent 12px
          )`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header de sección */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: F_MONO,
              fontSize: "10px",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: textMuted,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: chipActiveBg,
                display: "inline-block",
                opacity: 0.7,
              }}
            />
            {clubNombre} · Personalización
          </div>
          <h2
            style={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-.025em",
              lineHeight: 0.95,
              margin: 0,
              color: textColor,
            }}
          >
            Personalizá{" "}
            <em style={{ fontStyle: "normal", color: chipActiveBg }}>
              tu camiseta
            </em>
          </h2>
        </div>

        {/* Grid: formulario + preview */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 56, alignItems: "center" }}
        >
          {/* ── Formulario ─────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Nombre */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: F_MONO,
                  fontSize: "10px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: textMuted,
                  marginBottom: 8,
                }}
              >
                Tu nombre en la camiseta
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value.slice(0, 14))}
                placeholder="Ej: ZEBALLOS"
                maxLength={14}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: 4,
                  color: textColor,
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  fontFamily: F_MONO,
                  fontSize: "9px",
                  letterSpacing: ".1em",
                  color: textMuted,
                  marginTop: 5,
                  textAlign: "right",
                }}
              >
                {nombre.length}/14
              </div>
            </div>

            {/* Número */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: F_MONO,
                  fontSize: "10px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: textMuted,
                  marginBottom: 8,
                }}
              >
                Número
              </label>
              <input
                type="number"
                value={numero}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                  setNumero(v);
                }}
                placeholder="10"
                min={1}
                max={99}
                style={{
                  width: 120,
                  padding: "14px 16px",
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: 4,
                  color: textColor,
                  fontFamily: F_DISPLAY,
                  fontWeight: 900,
                  fontSize: 28,
                  letterSpacing: ".02em",
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>

            {/* Talles */}
            {hasTallas && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: F_MONO,
                    fontSize: "10px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: textMuted,
                    marginBottom: 12,
                  }}
                >
                  Talle{talleSeleccionado ? `: ${talleSeleccionado}` : ""}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tallas.map((t) => {
                    const isSelected = talleSeleccionado === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setTalleSeleccionado(t)}
                        style={{
                          padding: "10px 20px",
                          background: isSelected ? chipActiveBg : chipBg,
                          color: isSelected ? chipActiveText : textColor,
                          fontFamily: F_MONO,
                          fontSize: "12px",
                          letterSpacing: ".12em",
                          border: `1px solid ${isSelected ? chipActiveBg : inputBorder}`,
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: isSelected ? 700 : 400,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Precio */}
            <div
              style={{
                padding: "16px 0",
                borderTop: `1px solid ${inputBorder}`,
                borderBottom: `1px solid ${inputBorder}`,
              }}
            >
              <div
                style={{
                  fontFamily: F_MONO,
                  fontSize: "10px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: textMuted,
                  marginBottom: 4,
                }}
              >
                {producto.nombre}
              </div>
              <div
                style={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: 28,
                  color: textColor,
                  letterSpacing: "-.01em",
                }}
              >
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(producto.precio_base)}
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={handleAgregar}
              style={{
                width: "100%",
                padding: "18px 24px",
                background: agregado ? "#16a34a" : chipActiveBg,
                color: agregado ? "#fff" : chipActiveText,
                fontFamily: F_MONO,
                fontSize: "11px",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                fontWeight: 700,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {agregado ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  ¡Agregada al carrito!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Agregar al carrito
                </>
              )}
            </button>

            <p
              style={{
                fontFamily: F_MONO,
                fontSize: "10px",
                letterSpacing: ".1em",
                color: textMuted,
                lineHeight: 1.6,
                marginTop: -12,
              }}
            >
              ✓ Fabricado bajo demanda · Nombre impreso en la espalda
            </p>
          </div>

          {/* ── Preview camiseta ────────────────── */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                aspectRatio: "4/5",
                borderRadius: 8,
                overflow: "hidden",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              {/* Imagen de la camiseta */}
              {imagenDorso ? (
                <img
                  src={imagenDorso}
                  alt={`Camiseta ${clubNombre}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                /* Placeholder si no hay imagen */
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 12,
                    color: textMuted,
                  }}
                >
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
                  </svg>
                  <span style={{ fontFamily: F_MONO, fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase" }}>
                    Subí una imagen del dorso
                  </span>
                </div>
              )}

              {/* Overlay: nombre + número */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "8%",
                  gap: 4,
                  pointerEvents: "none",
                }}
              >
                {/* Nombre */}
                <div
                  style={{
                    fontFamily: F_DISPLAY,
                    fontWeight: 900,
                    fontSize: nombreFontSize,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.8)",
                    transition: "font-size 0.2s ease",
                    textAlign: "center",
                    lineHeight: 1,
                    maxWidth: "80%",
                    wordBreak: "break-all",
                  }}
                >
                  {nombrePreview}
                </div>

                {/* Número */}
                <div
                  style={{
                    fontFamily: F_DISPLAY,
                    fontWeight: 900,
                    fontSize: 80,
                    lineHeight: 1,
                    letterSpacing: "-.02em",
                    color: "#ffffff",
                    textShadow: "0 3px 12px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {numeroPreview}
                </div>
              </div>

              {/* Badge "Preview" */}
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  fontFamily: F_MONO,
                  fontSize: "8px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  background: "rgba(0,0,0,0.5)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "4px 8px",
                  borderRadius: 2,
                  backdropFilter: "blur(4px)",
                }}
              >
                Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
