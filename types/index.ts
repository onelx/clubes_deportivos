// ===========================================
// TIPOS BASE DE LA BASE DE DATOS
// ===========================================

export type UUID = string

export interface Timestamps {
  created_at: string
  updated_at?: string
}

// ===========================================
// CLUBS
// ===========================================

export interface Club {
  id: UUID
  slug: string
  nombre: string
  logo_url: string | null
  color_primario: string
  color_secundario: string
  stripe_account_id: string | null
  comision_porcentaje: number
  activo: boolean
  descripcion?: string | null
  email_contacto?: string | null
  telefono?: string | null
  direccion?: DireccionEnvio | null
  redes_sociales?: RedesSociales | null
  created_at: string
}

export interface ClubPublico {
  id: UUID
  slug: string
  nombre: string
  logo_url: string | null
  color_primario: string
  color_secundario: string
  descripcion?: string | null
}

export interface RedesSociales {
  instagram?: string
  facebook?: string
  twitter?: string
  youtube?: string
  website?: string
}

export type RolUsuarioClub = 'admin' | 'editor' | 'viewer'

export interface UsuarioClub {
  id: UUID
  club_id: UUID
  auth_user_id: UUID
  rol: RolUsuarioClub
  created_at: string
}

export interface UsuarioClubConClub extends UsuarioClub {
  club: Club
}

// ===========================================
// PRODUCTOS
// ===========================================

export interface Producto {
  id: UUID
  club_id: UUID
  nombre: string
  descripcion: string | null
  precio_base: number
  costo_produccion: number
  categoria: CategoriaProducto
  imagenes: ImagenProducto[]
  activo: boolean
  destacado?: boolean
  orden?: number
  created_at: string
}

export interface ProductoConVariantes extends Producto {
  variantes: VarianteProducto[]
}

export interface ProductoConClub extends Producto {
  club: ClubPublico
}

export type CategoriaProducto = 
  | 'camisetas'
  | 'pantalones'
  | 'sudaderas'
  | 'chaquetas'
  | 'accesorios'
  | 'equipamiento'
  | 'otros'

export const CATEGORIAS_PRODUCTO: { value: CategoriaProducto; label: string }[] = [
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'pantalones', label: 'Pantalones' },
  { value: 'sudaderas', label: 'Sudaderas' },
  { value: 'chaquetas', label: 'Chaquetas' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'otros', label: 'Otros' },
]

export interface ImagenProducto {
  url: string
  alt?: string
  orden: number
}

export interface VarianteProducto {
  id: UUID
  producto_id: UUID
  talla: Talla
  color: string
  color_hex?: string
  sku: string
  stock?: number | null
  activo: boolean
}

export type Talla = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'Única'

export const TALLAS: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Única']

export const COLORES_COMUNES: { nombre: string; hex: string }[] = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Gris', hex: '#6B7280' },
  { nombre: 'Rojo', hex: '#EF4444' },
  { nombre: 'Azul', hex: '#3B82F6' },
  { nombre: 'Verde', hex: '#22C55E' },
  { nombre: 'Amarillo', hex: '#EAB308' },
  { nombre: 'Naranja', hex: '#F97316' },
  { nombre: 'Morado', hex: '#A855F7' },
  { nombre: 'Rosa', hex: '#EC4899' },
  { nombre: 'Marino', hex: '#1E3A8A' },
]

// ===========================================
// PEDIDOS
// ===========================================

export interface Pedido {
  id: UUID
  club_id: UUID
  numero_pedido: string
  estado: EstadoPedido
  cliente_email: string
  cliente_nombre: string
  cliente_telefono?: string | null
  direccion_envio: DireccionEnvio
  notas_cliente?: string | null
  notas_internas?: string | null
  subtotal: number
  costo_envio: number
  descuento?: number
  total: number
  comision_plataforma: number
  pago_club: number
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id?: string | null
  tracking_number: string | null
  tracking_url?: string | null
  metodo_envio?: MetodoEnvio
  created_at: string
  paid_at: string | null
  production_at?: string | null
  shipped_at: string | null
  delivered_at?: string | null
  cancelled_at?: string | null
}

export interface PedidoConItems extends Pedido {
  items: ItemPedidoConProducto[]
}

export interface PedidoConClub extends Pedido {
  club: ClubPublico
}

export type EstadoPedido = 
  | 'pendiente'      // Creado pero no pagado
  | 'pagado'         // Pago confirmado
  | 'en_produccion'  // En fabricación
  | 'enviado'        // Despachado
  | 'entregado'      // Recibido por el cliente
  | 'cancelado'      // Cancelado

