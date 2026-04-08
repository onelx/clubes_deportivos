// ============================================
// TIPOS BASE DE LA BASE DE DATOS
// ============================================

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
  rol: "admin" | "editor" | "viewer";
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
}

export interface VarianteProducto {
  id: string;
  producto_id: string;
  talla: string | null;
  color: string | null;
  sku: string;
  activo: boolean;
}

export interface DireccionEnvio {
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais: string;
  telefono: string;
}

export type EstadoPedido =
  | "pendiente"
  | "pagado"
  | "en_produccion"
  | "enviado"
  | "entregado"
  | "cancelado";

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
  comision_plataforma: number | null;
  pago_club: number | null;
  stripe_payment_intent_id: string | null;
  tracking_number: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
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

// ============================================
// TIPOS EXTENDIDOS CON RELACIONES
// ============================================

export interface ProductoConVariantes extends Producto {
  variantes: VarianteProducto[];
}

export interface ProductoConClub extends Producto {
  club: Club;
}

export interface ItemPedidoConProducto extends ItemPedido {
  producto: Producto;
  variante: VarianteProducto | null;
}

export interface PedidoConItems extends Pedido {
  items: ItemPedidoConProducto[];
}

export interface PedidoConClub extends Pedido {
  club: Club;
}

export interface ClubConUsuarios extends Club {
  usuarios: UsuarioClub[];
}

// ============================================
// TIPOS PARA EL CARRITO
// ============================================

export interface ItemCarrito {
  producto_id: string;
  variante_id: string | null;
  cantidad: number;
  producto: Producto;
  variante: VarianteProducto | null;
}

export interface Carrito {
  items: ItemCarrito[];
  club_slug: string;
}

export interface CarritoResumen {
  items: ItemCarrito[];
  subtotal: number;
  costo_envio: number;
  total: number;
  cantidad_total: number;
}

// ============================================
// TIPOS PARA FORMULARIOS
// ============================================

export interface CrearProductoInput {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  costo_produccion: number;
  categoria?: string;
  imagenes?: string[];
  variantes?: Omit<VarianteProducto, "id" | "producto_id">[];
}

export interface ActualizarProductoInput extends Partial<CrearProductoInput> {
  activo?: boolean;
}

export interface CrearPedidoInput {
  club_id: string;
  cliente_email: string;
  cliente_nombre: string;
  direccion_envio: DireccionEnvio;
  items: {
    producto_id: string;
    variante_id?: string;
    cantidad: number;
  }[];
}

export interface ActualizarPedidoInput {
  estado?: EstadoPedido;
  tracking_number?: string;
}

export interface ActualizarClubInput {
  nombre?: string;
  logo_url?: string;
  color_primario?: string;
  color_secundario?: string;
}

// ============================================
// TIPOS PARA CHECKOUT Y PAGOS
// ============================================

export interface CheckoutSessionInput {
  pedido_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  session_id: string;
  url: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      metadata?: {
        pedido_id?: string;
        club_id?: string;
      };
      [key: string]: unknown;
    };
  };
}

// ============================================
// TIPOS PARA ESTADÍSTICAS
// ============================================

export interface EstadisticasClub {
  ventas_totales: number;
  pedidos_totales: number;
  comisiones_pagadas: number;
  ingresos_netos: number;
  pedidos_pendientes: number;
  pedidos_en_produccion: number;
  pedidos_enviados: number;
  productos_activos: number;
  producto_mas_vendido: {
    producto: Producto;
    cantidad: number;
  } | null;
  ventas_por_mes: {
    mes: string;
    total: number;
  }[];
}

export interface EstadisticasPeriodo {
  inicio: string;
  fin: string;
}

// ============================================
// TIPOS PARA API RESPONSES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ============================================
// TIPOS PARA AUTENTICACIÓN
// ============================================

export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  avatar_url?: string;
}

export interface SesionUsuario {
  usuario: Usuario;
  club: Club | null;
  rol: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegistroInput {
  email: string;
  password: string;
  nombre?: string;
}

// ============================================
// TIPOS PARA FILTROS Y BÚSQUEDA
// ============================================

export interface FiltrosProducto {
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  busqueda?: string;
  ordenar_por?: "precio_asc" | "precio_desc" | "nombre" | "reciente";
}

export interface FiltrosPedido {
  estado?: EstadoPedido;
  fecha_desde?: string;
  fecha_hasta?: string;
  busqueda?: string;
}

// ============================================
// TIPOS PARA CONFIGURACIÓN
// ============================================

export interface ConfiguracionTienda {
  club: Club;
  categorias: string[];
  metodos_envio: MetodoEnvio[];
}

export interface MetodoEnvio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: string;
}

// ============================================
// CONSTANTES
// ============================================

export const ESTADOS_PEDIDO: Record<EstadoPedido, string> = {
  pendiente: "Pendiente de pago",
  pagado: "Pagado",
  en_produccion: "En producción",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const COLORES_ESTADO: Record<EstadoPedido, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  pagado: "bg-blue-100 text-blue-800",
  en_produccion: "bg-purple-100 text-purple-800",
  enviado: "bg-indigo-100 text-indigo-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export const TALLAS_DISPONIBLES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const CATEGORIAS_PRODUCTO = [
  "Camisetas",
  "Pantalones",
  "Sudaderas",
  "Accesorios",
  "Equipamiento",
  "Otros",
] as const;

export type TallaDisponible = (typeof TALLAS_DISPONIBLES)[number];
export type CategoriaProducto = (typeof CATEGORIAS_PRODUCTO)[number];
