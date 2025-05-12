"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Image from "next/image"

const carouselImages = [
    "/images/Ely.gif",
    "/images/Ely.png",
    "/images/Elysian.png",
    "/images/mall.jpg",
]

export default function HeroSection() {
    const [currentImage, setCurrentImage] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % carouselImages.length)
        }, 5000)
        
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            {carouselImages.map((image, index) => (
                <div 
                    key={image}
                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: currentImage === index ? 1 : 0 }}
                >
                    <Image 
                        src={image} 
                        alt={`Hero image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full flex items-center">
                <div className="container px-4">
                    <div className="max-w-lg">
                        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Summer Collection 2025</h1>
                        <p className="mt-4 text-lg text-white/90">
                            Discover the latest trends and styles for the summer season. Shop our new arrivals now.
                        </p>
                        <div className="mt-8 flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <Button size="lg" asChild>
                                <Link href="/buyer/products">Shop Now</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20" asChild>
                                <Link href="buyer/products?collection=summer">View Collection</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Navigation dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2 h-2 rounded-full ${
                            currentImage === index ? "bg-white" : "bg-white/50"
                        } transition-all`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
