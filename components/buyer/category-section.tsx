"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { StoreCategory } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoriesProps {
    categories: StoreCategory[];
}

// Hardcoded image mappings for categories
const categoryImages: Record<string, string> = {
    "Home & Kitchen": "/images/kitchen.png",
    "Groceries & Essentials": "/images/groceries.jpeg",
    "Fashion & Apparel": "/images/fashion.jpeg",
    "Beauty & Personal Care": "/images/beauty.jpeg",
    "Electronics & Gadgets": "/images/gadgets.jpeg",
    "Sports & Outdoors": "/images/sports.jpg",
    "Books & Stationery": "/images/books.jpeg",
    "Toys & Baby Products": "/images/toys.jpg",
    "Automotive & Tools": "/images/tools.jpeg",
    "Health & Wellness": "/images/health.jpeg",
    "Books": "/images/books.jpg",
    // Default image as fallback
    "default": "/images/default-category.jpg"
}

export default function CategorySection({ categories }: CategoriesProps) {
    // Reference to the scroll container
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)

    // Update arrow visibility based on scroll position
    const handleScroll = () => {
        if (!scrollContainerRef.current) return

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10)
    }

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll)
            // Check initial state
            handleScroll()
        }

        return () => {
            scrollContainer?.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Scroll functions
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    // Function to get the appropriate image for a category
    const getCategoryImage = (categoryName: string): string => {
        return categoryImages[categoryName] || categoryImages.default;
    }

    return (
        <section className="relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
                <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                    View All
                </Link>
            </div>

            <div className="relative">
                {/* Left scroll button */}
                {showLeftArrow && (
                    <Button 
                        onClick={scrollLeft} 
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-white text-black hover:bg-sky-100 p-0"
                    >
                        <ChevronLeft className="h-6 w-6" />
                        <span className="sr-only">Scroll left</span>
                    </Button>
                )}

                {/* Scrollable container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-6 scrollbar-hide snap-x gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category) => (
                        <div key={category.name} className="min-w-[330px] flex-shrink-0 snap-start px-1" style={{ width: 'calc(25% - 18px)' }}>
                            <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] border-none bg-gradient-to-br from-white to-gray-100 h-full">
                                    <CardContent className="p-6 flex flex-col items-center">
                                        <div className="mb-4 relative h-28 w-28 overflow-hidden rounded-full bg-sky-100 shadow-inner transform transition-transform duration-300 hover:rotate-3">
                                            <div className="absolute inset-0 bg-gradient-to-br from-sky-200/50 to-transparent rounded-full" />
                                            <img
                                                src={getCategoryImage(category.name)}
                                                alt={category.name}
                                                className="absolute inset-0 h-full w-full object-cover rounded-full transform transition-transform duration-500 hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-lg text-gray-900 text-center">{category.name}</h3>
                                        <p className="mt-2 text-sm text-gray-600 text-center line-clamp-2">
                                            {category.description} 
                                        </p>
                                        <span className="mt-3 text-sm text-blue-600 font-medium flex items-center">
                                            Shop Now 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                                <path d="M5 12h14"></path>
                                                <path d="M12 5l7 7-7 7"></path>
                                            </svg>
                                        </span>
                                        <div className="w-10 h-0.5 bg-sky-500 mt-2 transition-all duration-300 group-hover:w-20" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Right scroll button */}
                {showRightArrow && (
                    <Button 
                        onClick={scrollRight} 
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-white text-black hover:bg-sky-100 p-0"
                    >
                        <ChevronRight className="h-6 w-6" />
                        <span className="sr-only">Scroll right</span>
                    </Button>
                )}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    )
}
