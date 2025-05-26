"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react"
import ProductCard from "@/components/buyer/product-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { mockProducts } from "@/lib/mock-data"
import Link from "next/link"

export default function ProductsPage() {
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState([0, 200])
    const [sortOption, setSortOption] = useState("featured")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const removeFilter = (filter: string) => {
        setActiveFilters(activeFilters.filter((f) => f !== filter))
    }

    const clearAllFilters = () => {
        setActiveFilters([])
        setPriceRange([0, 200])
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
            {/* Mobile Filter Button */}
            <div className="md:hidden w-full">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>
                    <FilterSidebar
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    />
                </div>
                </SheetContent>
            </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <FilterSidebar
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
            />
            
            {/* GRWM Button */}
            <div className="mt-6">
                <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                    <Link href="/buyer/grwm">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Ready With Me
                    </Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Let us suggest outfit combinations for you!
                </p>
            </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
            <div className="flex flex-col space-y-4">
                {/* Search and Sort */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search products..." className="pl-8" />
                </div>

                <div className="flex items-center space-x-2">
                    <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="best-selling">Best Selling</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 py-2">
                    <span className="text-sm font-medium">Active Filters:</span>
                    {activeFilters.map((filter) => (
                    <Button
                        key={filter}
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => removeFilter(filter)}
                    >
                        {filter}
                        <X className="h-3 w-3" />
                    </Button>
                    ))}
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
                    Clear All
                    </Button>
                </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2 py-8">
                <Button variant="outline" size="sm" disabled>
                    Previous
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    3
                </Button>
                <span>...</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    8
                </Button>
                <Button variant="outline" size="sm">
                    Next
                </Button>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

interface FilterSidebarProps {
    activeFilters: string[]
    setActiveFilters: (filters: string[]) => void
    priceRange: number[]
    setPriceRange: (range: number[]) => void
}

function FilterSidebar({ activeFilters, setActiveFilters, priceRange, setPriceRange }: FilterSidebarProps) {
    const toggleFilter = (filter: string) => {
        if (activeFilters.includes(filter)) {
        setActiveFilters(activeFilters.filter((f) => f !== filter))
        } else {
        setActiveFilters([...activeFilters, filter])
        }
    }

    return (
        <div className="space-y-6">
        <div>
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <Slider
            defaultValue={priceRange}
            max={200}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
            />
            <div className="flex items-center justify-between">
            <span className="text-sm">${priceRange[0]}</span>
            <span className="text-sm">${priceRange[1]}</span>
            </div>
        </div>

        <Separator />

        <Accordion type="multiple" defaultValue={["categories", "colors", "sizes"]}>
            <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2">
                {["T-Shirts", "Hoodies", "Jeans", "Dresses", "Jackets"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                        id={`category-${category}`}
                        checked={activeFilters.includes(category)}
                        onCheckedChange={() => toggleFilter(category)}
                    />
                    <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {category}
                    </label>
                    </div>
                ))}
                </div>
            </AccordionContent>
            </AccordionItem>

            <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2">
                {["Black", "White", "Red", "Blue", "Green"].map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                        id={`color-${color}`}
                        checked={activeFilters.includes(color)}
                        onCheckedChange={() => toggleFilter(color)}
                    />
                    <label
                        htmlFor={`color-${color}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {color}
                    </label>
                    </div>
                ))}
                </div>
            </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sizes">
            <AccordionTrigger>Sizes</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                        id={`size-${size}`}
                        checked={activeFilters.includes(size)}
                        onCheckedChange={() => toggleFilter(size)}
                    />
                    <label
                        htmlFor={`size-${size}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {size}
                    </label>
                    </div>
                ))}
                </div>
            </AccordionContent>
            </AccordionItem>
        </Accordion>

        <Separator />

        <div>
            <h3 className="text-sm font-medium mb-2">Customer Ratings</h3>
            <div className="space-y-2">
            {["4★ & above", "3★ & above", "2★ & above", "1★ & above"].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                    id={`rating-${rating}`}
                    checked={activeFilters.includes(rating)}
                    onCheckedChange={() => toggleFilter(rating)}
                />
                <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {rating}
                </label>
                </div>
            ))}
            </div>
        </div>
        </div>
    )
}
