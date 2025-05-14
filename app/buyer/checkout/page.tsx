"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/buyer/cart-provider"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
    const { cart, clearCart } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Clear cart and redirect to success page
        clearCart()
        router.push("/buyer/checkout/success")
    }

    if (cart.length === 0) {
        router.push("/buyer/cart")
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
            <form onSubmit={handleSubmitOrder}>
                <div className="space-y-8">
                <Card>
                    <CardContent className="p-6">
                    <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" required />
                        </div>
                        <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" required />
                        </div>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                    <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                        </div>
                        <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                        </div>
                        <div className="sm:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" required />
                        </div>
                        <div className="sm:col-span-2">
                        <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                        <Input id="apartment" />
                        </div>
                        <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                        </div>
                        <div>
                        <Label htmlFor="state">State / Province</Label>
                        <Input id="state" required />
                        </div>
                        <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" required />
                        </div>
                        <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" defaultValue="United States" required />
                        </div>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                    <h2 className="text-lg font-medium mb-4">Shipping Method</h2>
                    <RadioGroup defaultValue="standard">
                        <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="font-normal">
                            Standard Shipping (3-5 business days)
                            </Label>
                        </div>
                        <div>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</div>
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="font-normal">
                            Express Shipping (1-2 business days)
                            </Label>
                        </div>
                        <div>$12.99</div>
                        </div>
                    </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                    <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                    <Tabs defaultValue="card">
                        <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card">Credit Card</TabsTrigger>
                        <TabsTrigger value="paypal">PayPal</TabsTrigger>
                        <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                        </TabsList>
                        <TabsContent value="card" className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" required />
                            </div>
                            <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="nameOnCard">Name on Card</Label>
                            <Input id="nameOnCard" required />
                        </div>
                        </TabsContent>
                        <TabsContent value="paypal" className="pt-4">
                        <div className="text-center py-8">
                            <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                            <Button type="button" className="w-full">
                            Continue with PayPal
                            </Button>
                        </div>
                        </TabsContent>
                        <TabsContent value="apple" className="pt-4">
                        <div className="text-center py-8">
                            <p className="mb-4">You will be redirected to Apple Pay to complete your payment.</p>
                            <Button type="button" className="w-full">
                            Continue with Apple Pay
                            </Button>
                        </div>
                        </TabsContent>
                    </Tabs>
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button variant="outline" asChild>
                    <Link href="/buyer/cart">Back to Cart</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                    </Button>
                </div>
                </div>
            </form>
            </div>

            <div>
            <Card className="sticky top-8">
                <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                <div className="space-y-4">
                    {cart.map((item) => (
                    <div
                        key={`${item.id}-${item.selectedOptions?.color}-${item.selectedOptions?.size}`}
                        className="flex justify-between"
                    >
                        <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-muted mr-2 flex-shrink-0"></div>
                        <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                            {item.selectedOptions?.color}, {item.selectedOptions?.size} × {item.quantity}
                            </p>
                        </div>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </div>

                <Separator className="my-4" />

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
                </CardContent>
                <CardFooter className="p-6 pt-0">
                <p className="text-xs text-muted-foreground">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
                </CardFooter>
            </Card>
            </div>
        </div>
        </div>
    )
}
