"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ShoppingCart, Star, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/buyer/cart-provider"
import { mockProducts } from "@/lib/mock-data"
import ProductCard from "@/components/buyer/product-card"

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const { addToCart } = useCart()

    // In a real app, you would fetch the product data based on the productId
    // For this example, we'll use a mock product
    const product = mockProducts.find((p) => p.id === params.productId) || mockProducts[0]

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
        alert("Please select size and color")
        return
        }

        addToCart({
        ...product,
        quantity,
        selectedOptions: {
            size: selectedSize,
            color: selectedColor,
        },
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                src={product.images[activeImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                />
            </div>

            <div className="flex space-x-2 overflow-auto pb-2">
                {product.images.map((image, index) => (
                <button
                    key={index}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                    activeImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    title={`Thumbnail ${index + 1}`}
                >
                    <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    />
                </button>
                ))}
            </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center space-x-2">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`h-5 w-5 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.discount && <Badge className="ml-2">{product.discount}% OFF</Badge>}
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex space-x-2">
                    {["Black", "White", "Red", "Blue", "Green"].map((color) => (
                    <button
                        key={color}
                        className={`h-10 w-10 rounded-full border ${
                        selectedColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select ${color} color`}
                    />
                    ))}
                </div>
                </div>

                <div>
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                        key={size}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 ${
                        selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => setSelectedSize(size)}
                    >
                        {size}
                    </button>
                    ))}
                </div>
                </div>

                <div>
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center space-x-2">
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    >
                    -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                    >
                    +
                    </Button>
                </div>
                </div>
            </div>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
                </Button>
                <Button variant="secondary" className="flex-1">
                Buy Now
                </Button>
                <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="text-sm">30-day money-back guarantee</span>
                </div>
            </div>
            </div>
        </div>

        <div className="mt-12">
            <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-4">
                <div className="prose max-w-none">
                <p>{product.description}</p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                    nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                    nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                </p>
                <ul>
                    <li>Premium quality material</li>
                    <li>Comfortable fit</li>
                    <li>Durable and long-lasting</li>
                    <li>Easy to care for</li>
                </ul>
                </div>
            </TabsContent>
            <TabsContent value="details" className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-medium mb-2">Product Details</h3>
                    <ul className="space-y-2">
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span>100% Cotton</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Style</span>
                        <span>Casual</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Pattern</span>
                        <span>Solid</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Care</span>
                        <span>Machine Wash</span>
                    </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                    <ul className="space-y-2">
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>3-5 Business Days</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Free Shipping</span>
                        <span>On orders over $50</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-muted-foreground">Returns</span>
                        <span>30-day returns</span>
                    </li>
                    </ul>
                </div>
                </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-4">
                <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <Button>Write a Review</Button>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between">
                        <div>
                            <div className="flex items-center space-x-2">
                            <span className="font-medium">John Doe</span>
                            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                key={j}
                                className={`h-4 w-4 ${j < 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                                />
                            ))}
                            </div>
                        </div>
                        <div>
                            <Badge variant="outline">Verified Purchase</Badge>
                        </div>
                        </div>
                        <p className="mt-2 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
                        nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                        </p>
                    </div>
                    ))}
                </div>
                </div>
            </TabsContent>
            </Tabs>
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
        </div>
    )
}
