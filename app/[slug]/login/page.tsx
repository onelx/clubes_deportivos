import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClubLoginForm } from './ClubLoginForm';

interface Props {
  params: { slug: string };
}

export default async function ClubLoginPage({ params }: Props) {
  const supabase = await createClient();

  const { data: club } = await supabase
    .from('clubs')
    .select('nombre, slug, logo_url, color_primario')
    .eq('slug', params.slug)
    .eq('activo', true)
    .single();

  if (!club) notFound();

  return (
    <ClubLoginForm
      clubNombre={club.nombre}
      clubSlug={club.slug}
      clubLogoUrl={club.logo_url ?? null}
      colorPrimario={club.color_primario ?? '#111111'}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient();
  const { data: club } = await supabase
    .from('clubs')
    .select('nombre')
    .eq('slug', params.slug)
    .single();

  return {
    title: club ? `Iniciar sesión — ${club.nombre}` : 'Iniciar sesión',
  };
}
