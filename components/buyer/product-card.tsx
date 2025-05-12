"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/components/buyer/cart-provider"

interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number
    discount?: number
    images: string[]
    rating: number
    reviewCount: number
    description: string
}

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        addToCart({
        ...product,
        quantity: 1,
        selectedOptions: {
            color: "Black",
            size: "M",
        },
        })
    }

    return (
        <Link href={`/buyer/products/${product.id}`}>
        <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden">
            <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
            />
            {product.discount && (
                <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
            )}
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Add to wishlist functionality would go here
                }}
            >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
            </Button>
            </div>
            <CardContent className="p-4">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <div className="mt-1 flex items-center">
                <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                    key={i}
                    className={`h-3 w-3 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    />
                ))}
                </div>
                <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="mt-2 flex items-center">
                <span className="font-medium">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                </span>
                )}
            </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
            <Button variant="secondary" size="sm" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
            </CardFooter>
        </Card>
        </Link>
    )
}
