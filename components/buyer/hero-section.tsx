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
        <div className="relative w-full h-[700px] overflow-hidden">
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
                            <Button 
                                size="lg" 
                                asChild 
                                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-6 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Link href="/buyer/products">Shop Now</Link>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="bg-white/20 text-white hover:bg-white/30 border-white/40 rounded-full px-8 py-6 font-semibold text-lg backdrop-blur-sm transition-all duration-300" 
                                asChild
                            >
                                <Link href="buyer/products?collection=summer">View Collection</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Enhanced navigation controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out transform ${
                            currentImage === index 
                                ? "bg-sky-400 scale-125 shadow-lg shadow-sky-400/50" 
                                : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            
            {/* Previous/Next buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
                <button 
                    onClick={() => setCurrentImage(prev => (prev - 1 + carouselImages.length) % carouselImages.length)}
                    className="ml-4 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all"
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
                <button 
                    onClick={() => setCurrentImage(prev => (prev + 1) % carouselImages.length)}
                    className="mr-4 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all"
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
