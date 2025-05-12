import Link from "next/link"
import ProductCard from "@/components/buyer/product-card"
import { mockProducts } from "@/lib/mock-data"

export default function NewArrivals() {
  // In a real app, you would sort products by date and get the newest ones
    const newProducts = mockProducts.slice(4, 8)

    return (
        <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-sm font-medium text-primary hover:underline">
            View All
            </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </section>
    )
}
