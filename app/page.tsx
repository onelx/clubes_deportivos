import Link from "next/link";
import { ShoppingBag, Users, TrendingUp, Shield } from "lucide-react";

// Página principal de la plataforma (landing page)
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">ClubStores</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo-club" className="text-gray-600 hover:text-gray-900">
              Ver Demo
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm py-2">
              Panel de Club
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tu club, tu tienda, tu marca
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Crea una tienda online personalizada para tu club deportivo. 
            Nosotros fabricamos y enviamos, tú ganas comisiones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo-club" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Ver Tienda Demo
            </Link>
            <Link href="/contacto" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Contactar Ventas
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegir ClubStores?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-12 w-12 text-blue-600" />}
              title="Para tu comunidad"
              description="Tus socios podrán comprar merchandising oficial del club con tu branding exclusivo."
            />
            <FeatureCard
              icon={<TrendingUp className="h-12 w-12 text-blue-600" />}
              title="Sin inversión inicial"
              description="No necesitas stock. Fabricamos bajo demanda cada pedido y lo enviamos directo al cliente."
            />
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-blue-600" />}
              title="Gana comisiones"
              description="Recibe un porcentaje de cada venta automáticamente en tu cuenta."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-gray-300 mb-8">
            Únete a cientos de clubes que ya venden con ClubStores
          </p>
          <Link href="/registro" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
            Crear mi tienda gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 ClubStores. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
