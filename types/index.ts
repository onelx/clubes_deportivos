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
  imagenes: ProductoImagen[];
  activo: boolean;
  created_at: string;
  variantes?: VarianteProducto[];
  club?: Club;
}

export interface ProductoImagen {
  url: string;
  alt?: string;
  orden: number;
}

export interface VarianteProducto {
  id: string;
  producto_id: string;
  talla: string | null;
  color: string | null;
  sku: string | null;
  activo: boolean;
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
  comision_plataforma: number | null;
  pago_club: number | null;
  stripe_payment_intent_id: string | null;
  tracking_number: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  items?: ItemPedido[];
  club?: Club;
}

export type EstadoPedido =
  | "pendiente"
  | "pagado"
  | "en_produccion"
  | "producido"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface DireccionEnvio {
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais: string;
  telefono?: string;
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
  producto_id: string;
  variante_id: string | null;
  cantidad: number;
  producto: Producto;
  variante: VarianteProducto | null;
}

export interface Carrito {
  items: CarritoItem[];
  club_slug: string;
}

export interface CheckoutSessionRequest {
  club_slug: string;
  items: {
    producto_id: string;
    variante_id: string | null;
    cantidad: number;
  }[];
  cliente: {
    email: string;
    nombre: string;
  };
  direccion_envio: DireccionEnvio;
}

export interface CheckoutSessionResponse {
  session_id: string;
  url: string;
}

export interface EstadisticasClub {
  ventas_totales: number;
  pedidos_totales: number;
  pedidos_pendientes: number;
  comisiones_pagadas: number;
  ingresos_netos: number;
  productos_activos: number;
  productos_top: ProductoTop[];
  ventas_por_mes: VentaMensual[];
}

export interface ProductoTop {
  producto_id: string;
  nombre: string;
  cantidad_vendida: number;
  ingresos: number;
}

export interface VentaMensual {
  mes: string;
  ventas: number;
  pedidos: number;
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
  limit: number;
  total_pages: number;
}

export interface ProductoFiltros {
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  busqueda?: string;
  ordenar_por?: "precio_asc" | "precio_desc" | "nombre" | "reciente";
}

export interface PedidoFiltros {
  estado?: EstadoPedido;
  fecha_desde?: string;
  fecha_hasta?: string;
  busqueda?: string;
}

export type CreateProductoInput = Omit<
  Producto,
  "id" | "created_at" | "club" | "variantes"
> & {
  variantes?: Omit<VarianteProducto, "id" | "producto_id">[];
};

export type UpdateProductoInput = Partial<CreateProductoInput>;

export type CreatePedidoInput = Omit<
  Pedido,
  | "id"
  | "numero_pedido"
  | "created_at"
  | "paid_at"
  | "shipped_at"
  | "comision_plataforma"
  | "pago_club"
  | "club"
  | "items"
> & {
  items: Omit<ItemPedido, "id" | "pedido_id" | "producto" | "variante">[];
};

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      metadata?: Record<string, string>;
      amount_total?: number;
      payment_status?: string;
      customer_email?: string;
    };
  };
}

export interface ClubConfig {
  nombre: string;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
  comision_porcentaje: number;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
  } | null;
  club: Club | null;
  rol: string | null;
}

export const ESTADOS_PEDIDO: Record<EstadoPedido, { label: string; color: string }> = {
  pendiente: { label: "Pendiente de pago", color: "bg-yellow-100 text-yellow-800" },
  pagado: { label: "Pagado", color: "bg-green-100 text-green-800" },
  en_produccion: { label: "En producción", color: "bg-blue-100 text-blue-800" },
  producido: { label: "Producido", color: "bg-purple-100 text-purple-800" },
  enviado: { label: "Enviado", color: "bg-indigo-100 text-indigo-800" },
  entregado: { label: "Entregado", color: "bg-gray-100 text-gray-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export const CATEGORIAS_PRODUCTO = [
  "Camisetas",
  "Pantalones",
  "Sudaderas",
  "Chaquetas",
  "Accesorios",
  "Equipamiento",
  "Otros",
] as const;

export const TALLAS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

export const COLORES = [
  { nombre: "Negro", valor: "#000000" },
  { nombre: "Blanco", valor: "#FFFFFF" },
  { nombre: "Rojo", valor: "#EF4444" },
  { nombre: "Azul", valor: "#3B82F6" },
  { nombre: "Verde", valor: "#22C55E" },
  { nombre: "Amarillo", valor: "#EAB308" },
  { nombre: "Naranja", valor: "#F97316" },
  { nombre: "Morado", valor: "#A855F7" },
  { nombre: "Rosa", valor: "#EC4899" },
  { nombre: "Gris", valor: "#6B7280" },
] as const;
