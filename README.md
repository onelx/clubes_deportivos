# ClubShop Platform

Plataforma de tiendas online para clubes deportivos con fabricación bajo demanda.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Supabase Edge Functions
- **Base de Datos**: Supabase PostgreSQL con Row Level Security
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe + Stripe Connect
- **Hosting**: Vercel + Supabase Cloud

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratis en supabase.com)
- Cuenta de Stripe (gratis en stripe.com)

## 🛠️ Setup Local

### 1. Clonar y instalar dependencias

```bash
git clone <repo-url>
cd clubshop-platform
npm install
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a Settings > API y copiar:
   - Project URL
   - anon public key
   - service_role key (⚠️ nunca exponer en frontend)

3. Ejecutar el script SQL de migración (ver `/supabase/migrations/001_initial_schema.sql`):

```sql
-- Ir a SQL Editor en Supabase Dashboard y ejecutar el script completo
```

4. Configurar Storage:
   - Ir a Storage
   - Crear bucket público llamado `productos`
   - Permitir subida de imágenes (jpg, png, webp)

5. Configurar políticas de RLS (Row Level Security):
   - Las políticas están incluidas en el script de migración
   - Verificar que estén activas en Authentication > Policies

### 3. Configurar Stripe

1. Crear cuenta en [stripe.com](https://stripe.com)
2. Ir a Developers > API Keys y copiar:
   - Publishable key
   - Secret key

3. Configurar Webhook para eventos de pago:
   - Ir a Developers > Webhooks
   - Agregar endpoint: `https://tu-dominio.com/api/webhooks/stripe`
   - Seleccionar eventos: `checkout.session.completed`, `payment_intent.succeeded`
   - Copiar el Webhook Secret

4. Habilitar Stripe Connect (para pagos a clubes):
   - Ir a Connect > Settings
   - Activar modo Express

### 4. Variables de Entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales.

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
clubshop-platform/
├── app/
│   ├── (tienda)/
│   │   └── [slug]/              # Tienda pública del club
│   ├── (dashboard)/
│   │   └── dashboard/           # Panel de administración del club
│   ├── api/                     # API Routes
│   ├── layout.tsx               # Layout raíz
│   └── globals.css
├── components/
│   ├── ui/                      # Componentes shadcn/ui
│   ├── tienda/                  # Componentes de tienda
│   └── dashboard/               # Componentes de dashboard
├── lib/
│   ├── supabase.ts              # Cliente Supabase
│   ├── utils.ts                 # Utilidades
│   └── services/                # Lógica de negocio
├── hooks/                       # Custom React Hooks
├── types/                       # TypeScript types
└── public/                      # Assets estáticos
```

## 🗄️ Schema de Base de Datos

### Tablas Principales

- **clubs**: Información de clubes
- **usuarios_club**: Relación usuarios-clubes
- **productos**: Catálogo de productos
- **variantes_producto**: Tallas/colores de productos
- **pedidos**: Órdenes de compra
- **items_pedido**: Líneas de pedido

Ver el esquema completo en `/types/index.ts` y el SQL en `/supabase/migrations/`

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas que:

- Permiten lectura pública de productos activos
- Restringen escritura solo a usuarios autenticados del club
- Aíslan datos entre clubes
- Protegen información sensible de pedidos

### Variables de Entorno

- **NUNCA** commitear `.env.local`
- Usar `NEXT_PUBLIC_*` solo para valores que pueden ser públicos
- Rotar keys regularmente
- Usar diferentes keys para dev/staging/producción

## 🚀 Deploy a Producción

### Vercel (Recomendado)

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático en cada push a main

### Variables de Entorno en Vercel

Agregar todas las variables de `.env.example` en:
- Settings > Environment Variables
- Configurar para Production, Preview, Development

### Actualizar Webhook de Stripe

Cambiar la URL del webhook a tu dominio de producción:
```
https://tu-dominio.vercel.app/api/webhooks/stripe
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 Flujo de Trabajo

### Cliente (Socio del Club)

1. Visitar `tudominio.com/nombre-club`
2. Navegar catálogo de productos
3. Agregar al carrito
4. Checkout con Stripe
5. Recibir confirmación por email
6. Trackear pedido

### Administrador del Club

1. Login en `/dashboard`
2. Crear productos con variantes
3. Ver pedidos en tiempo real
4. Actualizar estados de pedidos
5. Ver estadísticas de ventas
6. Recibir pagos vía Stripe Connect

## 🆘 Troubleshooting

### Error: "Supabase client not initialized"
- Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas

### Error: "Stripe error"
- Verificar que las keys de Stripe sean correctas
- En desarrollo, usar keys de test (`sk_test_...`)

### Imágenes no cargan
- Verificar que el bucket `productos` exista
- Verificar que sea público
- Verificar configuración de CORS en Supabase Storage

### RLS bloquea queries
- Verificar que las políticas de RLS estén correctas
- Usar `service_role_key` en server-side cuando sea necesario
- Nunca usar `service_role_key` en client-side

## 📚 Documentación Adicional

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

## 🤝 Contribuir

1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver LICENSE file

## 👥 Soporte

Para soporte, email a soporte@tudominio.com o crear un issue en GitHub.
