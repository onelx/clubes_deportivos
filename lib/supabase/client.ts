import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para el lado del cliente (browser)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
