"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Product {
    id: string
    name: string
    price: number
    images: string[]
    quantity: number
    selectedOptions?: {
        color?: string
        size?: string
    }
}

interface CartContextType {
    cart: Product[]
    addToCart: (product: Product) => void
    removeFromCart: (product: Product) => void
    updateQuantity: (product: Product, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Product[]>([])

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
        try {
            setCart(JSON.parse(savedCart))
        } catch (error) {
            console.error("Failed to parse cart from localStorage:", error)
        }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
        // Check if the product with the same options already exists in the cart
        const existingItemIndex = prevCart.findIndex(
            (item) =>
            item.id === product.id &&
            item.selectedOptions?.color === product.selectedOptions?.color &&
            item.selectedOptions?.size === product.selectedOptions?.size,
        )

        if (existingItemIndex !== -1) {
            // If it exists, update the quantity
            const updatedCart = [...prevCart]
            updatedCart[existingItemIndex].quantity += product.quantity
            return updatedCart
        } else {
            // If it doesn't exist, add it to the cart
            return [...prevCart, product]
        }
        })
    }

    const removeFromCart = (product: Product) => {
        setCart((prevCart) =>
        prevCart.filter(
            (item) =>
            !(
                item.id === product.id &&
                item.selectedOptions?.color === product.selectedOptions?.color &&
                item.selectedOptions?.size === product.selectedOptions?.size
            ),
        ),
        )
    }

    const updateQuantity = (product: Product, quantity: number) => {
        setCart((prevCart) =>
        prevCart.map((item) =>
            item.id === product.id &&
            item.selectedOptions?.color === product.selectedOptions?.color &&
            item.selectedOptions?.size === product.selectedOptions?.size
            ? { ...item, quantity }
            : item,
        ),
        )
    }

    const clearCart = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
        {children}
        </CartContext.Provider>
    )
}
