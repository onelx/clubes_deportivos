// ===========================================
// MODELOS DE BASE DE DATOS
// ===========================================

export interface Club {
  id: string
  slug: string
  nombre: string
  logo_url: string | null
  color_primario: string
  color_secundario: string
  stripe_account_id: string | null
  comision_porcentaje: number
  activo: boolean
  created_at: string
}

export interface UsuarioClub {
  id: string
  club_id: string
  auth_user_id: string
  rol: 'admin' | 'editor' | 'viewer'
  created_at: string
  club?: Club
}

export interface Producto {
  id: string
  club_id: string
  nombre: string
  descripcion: string | null
  precio_base: number
  costo_produccion: number
  categoria: CategoriaProducto
  imagenes: string[]
  activo: boolean
  created_at: string
  variantes?: VarianteProducto[]
  club?: Club
}

export interface VarianteProducto {
  id: string
  producto_id: string
  talla: string | null
  color: string | null
  sku: string
  activo: boolean
  producto?: Producto
}

export interface Pedido {
  id: string
  club_id: string
  numero_pedido: string
  estado: EstadoPedido
  cliente_email: string
  cliente_nombre: string
  direccion_envio: DireccionEnvio
  subtotal: number
  costo_envio: number
  total: number
  comision_plataforma: number
  pago_club: number
  stripe_payment_intent_id: string | null
  tracking_number: string | null
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  items?: ItemPedido[]
  club?: Club
}

export interface ItemPedido {
  id: string
  pedido_id: string
  producto_id: string
  variante_id: string | null
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto?: Producto
  variante?: VarianteProducto
}

export interface DireccionEnvio {
  nombre: string
  apellido: string
  direccion: string
  direccion2?: string
  ciudad: string
  provincia: string
  codigo_postal: string
  pais: string
  telefono: string
}

// ===========================================
// ENUMS Y TIPOS CONSTANTES
// ===========================================

export type EstadoPedido = 
  | 'pendiente_pago'
  | 'pagado'
  | 'en_produccion'
  | 'producido'
  | 'enviado'
  | 'entregado'
  | 'cancelado'
  | 'reembolsado'

export type CategoriaProducto = 
  | 'camisetas'
  | 'pantalones'
  | 'chaquetas'
  | 'accesorios'
  | 'equipamiento'
  | 'otros'

export const ESTADOS_PEDIDO: Record<EstadoPedido, { label: string; color: string }> = {
  pendiente_pago: { label: 'Pendiente de Pago', color: 'yellow' },
  pagado: { label: 'Pagado', color: 'green' },
  en_produccion: { label: 'En Producción', color: 'blue' },
  producido: { label: 'Producido', color: 'indigo' },
  enviado: { label: 'Enviado', color: 'purple' },
  entregado: { label: 'Entregado', color: 'green' },
  cancelado: { label: 'Cancelado', color: 'red' },
  reembolsado: { label: 'Reembolsado', color: 'gray' },
}

export const CATEGORIAS_PRODUCTO: Record<CategoriaProducto, string> = {
  camisetas: 'Camisetas',
  pantalones: 'Pantalones',
  chaquetas: 'Chaquetas',
  accesorios: 'Accesorios',
  equipamiento: 'Equipamiento',
  otros: 'Otros',
}

export const TALLAS_DISPONIBLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const
export type Talla = typeof TALLAS_DISPONIBLES[number]

export const COLORES_DISPONIBLES = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Rojo', hex: '#EF4444' },
  { nombre: 'Azul', hex: '#3B82F6' },
  { nombre: 'Verde', hex: '#22C55E' },
  { nombre: 'Amarillo', hex: '#EAB308' },
  { nombre: 'Naranja', hex: '#F97316' },
  { nombre: 'Morado', hex: '#A855F7' },
  { nombre: 'Rosa', hex: '#EC4899' },
  { nombre: 'Gris', hex: '#6B7280' },
] as const

// ===========================================
// TIPOS DE CARRITO
// ===========================================

export interface ItemCarrito {
  producto: Producto
  variante: VarianteProducto | null
  cantidad: number
}

export interface Carrito {
  items: ItemCarrito[]
  clubSlug: string | null
}

// ===========================================
// TIPOS DE API - REQUESTS
// ===========================================

