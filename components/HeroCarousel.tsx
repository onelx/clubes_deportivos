'use client';

import { useEffect, useState } from 'react';

interface HeroCarouselProps {
  imagenes: (string | null)[];
  nombre: string;
  accent: string;
  fMono: string;
}

export function HeroCarousel({ imagenes, nombre, accent, fMono }: HeroCarouselProps) {
  const urls = imagenes.filter((u): u is string => Boolean(u));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (urls.length < 2) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % urls.length);
    }, 3500);
    return () => clearInterval(id);
  }, [urls.length]);

  if (urls.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.18)', fontFamily: fMono, fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase' }}>
        <div style={{ position: 'absolute', inset: 24, border: '1px dashed rgba(255,255,255,.12)' }} />
        <span style={{ position: 'relative', padding: '6px 12px', background: '#171717' }}>Imagen · {nombre}</span>
      </div>
    );
  }

  return (
    <>
      {urls.map((url, i) => (
        <img
          key={url}
          src={url}
          alt={`${nombre} ${i + 1}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      ))}

      {/* Dots indicadores */}
      <div style={{ position: 'absolute', right: 32, bottom: 24, display: 'flex', gap: 8, zIndex: 3 }}>
        {urls.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 24,
              height: 2,
              background: i === current ? accent : 'rgba(255,255,255,.2)',
              display: 'block',
              border: 'none',
              cursor: urls.length > 1 ? 'pointer' : 'default',
              padding: 0,
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </>
  );
}
