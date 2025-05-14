"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "@/components/buyer/cart-provider"

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
    const [couponCode, setCouponCode] = useState("")

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    if (cart.length === 0) {
        return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="mx-auto max-w-md">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">Looks like you haven&#39;t added anything to your cart yet.</p>
            <Button asChild className="mt-8">
                <Link href="/buyer/products">Continue Shopping</Link>
            </Button>
            </div>
        </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
            <div className="space-y-4">
                {cart.map((item) => (
                <Card key={`${item.id}-${item.selectedOptions?.color}-${item.selectedOptions?.size}`}>
                    <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                            <div>
                            <h3 className="text-base font-medium">
                                <Link href={`/products/${item.id}`} className="hover:underline">
                                {item.name}
                                </Link>
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {item.selectedOptions?.color}, {item.selectedOptions?.size}
                            </p>
                            </div>
                            <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-md">
                            <button
                                className="px-3 py-1 text-sm"
                                onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-3 py-1 text-sm border-x">{item.quantity}</span>
                            <button className="px-3 py-1 text-sm" onClick={() => updateQuantity(item, item.quantity + 1)}>
                                +
                            </button>
                            </div>

                            <button
                            className="flex items-center text-sm text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item)}
                            >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                            </button>
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            <div className="mt-6 flex justify-between">
                <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" onClick={clearCart}>
                Clear Cart
                </Button>
            </div>
            </div>

            <div>
            <Card>
                <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                <div className="space-y-2">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex space-x-2">
                    <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    <Button variant="outline">Apply</Button>
                    </div>
                </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                <Button className="w-full" asChild>
                    <Link href="/buyer/checkout">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            </div>
        </div>
        </div>
    )
}
