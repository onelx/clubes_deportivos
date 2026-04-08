import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Tipos para la base de datos (generados o definidos manualmente)
export type Database = {
  public: {
    Tables: {
      clubs: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["clubs"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["clubs"]["Insert"]>;
      };
      usuarios_club: {
        Row: {
          id: string;
          club_id: string;
          auth_user_id: string;
          rol: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["usuarios_club"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["usuarios_club"]["Insert"]
        >;
      };
      productos: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["productos"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["productos"]["Insert"]>;
      };
      variantes_producto: {
        Row: {
          id: string;
          producto_id: string;
          talla: string | null;
          color: string | null;
          sku: string;
          activo: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["variantes_producto"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["variantes_producto"]["Insert"]
        >;
      };
      pedidos: {
        Row: {
          id: string;
          club_id: string;
          numero_pedido: string;
          estado: string;
          cliente_email: string;
          cliente_nombre: string;
          direccion_envio: Record<string, unknown>;
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["pedidos"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["pedidos"]["Insert"]>;
      };
      items_pedido: {
        Row: {
          id: string;
          pedido_id: string;
          producto_id: string;
          variante_id: string | null;
          cantidad: number;
          precio_unitario: number;
          subtotal: number;
        };
        Insert: Omit<Database["public"]["Tables"]["items_pedido"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["items_pedido"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// URL y claves de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente para uso en el navegador (componentes de cliente)
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
};

// Cliente anónimo para servidor (sin autenticación de usuario)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Cliente con permisos de servicio (para operaciones administrativas en el servidor)
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Helper para obtener el cliente correcto según el contexto
export function getSupabaseClient(useAdmin = false) {
  if (useAdmin && supabaseAdmin) {
    return supabaseAdmin;
  }
  return supabase;
}

// Helper para manejar errores de Supabase
export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "Ha ocurrido un error inesperado";
}

// Helper para verificar si hay una sesión activa (servidor)
export async function getServerSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  return session;
}
