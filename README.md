# Plataforma de Tiendas para Clubes Deportivos

Una plataforma multi-tenant que permite a clubes deportivos tener su propia tienda online donde venden productos fabricados bajo demanda.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + React 18
- **Estilos:** Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Supabase Edge Functions
- **Base de Datos:** Supabase PostgreSQL con Row Level Security
- **Autenticación:** Supabase Auth
- **Pagos:** Stripe Connect (para pagos divididos entre plataforma y clubes)
- **Hosting:** Vercel + Supabase Cloud

## 📋 Características

### Para Compradores (Socios de Clubes)
- Tiendas personalizadas con branding del club
- Catálogo de productos con variantes (talla, color)
- Carrito de compras con persistencia local
- Checkout seguro con Stripe
- Seguimiento de pedidos en tiempo real

### Para Clubes (Panel de Administración)
- Dashboard con métricas de ventas
- Gestión de catálogo de productos
- Seguimiento de pedidos
- Configuración de perfil y branding
- Reportes de comisiones

### Para la Plataforma
- Gestión multi-tenant
- Sistema de comisiones automático
- Webhooks de Stripe para sincronización de pagos

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en Stripe

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd clubes-tienda-platform
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```
Editar `.env.local` con tus credenciales de Supabase y Stripe.

4. **Configurar Supabase**

Ir a tu proyecto de Supabase y ejecutar el siguiente SQL en el Editor SQL:

```sql
-- Tabla de clubes
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  logo_url TEXT,
  color_primario TEXT DEFAULT '#1a1a1a',
  color_secundario TEXT DEFAULT '#ffffff',
  stripe_account_id TEXT,
  comision_porcentaje DECIMAL DEFAULT 15,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de usuarios de club
CREATE TABLE usuarios_club (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, auth_user_id)
);

-- Tabla de productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL NOT NULL,
  costo_produccion DECIMAL NOT NULL,
  categoria TEXT,
  imagenes JSONB DEFAULT '[]',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de variantes de producto
CREATE TABLE variantes_producto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  talla TEXT,
  color TEXT,
  sku TEXT UNIQUE,
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id),
  numero_pedido TEXT UNIQUE NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  cliente_email TEXT NOT NULL,
  cliente_nombre TEXT NOT NULL,
  cliente_telefono TEXT,
  direccion_envio JSONB NOT NULL,
  subtotal DECIMAL NOT NULL,
  costo_envio DECIMAL DEFAULT 0,
  total DECIMAL NOT NULL,
  comision_plataforma DECIMAL,
  pago_club DECIMAL,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  tracking_number TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Tabla de items de pedido
CREATE TABLE items_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  variante_id UUID REFERENCES variantes_producto(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL NOT NULL,
  subtotal DECIMAL NOT NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_productos_club ON productos(club_id);
CREATE INDEX idx_pedidos_club ON pedidos(club_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_numero ON pedidos(numero_pedido);

-- Row Level Security
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_club ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_pedido ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura para tiendas
CREATE POLICY "Clubs activos son públicos" ON clubs
  FOR SELECT USING (activo = true);

CREATE POLICY "Productos activos son públicos" ON productos
  FOR SELECT USING (activo = true);

CREATE POLICY "Variantes activas son públicas" ON variantes_producto
  FOR SELECT USING (activo = true);

-- Políticas para administradores de club
CREATE POLICY "Admins pueden ver su club" ON clubs
  FOR ALL USING (
    id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins pueden gestionar productos" ON productos
  FOR ALL USING (
    club_id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins pueden ver pedidos de su club" ON pedidos
  FOR SELECT USING (
    club_id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins pueden actualizar pedidos" ON pedidos
  FOR UPDATE USING (
    club_id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Permitir crear pedidos públicamente (checkout)
CREATE POLICY "Cualquiera puede crear pedidos" ON pedidos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Cualquiera puede crear items de pedido" ON items_pedido
  FOR INSERT WITH CHECK (true);

-- Función para generar número de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_pedido := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();
```

5. **Configurar Stripe Webhooks**

Para desarrollo local:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Para producción, configurar el webhook en el Dashboard de Stripe apuntando a:
`https://tu-dominio.com/api/webhooks/stripe`

6. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── (tienda)/          # Rutas públicas de tiendas
│   │   └── [slug]/        # Tienda de cada club
│   ├── dashboard/         # Panel de administración
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes React
│   ├── tienda/           # Componentes de tienda pública
│   ├── dashboard/        # Componentes del panel admin
│   └── ui/               # Componentes shadcn/ui
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
├── services/            # Servicios de negocio
├── stores/              # Zustand stores
└── types/               # TypeScript types
```

## 🔑 URLs Principales

- `/[slug]` - Tienda pública del club
- `/[slug]/producto/[id]` - Detalle de producto
- `/[slug]/checkout` - Checkout
- `/[slug]/pedido/[id]` - Estado del pedido
- `/dashboard` - Panel de administración
- `/dashboard/productos` - Gestión de productos
- `/dashboard/pedidos` - Gestión de pedidos
- `/dashboard/configuracion` - Configuración del club

## 🚀 Despliegue

### Vercel

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Desplegar

### Variables de Entorno en Producción

Asegurarse de configurar todas las variables de `.env.example` en el panel de Vercel.

## 📝 Licencia

MIT
