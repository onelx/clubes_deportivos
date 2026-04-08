export interface Club {
  id: string;
  slug: string;
  nombre: string;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
  stripe_account_id: string | null;
  comision_porcentaje: number;
  activo: boolean;
  created_at: string;
}

export interface UsuarioClub {
  id: string;
  club_id: string;
  auth_user_id: string;
  rol: 'admin' | 'editor' | 'viewer';
  created_at: string;
  club?: Club;
}

export interface Producto {
  id: string;
  club_id: string;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  costo_produccion: number;
  categoria: string | null;
  imagenes: string[];
  activo: boolean;
  created_at: string;
  club?: Club;
  variantes?: VarianteProducto[];
}

export interface VarianteProducto {
  id: string;
  producto_id: string;
  talla: string | null;
  color: string | null;
  sku: string | null;
  activo: boolean;
  producto?: Producto;
}

export type EstadoPedido = 
  | 'pending' 
  | 'paid' 
  | 'production' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface DireccionEnvio {
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
  telefono?: string;
}

export interface Pedido {
  id: string;
  club_id: string;
  numero_pedido: string;
  estado: EstadoPedido;
  cliente_email: string;
  cliente_nombre: string;
  direccion_envio: DireccionEnvio;
  subtotal: number;
  costo_envio: number;
  total: number;
  comision_plataforma: number;
  pago_club: number;
  stripe_payment_intent_id: string | null;
  tracking_number: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  club?: Club;
  items?: ItemPedido[];
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  variante_id: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
  variante?: VarianteProducto;
}

export interface CarritoItem {
  producto: Producto;
  variante: VarianteProducto | null;
  cantidad: number;
}

export interface CarritoState {
  items: CarritoItem[];
  addItem: (producto: Producto, variante: VarianteProducto | null, cantidad: number) => void;
  removeItem: (productoId: string, varianteId: string | null) => void;
  updateQuantity: (productoId: string, varianteId: string | null, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export interface CheckoutFormData {
  cliente_nombre: string;
  cliente_email: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
  telefono?: string;
}

export interface EstadisticasClub {
  ventas_totales: number;
  ventas_mes_actual: number;
  pedidos_totales: number;
  pedidos_pendientes: number;
  comisiones_pendientes: number;
  productos_activos: number;
  productos_top: Array<{
    producto: Producto;
    cantidad_vendida: number;
    total_ventas: number;
  }>;
  ventas_por_mes: Array<{
    mes: string;
    ventas: number;
    pedidos: number;
  }>;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio_base: number;
  costo_produccion: number;
  categoria: string;
  imagenes: string[];
  variantes: Array<{
    talla: string;
    color: string;
    sku: string;
  }>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EstadoPedidoTimeline {
  estado: EstadoPedido;
  fecha: string | null;
  activo: boolean;
  descripcion: string;
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      [key: string]: unknown;
    };
  };
}

export interface ClubConfig {
  nombre: string;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
  comision_porcentaje: number;
  stripe_account_id: string | null;
}

export interface FiltrosPedidos {
  estado?: EstadoPedido;
  fecha_desde?: string;
  fecha_hasta?: string;
  busqueda?: string;
  page?: number;
  pageSize?: number;
}

export interface FiltrosProductos {
  categoria?: string;
  activo?: boolean;
  busqueda?: string;
  page?: number;
  pageSize?: number;
}

export const CATEGORIAS_PRODUCTO = [
  'Camisetas',
  'Pantalones',
  'Shorts',
  'Buzos',
  'Accesorios',
  'Calzado',
  'Equipamiento',
  'Otros',
] as const;

export type CategoriaProducto = typeof CATEGORIAS_PRODUCTO[number];

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type Talla = typeof TALLAS[number];

export const COLORES = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Rojo', hex: '#FF0000' },
  { nombre: 'Azul', hex: '#0000FF' },
  { nombre: 'Verde', hex: '#00FF00' },
  { nombre: 'Amarillo', hex: '#FFFF00' },
  { nombre: 'Gris', hex: '#808080' },
] as const;

export const ESTADOS_PEDIDO_LABELS: Record<EstadoPedido, string> = {
  pending: 'Pendiente de Pago',
  paid: 'Pagado',
  production: 'En Producción',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const ESTADOS_PEDIDO_COLORS: Record<EstadoPedido, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
