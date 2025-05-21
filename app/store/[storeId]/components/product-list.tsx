"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductListProps {
    title: string;
    items: Product[];
    viewAllUrl?: string;
}

const ProductList: React.FC<ProductListProps> = ({ title, items, viewAllUrl }) => {
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

    if (items?.length === 0) return <NoResults />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold">{title}</h3>
                {viewAllUrl && (
                    <Link href={viewAllUrl} className="text-blue-600 hover:underline font-medium">
                        View All
                    </Link>
                )}
            </div>
            
            <div className="relative">
                {/* Left scroll button */}
                {showLeftArrow && (
                    <Button 
                        onClick={scrollLeft} 
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-white text-black hover:bg-sky-100 p-0"
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
                    {items.map(item => (
                        <div 
                            key={item.id} 
                            className="min-w-[280px] flex-shrink-0 snap-start"
                            style={{ width: 'calc(25% - 16px)' }}
                        >
                            <ProductCard data={item} />
                        </div>
                    ))}
                </div>

                {/* Right scroll button */}
                {showRightArrow && (
                    <Button 
                        onClick={scrollRight} 
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-white text-black hover:bg-sky-100 p-0"
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
        </div>
    )
}

export default ProductList;