export const ESTADOS_PEDIDO: { value: EstadoPedido; label: string; color: string }[] = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pagado', label: 'Pagado', color: 'bg-green-100 text-green-800' },
  { value: 'en_produccion', label: 'En Producción', color: 'bg-blue-100 text-blue-800' },
  { value: 'enviado', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  { value: 'entregado', label: 'Entregado', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
]

export type MetodoEnvio = 'estandar' | 'express' | 'recogida'

export const METODOS_ENVIO: { value: MetodoEnvio; label: string; precio: number; dias: string }[] = [
  { value: 'estandar', label: 'Envío Estándar', precio: 4.99, dias: '5-7 días' },
  { value: 'express', label: 'Envío Express', precio: 9.99, dias: '2-3 días' },
  { value: 'recogida', label: 'Recogida en Club', precio: 0, dias: 'Disponible en 3-5 días' },
]

export interface DireccionEnvio {
  nombre_completo: string
  linea1: string
  linea2?: string
  ciudad: string
  provincia: string
  codigo_postal: string
  pais: string
  telefono?: string
}

export interface ItemPedido {
  id: UUID
  pedido_id: UUID
  producto_id: UUID
  variante_id: UUID
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface ItemPedidoConProducto extends ItemPedido {
  producto: Producto
  variante: VarianteProducto
}

// ===========================================
// CARRITO (Estado del cliente)
// ===========================================

export interface ItemCarrito {
  producto_id: UUID
  variante_id: UUID
  producto: Producto
  variante: VarianteProducto
  cantidad: number
}

export interface Carrito {
  club_slug: string
  items: ItemCarrito[]
  subtotal: number
  costo_envio: number
  total: number
}

// ===========================================
// CHECKOUT
// ===========================================

export interface DatosCheckout {
  cliente: {
    email: string
    nombre: string
    telefono?: string
  }
  direccion: DireccionEnvio
  metodo_envio: MetodoEnvio
  notas?: string
}

export interface SesionCheckout {
  session_id: string
  url: string
}

// ===========================================
// ESTADÍSTICAS DEL DASHBOARD
// ===========================================

export interface EstadisticasClub {
  ventas_totales: number
  ventas_mes: number
  pedidos_totales: number
  pedidos_mes: number
  pedidos_pendientes: number
  comision_pagada: number
  ganancia_neta: number
  productos_activos: number
  producto_mas_vendido: {
    producto: Producto
    cantidad: number
  } | null
  ventas_por_mes: VentasMes[]
}

export interface VentasMes {
  mes: string
  total: number
  cantidad_pedidos: number
}

export interface EstadisticasPedidos {
  total: number
  por_estado: Record<EstadoPedido, number>
}

// ===========================================
// API RESPONSES
// ===========================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

// ===========================================
// FORMS
// ===========================================

export interface ProductoFormData {
  nombre: string
  descripcion: string
  precio_base: number
  costo_produccion: number
  categoria: CategoriaProducto
  imagenes: ImagenProducto[]
  activo: boolean
  destacado: boolean
  variantes: Omit<VarianteProducto, 'id' | 'producto_id'>[]
}

export interface ClubFormData {
  nombre: string
  slug: string
  descripcion?: string
  logo_url?: string
  color_primario: string
  color_secundario: string
  email_contacto?: string
  telefono?: string
  redes_sociales?: RedesSociales
}

// ===========================================
// FILTROS Y ORDENAMIENTO
// ===========================================

export interface FiltrosProductos {
  categoria?: CategoriaProducto
  precio_min?: number
  precio_max?: number
  talla?: Talla
  color?: string
  busqueda?: string
  solo_activos?: boolean
  destacados?: boolean
}

export interface FiltroPedidos {
  estado?: EstadoPedido
  fecha_desde?: string
  fecha_hasta?: string
  busqueda?: string
}

export type OrdenProductos = 
  | 'nombre_asc' 
  | 'nombre_desc' 
  | 'precio_asc' 
  | 'precio_desc' 
  | 'fecha_asc' 
  | 'fecha_desc'

export type OrdenPedidos = 
  | 'fecha_asc' 
  | 'fecha_desc' 
  | 'total_asc' 
  | 'total_desc'

// ===========================================
// STRIPE
// ===========================================

export interface StripeConnectAccount {
  account_id: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
}

export interface CreateCheckoutSessionRequest {
  club_slug: string
  items: {
    producto_id: UUID
    variante_id: UUID
    cantidad: number
  }[]
  cliente: {
    email: string
    nombre: string
    telefono?: string
  }
  direccion: DireccionEnvio
  metodo_envio: MetodoEnvio
}

// ===========================================
// NOTIFICACIONES
// ===========================================

export interface Notificacion {
  id: UUID
  club_id: UUID
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  leida: boolean
  datos?: Record<string, unknown>
  created_at: string
}

export type TipoNotificacion = 
  | 'nuevo_pedido'
  | 'pago_recibido'
  | 'pedido_enviado'
  | 'stock_bajo'
  | 'sistema'

// ===========================================
// UTILIDADES DE TIPOS
// ===========================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Nullable<T> = T | null

export type WithId<T> = T & { id: UUID }

export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>

export type UpdateInput<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
