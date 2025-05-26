"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { 
  ChevronRight, 
  Sparkles, 
  RefreshCcw, 
  ShoppingBag, 
  Heart,
  Clock,
  Palette,
  Shirt,
  Calendar
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { mockProducts } from "@/lib/mock-data"

export default function GRWMPage() {
  const [occasion, setOccasion] = useState("casual")
  const [style, setStyle] = useState("modern")
  const [budget, setBudget] = useState([50, 200]) // min, max in dollars
  const [loading, setLoading] = useState(false)
  const [outfits, setOutfits] = useState<Array<{
    id: string;
    name: string;
    items: typeof mockProducts;
    image: string;
  }>>([
    {
      id: "outfit-1",
      name: "Casual Friday",
      items: mockProducts.slice(0, 3),
      image: "/images/beauty.jpeg"
    },
    {
      id: "outfit-2",
      name: "Weekend Vibes",
      items: mockProducts.slice(3, 6),
      image: "/images/beauty.jpeg"
    },
  ])

  const generateOutfits = () => {
    setLoading(true)
    
    // In a real app, this would be an API call to get outfit recommendations
    setTimeout(() => {
      // Simulate new outfits being generated
      const newOutfits = [
        {
          id: "outfit-3",
          name: occasion === "formal" ? "Business Elegance" : "Street Style Mix",
          items: mockProducts.slice(0, 4),
          image: "/images/beauty.jpeg"
        },
        {
          id: "outfit-4",
          name: occasion === "casual" ? "Everyday Comfort" : "Night Out Look",
          items: mockProducts.slice(5, 8),
          image: "/images/beauty.jpeg"
        },
      ]
      
      setOutfits(newOutfits)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Sparkles className="h-6 w-6 mr-2 text-purple-500" />
            Get Ready With Me
          </h1>
          <p className="text-muted-foreground">
            Let our AI stylist create the perfect outfit combinations for your needs
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tell us what you&#39;re looking for</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Occasion
                </label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="date">Date Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                  Style Preference
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="streetwear">Streetwear</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Shirt className="h-4 w-4 mr-2 text-muted-foreground" />
                  Budget Range
                </label>
                <div className="pt-4 px-2">
                  <Slider 
                    value={budget} 
                    min={10} 
                    max={500} 
                    step={10} 
                    onValueChange={setBudget} 
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${budget[0]}</span>
                    <span>${budget[1]}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                size="lg"
                onClick={generateOutfits}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Outfit Ideas
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="outfits" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="outfits">Complete Outfits</TabsTrigger>
            <TabsTrigger value="items">Individual Pieces</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outfits" className="mt-6">
            {outfits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outfits.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="relative h-64 w-full">
                      <Image
                        src={outfit.image}
                        alt={outfit.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="text-xl font-semibold">{outfit.name}</h3>
                          <p className="text-sm opacity-80">
                            {outfit.items.length} items • ${outfit.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Generated just now</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h4 className="font-medium mb-3">Included Items</h4>
                      <div className="space-y-2">
                        {outfit.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded-md mr-3 relative overflow-hidden">
                                <Image
                                  src={item.images[0] || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm truncate max-w-[150px]">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button className="flex-1" asChild>
                          <Link href={`/buyer/grwm/${outfit.id}`}>
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="secondary" className="flex-1">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add All to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Generate outfit recommendations to see them here!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="items" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mockProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
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
