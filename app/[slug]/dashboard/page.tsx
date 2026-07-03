import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: { slug: string };
}

export default async function ClubDashboardRedirect({ params }: Props) {
  const supabase = await createClient();

  const { data: club } = await supabase
    .from('clubs')
    .select('id')
    .eq('slug', params.slug)
    .eq('activo', true)
    .single();

  if (!club) notFound();

  // Si hay sesión activa y el usuario es superadmin, impersonamos el club.
  // Para admins propios del club, /dashboard carga su club automáticamente.
  const { data: { user } } = await supabase.auth.getUser();
  const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;

  redirect(isSuperAdmin ? `/dashboard?as=${club.id}` : '/dashboard');
}
