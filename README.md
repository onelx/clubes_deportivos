# ClubStore - Plataforma de Tiendas para Clubes Deportivos

Plataforma que permite a clubes deportivos tener su propia tienda online donde venden productos fabricados bajo demanda.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Supabase Edge Functions
- **Base de Datos**: Supabase PostgreSQL con Row Level Security
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe Connect (para pagos divididos entre plataforma y clubes)
- **Hosting**: Vercel + Supabase Cloud

## 📋 Requisitos Previos

- Node.js 18.17 o superior
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Stripe](https://stripe.com)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd clubes-tiendas-platform
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase y Stripe.

### 4. Configurar Supabase

#### Crear las tablas en Supabase:

Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de clubes
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  logo_url TEXT,
  color_primario TEXT DEFAULT '#1e40af',
  color_secundario TEXT DEFAULT '#3b82f6',
  stripe_account_id TEXT,
  comision_porcentaje DECIMAL(5,2) DEFAULT 15.00,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de usuarios del club (administradores)
CREATE TABLE usuarios_club (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, auth_user_id)
);

-- Tabla de productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10,2) NOT NULL,
  costo_produccion DECIMAL(10,2) NOT NULL,
  categoria TEXT,
  imagenes JSONB DEFAULT '[]',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de variantes de producto
CREATE TABLE variantes_producto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  talla TEXT,
  color TEXT,
  sku TEXT UNIQUE,
  activo BOOLEAN DEFAULT true
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id),
  numero_pedido TEXT UNIQUE NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  cliente_email TEXT NOT NULL,
  cliente_nombre TEXT NOT NULL,
  direccion_envio JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  costo_envio DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  comision_plataforma DECIMAL(10,2),
  pago_club DECIMAL(10,2),
  stripe_payment_intent_id TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ
);

-- Tabla de items de pedido
CREATE TABLE items_pedido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  variante_id UUID REFERENCES variantes_producto(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Índices para mejor rendimiento
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

-- Políticas para clubs (lectura pública de clubes activos)
CREATE POLICY "Clubs activos son públicos" ON clubs
  FOR SELECT USING (activo = true);

CREATE POLICY "Admins pueden actualizar su club" ON clubs
  FOR UPDATE USING (
    id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Políticas para productos (lectura pública de productos activos)
CREATE POLICY "Productos activos son públicos" ON productos
  FOR SELECT USING (activo = true);

CREATE POLICY "Admins pueden gestionar productos de su club" ON productos
  FOR ALL USING (
    club_id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Políticas para variantes
CREATE POLICY "Variantes de productos activos son públicas" ON variantes_producto
  FOR SELECT USING (
    producto_id IN (SELECT id FROM productos WHERE activo = true)
  );

-- Políticas para pedidos
CREATE POLICY "Admins pueden ver pedidos de su club" ON pedidos
  FOR SELECT USING (
    club_id IN (
      SELECT club_id FROM usuarios_club 
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Cualquiera puede crear pedidos" ON pedidos
  FOR INSERT WITH CHECK (true);

-- Políticas para items de pedido
CREATE POLICY "Items visibles con el pedido" ON items_pedido
  FOR SELECT USING (
    pedido_id IN (
      SELECT id FROM pedidos WHERE club_id IN (
        SELECT club_id FROM usuarios_club 
        WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Cualquiera puede crear items" ON items_pedido
  FOR INSERT WITH CHECK (true);
```

### 5. Configurar Stripe

1. Crea una cuenta en [Stripe Dashboard](https://dashboard.stripe.com)
2. Habilita Stripe Connect en Settings > Connect
3. Copia las claves API a tu `.env.local`
4. Configura un webhook apuntando a `https://tu-dominio.com/api/webhooks/stripe`

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── (tienda)/          # Rutas públicas de tiendas
│   ├── (dashboard)/       # Panel de administración
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── tienda/           # Componentes de tienda
│   └── dashboard/        # Componentes de dashboard
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
├── services/             # Servicios de negocio
├── types/                # Tipos TypeScript
└── public/               # Assets estáticos
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente con cada push a `main`

### Variables de entorno en producción

Asegúrate de configurar todas las variables de `.env.example` en tu plataforma de hosting.

## 📝 Licencia

MIT