export interface CrearPedidoRequest {
  club_id: string
  cliente_email: string
  cliente_nombre: string
  direccion_envio: DireccionEnvio
  items: {
    producto_id: string
    variante_id?: string
    cantidad: number
  }[]
}

export interface CrearProductoRequest {
  nombre: string
  descripcion?: string
  precio_base: number
  costo_produccion: number
  categoria: CategoriaProducto
  imagenes: string[]
  variantes: {
    talla?: string
    color?: string
    sku: string
  }[]
}

export interface ActualizarProductoRequest extends Partial<CrearProductoRequest> {
  activo?: boolean
}

export interface ActualizarEstadoPedidoRequest {
  estado: EstadoPedido
  tracking_number?: string
}

export interface ActualizarPerfilClubRequest {
  nombre?: string
  logo_url?: string
  color_primario?: string
  color_secundario?: string
}

// ===========================================
// TIPOS DE API - RESPONSES
// ===========================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EstadisticasClub {
  ventas_totales: number
  ventas_mes: number
  pedidos_totales: number
  pedidos_mes: number
  comisiones_totales: number
  comisiones_mes: number
  productos_activos: number
  productos_top: {
    producto: Producto
    cantidad_vendida: number
    ingresos: number
  }[]
  ventas_por_mes: {
    mes: string
    total: number
    cantidad: number
  }[]
}

// ===========================================
// TIPOS DE STRIPE
// ===========================================

export interface CrearCheckoutSessionRequest {
  pedido_id: string
  success_url: string
  cancel_url: string
}

export interface StripeWebhookPayload {
  type: string
  data: {
    object: {
      id: string
      payment_intent?: string
      metadata?: Record<string, string>
    }
  }
}

// ===========================================
// TIPOS DE FORMULARIOS
// ===========================================

export interface FormularioCheckout {
  email: string
  nombre: string
  apellido: string
  direccion: string
  direccion2?: string
  ciudad: string
  provincia: string
  codigo_postal: string
  pais: string
  telefono: string
  guardar_datos: boolean
}

export interface FormularioProducto {
  nombre: string
  descripcion: string
  precio_base: number
  costo_produccion: number
  categoria: CategoriaProducto
  imagenes: File[]
  variantes: {
    talla: string
    color: string
  }[]
}

// ===========================================
// TIPOS DE CONTEXTO / ESTADO
// ===========================================

export interface ClubContextValue {
  club: Club | null
  loading: boolean
  error: string | null
}

export interface AuthContextValue {
  user: UsuarioClub | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export interface CartContextValue {
  cart: Carrito
  addItem: (producto: Producto, variante?: VarianteProducto, cantidad?: number) => void
  removeItem: (productoId: string, varianteId?: string) => void
  updateQuantity: (productoId: string, varianteId: string | undefined, cantidad: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

// ===========================================
// TIPOS DE SUPABASE DATABASE
// ===========================================

export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: Club
        Insert: Omit<Club, 'id' | 'created_at'>
        Update: Partial<Omit<Club, 'id' | 'created_at'>>
      }
      usuarios_club: {
        Row: UsuarioClub
        Insert: Omit<UsuarioClub, 'id' | 'created_at'>
        Update: Partial<Omit<UsuarioClub, 'id' | 'created_at'>>
      }
      productos: {
        Row: Producto
        Insert: Omit<Producto, 'id' | 'created_at'>
        Update: Partial<Omit<Producto, 'id' | 'created_at'>>
      }
      variantes_producto: {
        Row: VarianteProducto
        Insert: Omit<VarianteProducto, 'id'>
        Update: Partial<Omit<VarianteProducto, 'id'>>
      }
      pedidos: {
        Row: Pedido
        Insert: Omit<Pedido, 'id' | 'created_at' | 'numero_pedido'>
        Update: Partial<Omit<Pedido, 'id' | 'created_at' | 'numero_pedido'>>
      }
      items_pedido: {
        Row: ItemPedido
        Insert: Omit<ItemPedido, 'id'>
        Update: Partial<Omit<ItemPedido, 'id'>>
      }
    }
  }
}

// ===========================================
// UTILIDADES DE TIPOS
// ===========================================

export type WithClub<T> = T & { club: Club }
export type WithVariantes<T> = T & { variantes: VarianteProducto[] }
export type WithItems<T> = T & { items: ItemPedido[] }

export type ProductoConVariantes = WithVariantes<Producto>
export type PedidoCompleto = WithItems<WithClub<Pedido>>
