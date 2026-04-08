import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combinar clases de Tailwind de forma segura
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear precio en moneda local
export function formatPrice(
  amount: number,
  currency: string = "EUR",
  locale: string = "es-ES"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

// Formatear fecha
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("es-ES", options || defaultOptions).format(
    new Date(date)
  );
}

// Formatear fecha con hora
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Generar número de pedido único
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Generar SKU para variante
export function generateSKU(
  productoNombre: string,
  talla?: string,
  color?: string
): string {
  const base = productoNombre
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  const tallaCode = talla?.substring(0, 2).toUpperCase() || "XX";
  const colorCode = color?.substring(0, 2).toUpperCase() || "XX";
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `${base}-${tallaCode}-${colorCode}-${random}`;
}

// Truncar texto con ellipsis
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

// Capitalizar primera letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Convertir string a slug
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Calcular porcentaje
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Calcular comisión de la plataforma
export function calculatePlatformCommission(
  subtotal: number,
  commissionRate: number
): number {
  return Math.round(subtotal * (commissionRate / 100) * 100) / 100;
}

// Calcular pago al club
export function calculateClubPayment(
  subtotal: number,
  costProduction: number,
  commissionRate: number
): number {
  const commission = calculatePlatformCommission(subtotal, commissionRate);
  return Math.round((subtotal - costProduction - commission) * 100) / 100;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Parsear JSON de forma segura
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Obtener iniciales de un nombre
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generar color aleatorio pero consistente basado en string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

// Verificar si es dispositivo móvil (client-side)
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

// Copiar texto al portapapeles
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Delay/sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Obtener URL base de la aplicación
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

// Construir URL de tienda de club
export function getClubStoreUrl(slug: string): string {
  return `${getBaseUrl()}/tienda/${slug}`;
}

// Construir URL de producto
export function getProductUrl(clubSlug: string, productId: string): string {
  return `${getBaseUrl()}/tienda/${clubSlug}/producto/${productId}`;
}

// Formatear número con separadores de miles
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

// Obtener diferencia de tiempo legible
export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace unos segundos";
  if (diffInSeconds < 3600)
    return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000)
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000)
    return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;

  return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
}

// Validar código postal español
export function isValidSpanishPostalCode(code: string): boolean {
  const postalCodeRegex = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
  return postalCodeRegex.test(code);
}

// Validar teléfono español
export function isValidSpanishPhone(phone: string): boolean {
  const phoneRegex = /^(?:\+34)?[6789]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}
