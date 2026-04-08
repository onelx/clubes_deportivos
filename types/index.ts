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
  descripcion?: string
  email?: string
  telefono?: string
  direccion?: string
  redes_sociales?: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok?: string
  }
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
  descripcion: string
  precio_base: number
  costo_produccion: number
  categoria: string
  imagenes: string[]
  activo: boolean
  created_at: string
  destacado?: boolean
  stock_ilimitado?: boolean
  etiquetas?: string[]
  club?: Club
  variantes?: VarianteProducto[]
}

export interface VarianteProducto {
  id: string
  producto_id: string
  talla: string | null
  color: string | null
  sku: string
  activo: boolean
  precio_ajuste?: number
  stock?: number
  imagen_url?: string
  producto?: Producto
}

export interface Pedido {
  id: string
  club_id: string
  numero_pedido: string
  estado: EstadoPedido
  cliente_email: string
  cliente_nombre: string
  cliente_telefono?: string
  direccion_envio: DireccionEnvio
  subtotal: number
  costo_envio: number
  total: number
  comision_plataforma: number
  pago_club: number
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id?: string
  tracking_number: string | null
  notas?: string
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  delivered_at?: string | null
  cancelled_at?: string | null
  club?: Club
  items?: ItemPedido[]
}

export type EstadoPedido = 
  | 'pendiente'
  | 'pagado'
  | 'en_produccion'
  | 'enviado'
  | 'entregado'
  | 'cancelado'
  | 'reembolsado'

export interface DireccionEnvio {
  nombre_completo: string
  direccion: string
  ciudad: string
  provincia: string
  codigo_postal: string
  pais: string
  telefono?: string
  referencias?: string
}

export interface ItemPedido {
  id: string
  pedido_id: string
  producto_id: string
  variante_id: string | null
  cantidad: number
  precio_unitario: number
  subtotal: number
  personalizacion?: PersonalizacionItem
  producto?: Producto
  variante?: VarianteProducto
}

export interface PersonalizacionItem {
  nombre?: string
  numero?: string
  texto_adicional?: string
}

export interface CarritoItem {
  producto_id: string
  variante_id: string | null
  cantidad: number
  producto: Producto
  variante?: VarianteProducto
  personalizacion?: PersonalizacionItem
}

export interface Carrito {
  items: CarritoItem[]
  subtotal: number
  total: number
  club_id: string
}

export interface EstadisticasClub {
  ventas_totales: number
  pedidos_totales: number
  pedidos_pendientes: number
  pedidos_en_produccion: number
  comisiones_totales: number
  productos_activos: number
  productos_top: ProductoTop[]
  ventas_por_mes: VentasMes[]
  ingresos_netos: number
}

export interface ProductoTop {
  producto_id: string
  nombre: string
  imagen_url: string
  cantidad_vendida: number
  ingresos_totales: number
}

export interface VentasMes {
  mes: string
  ventas: number
  pedidos: number
  comisiones: number
}

export interface StripeCheckoutSession {
  sessionId: string
  url: string
}

export interface WebhookStripeEvent {
  type: string
  data: {
    object: {
      id: string
      payment_intent?: string
      metadata?: Record<string, string>
      customer_details?: {
        email: string
        name: string
      }
    }
  }
}

export interface Usuario {
  id: string
  email: string
  nombre?: string
  avatar_url?: string
  created_at: string
}

export interface Session {
  user: Usuario
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface FiltrosPedidos {
  estado?: EstadoPedido[]
  fecha_desde?: string
  fecha_hasta?: string
  busqueda?: string
  page?: number
  per_page?: number
}

export interface FiltrosProductos {
  categoria?: string[]
  busqueda?: string
  activo?: boolean
  destacado?: boolean
  precio_min?: number
  precio_max?: number
  page?: number
  per_page?: number
}

export interface ConfiguracionClub {
  club_id: string
  notificaciones_email: boolean
  notificaciones_pedidos: boolean
  mensaje_bienvenida?: string
  politicas_envio?: string
  politicas_devolucion?: string
  tiempo_produccion_dias: number
  metodos_envio: MetodoEnvio[]
}

export interface MetodoEnvio {
  id: string
  nombre: string
  descripcion: string
  precio: number
  tiempo_estimado_dias: number
  activo: boolean
}

export interface NotificacionPedido {
  tipo: 'nuevo_pedido' | 'estado_actualizado' | 'pago_recibido'
  pedido_id: string
  destinatario: string
  asunto: string
  contenido: string
}

export type CategoriaProducto = 
  | 'camisetas'
  | 'pantalones'
  | 'buzos'
  | 'gorras'
  | 'accesorios'
  | 'otros'

export const CATEGORIAS_PRODUCTOS: Record<CategoriaProducto, string> = {
  camisetas: 'Camisetas',
  pantalones: 'Pantalones',
  buzos: 'Buzos y Camperas',
  gorras: 'Gorras',
  accesorios: 'Accesorios',
  otros: 'Otros',
}

export const TALLAS_DISPONIBLES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
] as const

export type Talla = typeof TALLAS_DISPONIBLES[number]

export const COLORES_DISPONIBLES = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Gris', hex: '#9CA3AF' },
  { nombre: 'Azul', hex: '#3B82F6' },
  { nombre: 'Rojo', hex: '#EF4444' },
  { nombre: 'Verde', hex: '#10B981' },
  { nombre: 'Amarillo', hex: '#F59E0B' },
  { nombre: 'Naranja', hex: '#F97316' },
  { nombre: 'Rosa', hex: '#EC4899' },
  { nombre: 'Morado', hex: '#8B5CF6' },
] as const

export const ESTADOS_PEDIDO_LABELS: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente de Pago',
  pagado: 'Pagado',
  en_produccion: 'En Producción',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  reembolsado: 'Reembolsado',
}

export const ESTADOS_PEDIDO_COLORS: Record<EstadoPedido, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  pagado: 'bg-blue-100 text-blue-800',
  en_produccion: 'bg-purple-100 text-purple-800',
  enviado: 'bg-indigo-100 text-indigo-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
  reembolsado: 'bg-gray-100 text-gray-800',
}

export interface ErrorValidacion {
  field: string
  message: string
}

export interface FormularioProducto {
  nombre: string
  descripcion: string
  categoria: CategoriaProducto
  precio_base: number
  costo_produccion: number
  imagenes: File[]
  activo: boolean
  destacado: boolean
  variantes: FormularioVariante[]
  etiquetas: string[]
}

export interface FormularioVariante {
  talla: string | null
  color: string | null
  sku: string
  precio_ajuste: number
  stock: number | null
  activo: boolean
}

export interface FormularioCheckout {
  email: string
  nombre_completo: string
  telefono: string
  direccion: string
  ciudad: string
  provincia: string
  codigo_postal: string
  pais: string
  referencias?: string
  acepta_terminos: boolean
}
