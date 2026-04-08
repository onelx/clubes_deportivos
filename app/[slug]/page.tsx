import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TiendaLayout } from "@/components/TiendaLayout";
import { ProductoCard } from "@/components/ProductoCard";
import type { Club, Producto } from "@/types";

interface TiendaPageProps {
  params: { slug: string };
}

// Página principal de la tienda de un club
export default async function TiendaPage({ params }: TiendaPageProps) {
  const supabase = await createClient();
  
  // Obtener datos del club
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", params.slug)
    .eq("activo", true)
    .single();

  if (clubError || !club) {
    notFound();
  }

  // Obtener productos del club
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("club_id", club.id)
    .eq("activo", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <TiendaLayout club={club as Club}>
      {/* Hero section */}
      <section 
        className="py-20 text-center text-white"
        style={{ backgroundColor: club.color_primario }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tienda Oficial {club.nombre}
          </h1>
          <p className="text-xl opacity-90">
            Equipamiento y merchandising exclusivo para socios y aficionados
          </p>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Productos destacados</h2>
          
          {productos && productos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <ProductoCard 
                  key={producto.id} 
                  producto={producto as Producto} 
                  clubSlug={params.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                Próximamente nuevos productos disponibles
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Banner de información */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-club-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600 text-sm">Materiales de primera calidad para máximo confort</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-club-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Envío a Domicilio</h3>
              <p className="text-gray-600 text-sm">Recibe tu pedido cómodamente en casa</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-club-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Apoyas al Club</h3>
              <p className="text-gray-600 text-sm">Parte de cada compra va directamente al club</p>
            </div>
          </div>
        </div>
      </section>
    </TiendaLayout>
  );
}

// Generar metadata dinámica
export async function generateMetadata({ params }: TiendaPageProps) {
  const supabase = await createClient();
  
  const { data: club } = await supabase
    .from("clubs")
    .select("nombre")
    .eq("slug", params.slug)
    .single();

  return {
    title: club ? `Tienda ${club.nombre}` : "Tienda no encontrada",
    description: club ? `Tienda oficial de ${club.nombre}. Equipamiento y merchandising exclusivo.` : "",
  };
}
