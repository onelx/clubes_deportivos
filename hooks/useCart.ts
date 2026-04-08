import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Producto, VarianteProducto } from '@/types'

interface CartState {
  items: CartItem[]
  clubSlug: string | null
  addItem: (producto: Producto, variante: VarianteProducto, clubSlug: string) => void
  removeItem: (varianteId: string) => void
  updateQuantity: (varianteId: string, cantidad: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

// Store del carrito con persistencia en localStorage
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      clubSlug: null,

      addItem: (producto, variante, clubSlug) => {
        const { items, clubSlug: currentSlug } = get()
        
        // Si el carrito tiene items de otro club, lo vaciamos
        if (currentSlug && currentSlug !== clubSlug) {
          set({ items: [], clubSlug })
        }

        const existingIndex = items.findIndex(
          (item) => item.variante.id === variante.id
        )

        if (existingIndex > -1) {
          // Incrementar cantidad si ya existe
          const newItems = [...items]
          newItems[existingIndex].cantidad += 1
          set({ items: newItems, clubSlug })
        } else {
          // Agregar nuevo item
          set({
            items: [...items, { producto, variante, cantidad: 1 }],
            clubSlug,
          })
        }
      },

      removeItem: (varianteId) => {
        const { items } = get()
        set({ items: items.filter((item) => item.variante.id !== varianteId) })
      },

      updateQuantity: (varianteId, cantidad) => {
        const { items } = get()
        if (cantidad <= 0) {
          set({ items: items.filter((item) => item.variante.id !== varianteId) })
        } else {
          set({
            items: items.map((item) =>
              item.variante.id === varianteId ? { ...item, cantidad } : item
            ),
          })
        }
      },

      clearCart: () => set({ items: [], clubSlug: null }),

      getTotal: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + item.producto.precio_base * item.cantidad,
          0
        )
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.cantidad, 0)
      },
    }),
    {
      name: 'clubshop-cart',
    }
  )
)
