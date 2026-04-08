"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface CarritoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clubSlug: string;
}

// Drawer lateral del carrito de compras
export function CarritoDrawer({ isOpen, onClose, clubSlug }: CarritoDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCart();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Panel del drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b">
                      <Dialog.Title className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Tu carrito
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Items del carrito */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                      {items.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500">Tu carrito está vacío</p>
                        </div>
                      ) : (
                        <ul className="space-y-6">
                          {items.map((item) => (
                            <li key={item.variante.id} className="flex gap-4">
                              {/* Imagen */}
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                  src={item.producto.imagenes?.[0] || "/placeholder-product.jpg"}
                                  alt={item.producto.nombre}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              {/* Info */}
                              <div className="flex flex-1 flex-col">
                                <h4 className="font-medium text-gray-900">
                                  {item.producto.nombre}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.variante.talla} / {item.variante.color}
                                </p>
                                <p className="mt-1 font-semibold text-club-primary">
                                  {formatPrice(item.producto.precio_base)}
                                </p>

                                {/* Controles de cantidad */}
                                <div className="mt-2 flex items-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(item.variante.id, item.cantidad - 1)}
                                    className="p-1 rounded border hover:bg-gray-100"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center">{item.cantidad}</span>
                                  <button
                                    onClick={() => updateQuantity(item.variante.id, item.cantidad + 1)}
                                    className="p-1 rounded border hover:bg-gray-100"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeItem(item.variante.id)}
                                    className="ml-auto text-sm text-red-600 hover:text-red-700"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer con total y checkout */}
                    {items.length > 0 && (
                      <div className="border-t px-4 py-6 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>{formatPrice(getTotal())}</span>
                        </div>
                        <Link href={`/${clubSlug}/checkout`} onClick={onClose}>
                          <Button className="w-full" size="lg">
                            Finalizar compra
                          </Button>
                        </Link>
                        <p className="text-center text-sm text-gray-500">
                          Envío calculado en el checkout
                        </p>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
