import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HeroSection from "@/components/buyer/hero-section"
import CategorySection from "@/components/buyer/category-section"
import FeaturedProducts from "@/components/buyer/featured-products"
import NewArrivals from "@/components/buyer/new-arrivals"
import Newsletter from "@/components/buyer/newsletter"

export default function BuyerHomePage() {
    return (
        <div className="flex flex-col min-h-screen">
        <HeroSection />

        <div className="container mx-auto px-4 py-8 space-y-12">
            <CategorySection />

            <FeaturedProducts />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <Card className="overflow-hidden">
                <div className="relative h-[300px] bg-muted/40">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Summer Collection</h3>
                    <p className="text-white/80 mb-6 max-w-md">
                    Discover our latest summer styles with breathable fabrics perfect for warm weather.
                    </p>
                    <Button className="w-fit">Shop Collection</Button>
                </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="relative h-[300px] bg-muted/40">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Accessories</h3>
                    <p className="text-white/80 mb-6 max-w-md">
                    Complete your look with our premium selection of accessories and jewelry.
                    </p>
                    <Button className="w-fit">Explore Now</Button>
                </div>
                </div>
            </Card>
            </div>

            <NewArrivals />

            <Newsletter />
        </div>
        </div>
    )
}
