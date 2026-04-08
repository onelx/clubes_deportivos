import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }
  
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateSKU(productName: string, variant?: { talla?: string | null; color?: string | null }): string {
  const productCode = productName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 6);
  
  const timestamp = Date.now().toString(36).toUpperCase().substring(-4);
  
  let variantCode = '';
  if (variant?.talla) {
    variantCode += `-${variant.talla.toUpperCase()}`;
  }
  if (variant?.color) {
    variantCode += `-${variant.color.substring(0, 3).toUpperCase()}`;
  }
  
  return `${productCode}-${timestamp}${variantCode}`;
}

export function calculateCommission(amount: number, percentage: number): number {
  return Math.round(amount * (percentage / 100));
}

export function calculateClubPayout(total: number, commission: number, shippingCost: number): number {
  return total - commission - shippingCost;
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getContrastColor(hexColor: string): 'light' | 'dark' {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 'dark';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? 'dark' : 'light';
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}

export function parseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getBaseURL(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
}

export function buildURL(path: string, params?: Record<string, string | number | boolean>): string {
  const baseURL = getBaseURL();
  const url = new URL(path, baseURL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  
  return url.toString();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'Ha ocurrido un error inesperado';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export const CATEGORIAS_PRODUCTO = [
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'buzos', label: 'Buzos' },
  { value: 'gorras', label: 'Gorras' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'otros', label: 'Otros' },
] as const;

export const ESTADOS_PEDIDO = [
  { value: 'pendiente_pago', label: 'Pendiente de Pago', color: 'yellow' },
  { value: 'pagado', label: 'Pagado', color: 'green' },
  { value: 'en_produccion', label: 'En Producción', color: 'blue' },
  { value: 'enviado', label: 'Enviado', color: 'purple' },
  { value: 'entregado', label: 'Entregado', color: 'emerald' },
  { value: 'cancelado', label: 'Cancelado', color: 'red' },
] as const;

export const TALLAS_DISPONIBLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const COLORES_DISPONIBLES = [
  { value: 'blanco', label: 'Blanco', hex: '#FFFFFF' },
  { value: 'negro', label: 'Negro', hex: '#000000' },
  { value: 'azul', label: 'Azul', hex: '#0000FF' },
  { value: 'rojo', label: 'Rojo', hex: '#FF0000' },
  { value: 'verde', label: 'Verde', hex: '#00FF00' },
  { value: 'amarillo', label: 'Amarillo', hex: '#FFFF00' },
  { value: 'gris', label: 'Gris', hex: '#808080' },
] as const;
