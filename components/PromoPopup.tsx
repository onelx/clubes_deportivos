'use client';

import { useEffect, useState } from 'react';
import type { PopupConfig } from '@/types';

interface PromoPopupProps {
  config: PopupConfig;
  clubNombre: string;
  logoUrl: string | null;
  colorPrimario: string;
  colorSecundario: string;
  slug: string;
}

export function PromoPopup({
  config,
  clubNombre,
  logoUrl,
  colorPrimario,
  colorSecundario,
  slug,
}: PromoPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config.activo) return;

    // Mostrar una vez por día por club
    const key = `popup_shown_${slug}`;
    const lastShown = localStorage.getItem(key);
    const today = new Date().toDateString();
    if (lastShown === today) return;

    // Pequeño delay para que la página cargue primero
    const id = setTimeout(() => {
      setVisible(true);
      localStorage.setItem(key, today);
    }, 600);

    return () => clearTimeout(id);
  }, [config.activo, slug]);

  if (!visible) return null;

  const close = () => setVisible(false);

  const handleBtn = (url: string) => {
    close();
    if (url) window.location.href = url;
  };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colorPrimario,
          borderRadius: 16,
          maxWidth: 480,
          width: '100%',
          padding: '40px 36px 36px',
          position: 'relative',
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Close */}
        <button
          onClick={close}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            color: colorSecundario,
            fontSize: 18,
            lineHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Logo */}
        {logoUrl && (
          <div style={{ marginBottom: 20 }}>
            <img
              src={logoUrl}
              alt={clubNombre}
              style={{ height: 64, width: 'auto', margin: '0 auto', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Descuento grande */}
        <div
          style={{
            color: colorSecundario,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 'clamp(48px, 14vw, 96px)' }}>
            {config.descuento_texto}
          </span>
          <span style={{ fontSize: 'clamp(28px, 8vw, 52px)', marginLeft: 6 }}>
            {config.descuento_subtexto}
          </span>
        </div>

        {/* Descripción */}
        <p
          style={{
            color: colorSecundario,
            fontSize: 16,
            lineHeight: 1.5,
            marginBottom: 16,
            opacity: 0.95,
          }}
        >
          {config.descripcion}
        </p>

        {/* Código cupón */}
        {config.codigo_cupon && (
          <div
            style={{
              color: colorSecundario,
              fontWeight: 900,
              fontSize: 'clamp(28px, 8vw, 48px)',
              letterSpacing: '0.05em',
              marginBottom: 20,
            }}
          >
            {config.codigo_cupon}
          </div>
        )}

        {/* Texto legal */}
        {config.texto_legal && (
          <p
            style={{
              color: colorSecundario,
              fontSize: 11,
              opacity: 0.7,
              lineHeight: 1.6,
              marginBottom: 24,
              fontStyle: 'italic',
            }}
          >
            {config.texto_legal}
          </p>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {config.label_btn_1 && (
            <button
              onClick={() => handleBtn(config.url_btn_1)}
              style={{
                flex: 1,
                minWidth: 140,
                padding: '14px 16px',
                background: colorSecundario,
                color: colorPrimario,
                border: 'none',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {config.label_btn_1}
            </button>
          )}
          {config.label_btn_2 && (
            <button
              onClick={() => handleBtn(config.url_btn_2)}
              style={{
                flex: 1,
                minWidth: 140,
                padding: '14px 16px',
                background: colorSecundario,
                color: colorPrimario,
                border: 'none',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {config.label_btn_2}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
