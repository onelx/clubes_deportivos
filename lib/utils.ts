import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases de Tailwind de forma inteligente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatea precios en euros
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Genera un número de pedido único
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PED-${timestamp}-${random}`;
}

// Mapea estados de pedido a labels legibles
export const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente de pago",
  pagado: "Pagado",
  en_produccion: "En producción",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// Colores para badges de estado
export const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  pagado: "bg-blue-100 text-blue-800",
  en_produccion: "bg-purple-100 text-purple-800",
  enviado: "bg-indigo-100 text-indigo-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};
