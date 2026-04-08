import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combinar clases de Tailwind de forma segura
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear precio en moneda local
export function formatPrice(
  price: number,
  currency: string = "ARS",
  locale: string = "es-AR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Formatear fecha
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("es-AR", options).format(
    typeof date === "string" ? new Date(date) : date
  );
}

// Formatear fecha relativa (hace X tiempo)
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals: [number, string, string][] = [
    [31536000, "año", "años"],
    [2592000, "mes", "meses"],
    [86400, "día", "días"],
    [3600, "hora", "horas"],
    [60, "minuto", "minutos"],
    [1, "segundo", "segundos"],
  ];

  for (const [seconds, singular, plural] of intervals) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count >= 1) {
      return `hace ${count} ${count === 1 ? singular : plural}`;
    }
  }

  return "ahora mismo";
}

// Generar número de pedido único
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PED-${timestamp}-${random}`;
}

// Generar SKU único
export function generateSKU(
  clubSlug: string,
  productoNombre: string,
  variante?: { talla?: string; color?: string }
): string {
  const clubPart = clubSlug.substring(0, 3).toUpperCase();
  const productPart = productoNombre
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();
  const tallaPart = variante?.talla?.substring(0, 2).toUpperCase() || "XX";
  const colorPart = variante?.color?.substring(0, 2).toUpperCase() || "XX";
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `${clubPart}-${productPart}-${tallaPart}${colorPart}-${random}`;
}

// Calcular comisión y pago al club
export function calculateCommission(
  subtotal: number,
  comisionPorcentaje: number
): { comision: number; pagoClub: number } {
  const comision = Math.round(subtotal * (comisionPorcentaje / 100) * 100) / 100;
  const pagoClub = Math.round((subtotal - comision) * 100) / 100;
  return { comision, pagoClub };
}

// Calcular costo de envío (simplificado)
export function calculateShipping(subtotal: number): number {
  // Envío gratis arriba de cierto monto
  if (subtotal >= 50000) return 0;
  // Envío fijo
  return 2500;
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar slug (solo letras minúsculas, números y guiones)
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

// Convertir texto a slug
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .replace(/^-|-$/g, ""); // Remover guiones al inicio/fin
}

// Truncar texto
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

// Capitalizar primera letra
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Sleep/delay utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generar color de contraste (para texto sobre color de fondo)
export function getContrastColor(hexColor: string): string {
  // Remover # si existe
  const hex = hexColor.replace("#", "");

  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Retornar blanco o negro según luminancia
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

// Obtener iniciales de un nombre
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Formatear número con separador de miles
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-AR").format(num);
}

// Verificar si estamos en el servidor
export function isServer(): boolean {
  return typeof window === "undefined";
}

// Obtener URL base de la app
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

// Construir URL de la tienda de un club
export function getClubStoreUrl(slug: string): string {
  return `${getBaseUrl()}/${slug}`;
}

// Construir URL de producto
export function getProductUrl(clubSlug: string, productoId: string): string {
  return `${getBaseUrl()}/${clubSlug}/productos/${productoId}`;
}

// Parsear query params de forma segura
export function parseQueryParam(
  param: string | string[] | undefined
): string | undefined {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}

// Generar color aleatorio para avatares
export function generateAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "#EF4444", // red
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#14B8A6", // teal
    "#3B82F6", // blue
    "#8B5CF6", // violet
    "#EC4899", // pink
  ];

  return colors[Math.abs(hash) % colors.length];
}
