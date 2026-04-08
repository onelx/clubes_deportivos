export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: Club;
        Insert: ClubInsert;
        Update: ClubUpdate;
      };
      usuarios_club: {
        Row: UsuarioClub;
        Insert: UsuarioClubInsert;
        Update: UsuarioClubUpdate;
      };
      productos: {
        Row: Producto;
        Insert: ProductoInsert;
        Update: ProductoUpdate;
      };
      variantes_producto: {
        Row: VarianteProducto;
        Insert: VarianteProductoInsert;
        Update: VarianteProductoUpdate;
      };
      pedidos: {
        Row: Pedido;
        Insert: PedidoInsert;
        Update: PedidoUpdate;
      };
      items_pedido: {
        Row: ItemPedido;
        Insert: ItemPedidoInsert;
        Update: ItemPedidoUpdate;
      };
    };
  };
}

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

export interface ClubInsert {
  id?: string;
  slug: string;
  nombre: string;
  logo_url?: string | null;
  color_primario?: string;
  color_secundario?: string;
  stripe_account_id?: string | null;
  comision_porcentaje?: number;
  activo?: boolean;
  created_at?: string;
}

export interface ClubUpdate {
  slug?: string;
  nombre?: string;
  logo_url?: string | null;
  color_primario?: string;
  color_secundario?: string;
  stripe_account_id?: string | null;
  comision_porcentaje?: number;
  activo?: boolean;
}

export interface ClubPublic {
  id: string;
  slug: string;
  nombre: string;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
  activo: boolean;
}

export type RolUsuarioClub = 'admin' | 'editor' | 'viewer';

export interface UsuarioClub {
  id: string;
  club_id: string;
  auth_user_id: string;
  rol: RolUsuarioClub;
  created_at: string;
}

export interface UsuarioClubInsert {
  id?: string;
  club_id: string;
  auth_user_id: string;
  rol: RolUsuarioClub;
  created_at?: string;
}

export interface UsuarioClubUpdate {
  club_id?: string;
  auth_user_id?: string;
  rol?: RolUsuarioClub;
}

export type CategoriaProducto = 'camisetas' | 'buzos' | 'gorras' | 'accesorios' | 'otros';

export interface ProductoImagen {
  url: string;
  alt: string;
  orden: number;
}

export interface Producto {
  id: string;
  club_id: string;
  nombre: string;
  descripcion: string;
  precio_base: number;
  costo_produccion: number;
  categoria: CategoriaProducto;
  imagenes: ProductoImagen[];
  activo: boolean;
  created_at: string;
}

export interface ProductoInsert {
  id?: string;
  club_id: string;
  nombre: string;
  descripcion: string;
  precio_base: number;
  costo_produccion: number;
  categoria: CategoriaProducto;
  imagenes?: ProductoImagen[];
  activo?: boolean;
  created_at?: string;
}

export interface ProductoUpdate {
  club_id?: string;
  nombre?: string;
  descripcion?: string;
  precio_base?: number;
  costo_produccion?: number;
  categoria?: CategoriaProducto;
  imagenes?: ProductoImagen[];
  activo?: boolean;
}

export interface ProductoConVariantes extends Producto {
  variantes: VarianteProducto[];
  club?: ClubPublic;
}

export interface VarianteProducto {
  id: string;
  producto_id: string;
  talla: string | null;
  color: string | null;
  sku: string;
  activo: boolean;
}

export interface VarianteProductoInsert {
  id?: string;
  producto_id: string;
  talla?: string | null;
  color?: string | null;
  sku: string;
  activo?: boolean;
}

export interface VarianteProductoUpdate {
  producto_id?: string;
  talla?: string | null;
  color?: string | null;
  sku?: string;
  activo?: boolean;
}

export type EstadoPedido = 
  | 'pendiente_pago'
  | 'pagado'
  | 'en_produccion'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface DireccionEnvio {
  nombre_completo: string;
  calle: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais: string;
  telefono: string;
  instrucciones?: string;
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
}

export interface PedidoInsert {
  id?: string;
  club_id: string;
  numero_pedido: string;
  estado?: EstadoPedido;
  cliente_email: string;
  cliente_nombre: string;
  direccion_envio: DireccionEnvio;
  subtotal: number;
  costo_envio: number;
  total: number;
  comision_plataforma: number;
  pago_club: number;
  stripe_payment_intent_id?: string | null;
  tracking_number?: string | null;
  created_at?: string;
  paid_at?: string | null;
  shipped_at?: string | null;
}

export interface PedidoUpdate {
  estado?: EstadoPedido;
  tracking_number?: string | null;
  paid_at?: string | null;
  shipped_at?: string | null;
}

export interface PedidoConDetalles extends Pedido {
  items: ItemPedidoConDetalles[];
  club?: ClubPublic;
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  variante_id: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface ItemPedidoInsert {
  id?: string;
  pedido_id: string;
  producto_id: string;
  variante_id?: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface ItemPedidoUpdate {
  cantidad?: number;
  precio_unitario?: number;
  subtotal?: number;
}

export interface ItemPedidoConDetalles extends ItemPedido {
  producto?: Producto;
  variante?: VarianteProducto;
}

export interface CarritoItem {
  producto_id: string;
  variante_id: string | null;
  cantidad: number;
  producto?: ProductoConVariantes;
  variante?: VarianteProducto;
}

export interface Carrito {
  items: CarritoItem[];
  subtotal: number;
  cantidad_total: number;
}

export interface CheckoutSession {
  club_slug: string;
  items: CarritoItem[];
  cliente_email: string;
  cliente_nombre: string;
  direccion_envio: DireccionEnvio;
}

export interface EstadisticasClub {
  total_ventas: number;
  total_pedidos: number;
  comisiones_pagadas: number;
  ingresos_netos: number;
  productos_activos: number;
  pedidos_pendientes: number;
  productos_top: {
    producto_id: string;
    nombre: string;
    total_vendido: number;
    cantidad_vendida: number;
  }[];
  ventas_por_mes: {
    mes: string;
    total: number;
    cantidad: number;
  }[];
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  payment_intent?: string;
}

export interface StripeConnectAccount {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

export interface WebhookStripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
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

export interface FiltrosPedidos {
  estado?: EstadoPedido;
  fecha_desde?: string;
  fecha_hasta?: string;
  busqueda?: string;
  page?: number;
  per_page?: number;
}

export interface FiltrosProductos {
  categoria?: CategoriaProducto;
  activo?: boolean;
  busqueda?: string;
  page?: number;
  per_page?: number;
}
