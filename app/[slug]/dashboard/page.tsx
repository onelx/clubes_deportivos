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

  redirect(`/dashboard?as=${club.id}`);
}
