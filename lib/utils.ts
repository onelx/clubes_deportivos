import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { EstadoPedido, ESTADOS_PEDIDO } from '@/types'

// ===========================================
// UTILIDADES DE CLASES CSS
// ===========================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================================
// FORMATEO DE PRECIOS Y NÚMEROS
// ===========================================

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// ===========================================
// FORMATEO DE FECHAS
// ===========================================

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, "dd/MM/yyyy 'a las' HH:mm", { locale: es })
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es })
}

// ===========================================
// GENERADORES DE IDS Y SLUGS
// ===========================================

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function generateSKU(producto: string, talla: string, color: string): string {
  const productoCode = producto.substring(0, 3).toUpperCase()
  const tallaCode = talla.toUpperCase()
  const colorCode = color.substring(0, 3).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${productoCode}-${tallaCode}-${colorCode}-${random}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-')     // Reemplazar caracteres especiales
    .replace(/^-+|-+$/g, '')          // Quitar guiones al inicio/final
    .substring(0, 50)                 // Limitar longitud
}

// ===========================================
// VALIDACIONES
// ===========================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
  return phone.length >= 9 && phoneRegex.test(phone)
}

export function isValidPostalCode(code: string, country: string = 'ES'): boolean {
  const patterns: Record<string, RegExp> = {
    ES: /^[0-9]{5}$/,
    PT: /^[0-9]{4}-[0-9]{3}$/,
    FR: /^[0-9]{5}$/,
    DE: /^[0-9]{5}$/,
  }
  return patterns[country]?.test(code) ?? code.length >= 4
}

export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50
}

// ===========================================
// UTILIDADES DE ARRAYS Y OBJETOS
// ===========================================

export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
    return result
  }, {} as Record<K, T[]>)
}

export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return direction === 'asc' ? comparison : -comparison
  })
}

export function uniqueBy<T>(array: T[], keyFn: (item: T) => string | number): T[] {
  const seen = new Set<string | number>()
  return array.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ===========================================
// UTILIDADES DE STRINGS
// ===========================================

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function titleCase(str: string): string {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

// ===========================================
// UTILIDADES DE COLORES
// ===========================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return true
  // Fórmula de luminosidad percibida
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5
}

export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#FFFFFF'
}

// ===========================================
// UTILIDADES DE ESTADOS DE PEDIDO
// ===========================================

export function getEstadoPedidoConfig(estado: EstadoPedido) {
  const estados: Record<EstadoPedido, { label: string; color: string; bgColor: string }> = {
    pendiente: { label: 'Pendiente', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
    pagado: { label: 'Pagado', color: 'text-green-800', bgColor: 'bg-green-100' },
    en_produccion: { label: 'En Producción', color: 'text-blue-800', bgColor: 'bg-blue-100' },
    enviado: { label: 'Enviado', color: 'text-purple-800', bgColor: 'bg-purple-100' },
    entregado: { label: 'Entregado', color: 'text-gray-800', bgColor: 'bg-gray-100' },
    cancelado: { label: 'Cancelado', color: 'text-red-800', bgColor: 'bg-red-100' },
  }
  return estados[estado]
}

export function canTransitionTo(currentState: EstadoPedido, newState: EstadoPedido): boolean {
  const transitions: Record<EstadoPedido, EstadoPedido[]> = {
    pendiente: ['pagado', 'cancelado'],
    pagado: ['en_produccion', 'cancelado'],
    en_produccion: ['enviado', 'cancelado'],
    enviado: ['entregado'],
    entregado: [],
    cancelado: [],
  }
  return transitions[currentState].includes(newState)
}

// ===========================================
// UTILIDADES DE CÁLCULOS
// ===========================================

export function calcularSubtotal(items: { cantidad: number; precio_unitario: number }[]): number {
  return items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0)
}

export function calcularComision(total: number, porcentaje: number): number {
  return Math.round((total * porcentaje) / 100 * 100) / 100
}

export function calcularPagoClub(total: number, comision: number): number {
  return Math.round((total - comision) * 100) / 100
}

// ===========================================
// DEBOUNCE Y THROTTLE
// ===========================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ===========================================
// UTILIDADES DE URL
// ===========================================

export function buildUrl(base: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(base)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// ===========================================
// ASYNC HELPERS
// ===========================================

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxAttempts) {
        await sleep(delay * attempt)
      }
    }
  }
  
  throw lastError
}

// ===========================================
// STORAGE HELPERS
// ===========================================

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('Error saving to localStorage')
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(key)
  } catch {
    console.error('Error removing from localStorage')
  }
}
