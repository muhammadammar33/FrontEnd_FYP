import Link from "next/link"
import ProductCard from "@/components/buyer/product-card"
import { mockProducts } from "@/lib/mock-data"

export default function FeaturedProducts() {
  // In a real app, you would filter products that are featured
    const featuredProducts = mockProducts.slice(0, 4)

    return (
        <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <Link href="/products?featured=true" className="text-sm font-medium text-primary hover:underline">
            View All
            </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </section>
    )
}
