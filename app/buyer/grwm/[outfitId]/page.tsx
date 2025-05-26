"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  RefreshCcw,
  Share2,
  Check,
  Sparkles
} from "lucide-react"
import { mockProducts } from "@/lib/mock-data"
import { useCart } from "@/components/buyer/cart-provider"

export default function OutfitDetailPage({ params }: { params: { outfitId: string } }) {
  const { addToCart } = useCart()
  const [outfit, setOutfit] = useState<{
    id: string;
    name: string;
    description: string;
    items: typeof mockProducts;
    image: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  
  useEffect(() => {
    // In a real app, this would be an API call to get outfit details
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data for the outfit
      setOutfit({
        id: params.outfitId,
        name: params.outfitId === "outfit-1" ? "Casual Friday" : "Weekend Vibes",
        description: "This versatile outfit is perfect for transitioning from day to night. The comfortable yet stylish pieces work well together while maintaining a polished look that's appropriate for many occasions.",
        items: mockProducts.slice(0, 4),
        image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      })
      setLoading(false)
    }, 1000)
  }, [params.outfitId])
  
  const handleAddAllToCart = () => {
    if (!outfit) return
    
    // Add each item in the outfit to cart
    outfit.items.forEach(item => {
      addToCart({
        ...item,
        quantity: 1,
        selectedOptions: {
          color: "Default",
          size: "M"
        }
      })
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading outfit details...</p>
        </div>
      </div>
    )
  }
  
  if (!outfit) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Outfit not found</p>
        <Button asChild className="mt-4">
          <Link href="/buyer/grwm">Back to GRWM</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 pl-0">
            <Link href="/buyer/grwm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to GRWM
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold flex items-center">
            {outfit.name}
            <Sparkles className="ml-2 h-5 w-5 text-purple-500" />
          </h1>
          <p className="text-muted-foreground mt-2">{outfit.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={outfit.image}
                  alt={outfit.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <h2 className="font-semibold">Complete Look</h2>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg mb-4">Outfit Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="font-semibold">
                      ${outfit.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Items</span>
                    <span>{outfit.items.length} pieces</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Style</span>
                    <span>Casual Chic</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3 mb-6">
                  <h3 className="font-medium">Styling Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Layer the top with a light jacket for cooler evenings</li>
                    <li>• Add simple accessories to elevate the look</li>
                    <li>• Works with both sneakers and casual boots</li>
                    <li>• Great for social gatherings or casual workdays</li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                  onClick={handleAddAllToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add All Items to Cart
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">Items in This Outfit</TabsTrigger>
            <TabsTrigger value="alternatives">Alternative Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {outfit.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{item.description.substring(0, 30)}...</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        addToCart({
                          ...item,
                          quantity: 1,
                          selectedOptions: {
                            color: "Default",
                            size: "M"
                          }
                        });
                      }}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="alternatives" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {mockProducts.slice(5, 9).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{item.description.substring(0, 30)}...</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      <Button variant="outline" size="sm">
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Swap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
