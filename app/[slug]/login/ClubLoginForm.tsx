'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface Props {
  clubId: string;
  clubNombre: string;
  clubSlug: string;
  clubLogoUrl: string | null;
  colorPrimario: string;
}

export function ClubLoginForm({ clubId, clubNombre, clubSlug, clubLogoUrl, colorPrimario }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      const isSuperAdmin = email === process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;
      router.push(isSuperAdmin ? `/${clubSlug}/dashboard` : '/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas. Verificá tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Club branding */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {clubLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clubLogoUrl}
              alt={clubNombre}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }}
            />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: colorPrimario,
              margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#fff',
            }}>
              {clubNombre.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>{clubNombre}</h1>
          <p style={{ color: '#888', marginTop: 4, fontSize: 14 }}>Panel de administración</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/reset-password" style={{ fontSize: 12, color: '#888', textDecoration: 'underline' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              style={{ background: colorPrimario, border: 'none', marginTop: 4 }}
            >
              {loading ? (
                <><Loader2 size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />Iniciando sesión...</>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href={`/${clubSlug}`} style={{ fontSize: 13, color: '#aaa', textDecoration: 'underline' }}>
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
