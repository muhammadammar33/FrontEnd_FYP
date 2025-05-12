import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function CategorySection() {
    const categories = [
        {
        name: "Clothing",
        image: "/images/clothing.png",
        href: "/products?category=clothing",
        },
        {
        name: "Accessories",
        image: "/images/accessories.jpg?height=120&width=120",
        href: "/products?category=accessories",
        },
        {
        name: "Footwear",
        image: "/images/footwear.png?height=120&width=120",
        href: "/products?category=footwear",
        },
        {
        name: "Sale",
        image: "/images/sale.png?height=120&width=120",
        href: "/products?sale=true",
        },
    ]

    return (
        <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            View All
            </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
            <Link key={category.name} href={category.href}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-4 text-center">
                    <div className="mx-auto mb-3 relative h-24 w-24 overflow-hidden rounded-full bg-muted">
                    <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover rounded-full"
                    />
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                </CardContent>
                </Card>
            </Link>
            ))}
        </div>
        </section>
    )
}
