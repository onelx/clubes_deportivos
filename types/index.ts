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
  variantes?: VarianteProducto[];
  club?: Club;
}

export interface VarianteProducto {
  id: string;
  producto_id: string;
  talla: string | null;
  color: string | null;
  sku: string | null;
  activo: boolean;
}

export type EstadoPedido = 
  | 'pendiente' 
  | 'pagado' 
  | 'produccion' 
  | 'enviado' 
  | 'entregado' 
  | 'cancelado';

export interface DireccionEnvio {
  nombre: string;
  apellido: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais: string;
  telefono: string;
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
  items?: ItemPedido[];
  club?: Club;
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

export interface CartItem {
  id: string;
  producto: Producto;
  variante: VarianteProducto | null;
  cantidad: number;
  precio_unitario: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

export interface EstadisticasClub {
  ventas_totales: number;
  pedidos_totales: number;
  comision_total: number;
  pago_total: number;
  productos_activos: number;
  pedidos_pendientes: number;
  pedidos_mes_actual: number;
  ventas_mes_actual: number;
  productos_mas_vendidos: ProductoMasVendido[];
  ventas_por_mes: VentasPorMes[];
}

export interface ProductoMasVendido {
  producto_id: string;
  nombre: string;
  cantidad_vendida: number;
  total_ventas: number;
}

export interface VentasPorMes {
  mes: string;
  total: number;
  cantidad_pedidos: number;
}

export interface CreateProductoInput {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  costo_produccion: number;
  categoria?: string;
  imagenes?: string[];
  variantes?: Omit<VarianteProducto, 'id' | 'producto_id'>[];
}

export interface UpdateProductoInput extends Partial<CreateProductoInput> {
  activo?: boolean;
}

export interface CreatePedidoInput {
  club_id: string;
  cliente_email: string;
  cliente_nombre: string;
  direccion_envio: DireccionEnvio;
  items: {
    producto_id: string;
    variante_id: string | null;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface UpdateClubInput {
  nombre?: string;
  logo_url?: string;
  color_primario?: string;
  color_secundario?: string;
  activo?: boolean;
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
  per_page: number;
  total_pages: number;
}

export interface FilterOptions {
  page?: number;
  per_page?: number;
  search?: string;
  estado?: EstadoPedido;
  categoria?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
