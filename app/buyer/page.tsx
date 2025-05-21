import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HeroSection from "@/components/buyer/hero-section"
import CategorySection from "@/components/buyer/category-section"
import FeaturedProducts from "@/components/buyer/featured-products"
import NewArrivals from "@/components/buyer/new-arrivals"
import Newsletter from "@/components/buyer/newsletter"
import StoreList from "../(protected)/_components/store-list";
import { db } from "@/lib/db";
import ProductList from "../store/[storeId]/components/product-list";
import { formatter } from '@/lib/utils'

export default async function BuyerHomePage() {
    const stores = (await db.stores.findMany()).map(store => ({
        id: store.Id,
        name: store.Name,
        description: store.Description,
        status: store.Status,
        imageUrl: store.ImageUrl,
        createdAt: store.CreatedAt,
        updatedAt: store.UpdatedAt,
        userId: store.UserId,
        reason: store.Reason,
    }));
    
    const dbProducts = await db.products.findMany({
        where: {
            IsFeatured: true,
        },
        include: {
            Image: true,
        },
        orderBy: {
            CreatedAt: "desc",
        },
    });

    const products = await Promise.all(dbProducts.map(async product => {
        const Category = await db.categories.findFirst({
            where: {
                Id: product.CategoryId,
            },
        });
        const Size = await db.sizes.findFirst({
            where: {
                Id: product.SizeId,
            }
        });
        const Color = await db.colors.findFirst({
            where: {
                Id: product.ColorId,
            }
        });
        return {
            id: product.Id,
            name: product.Name,
            category: Category ? {
                id: Category.Id,
                name: Category.Name,
                updatedAt: Category.UpdatedAt,
                storeId: Category.StoreId,
                createdAt: Category.CreatedAt,
            } : null,
            price: formatter.format(Number(product.Price)),
            stock: product.Stock,
            description: product.Description,
            color: Color ? {
                id: Color.Id,
                name: Color.Name,
                value: Color.Value,
                updatedAt: Color.UpdatedAt,
                storeId: Color.StoreId,
                createdAt: Color.CreatedAt,
            } : null,
            size: Size ? {
                id: Size.Id,
                name: Size.Name,
                value: Size.Value,
                updatedAt: Size.UpdatedAt,
                storeId: Size.StoreId,
                createdAt: Size.CreatedAt,
            } : null,
            isFeatured: product.IsFeatured,
            isArchived: product.IsArchived,
            createdAt: product.CreatedAt,
            updatedAt: product.UpdatedAt,
            storeId: product.StoreId,
            image: product.Image.map(img => ({
                id: img.Id,
                url: img.Url,
                updatedAt: img.UpdatedAt,
                createdAt: img.CreatedAt,
                productId: img.ProductId
            }))
        };
    }));
    
    const categories = (await db.storeCategories.findMany()).map(category => ({
        id: category.Id,
        name: category.Name,
        description: category.Description || ""
    }));
    
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-300 to-blue-900">
            <HeroSection />

            <div className="container mx-auto px-4 py-12 space-y-16">
                {/* Category Section with fade-in animation */}
                <div className="transition-all duration-300 hover:transform hover:translate-y-[-5px]">
                    <CategorySection categories={categories} />
                </div>
                
                {/* Store Section with improved styling */}
                <div className="rounded-xl overflow-hidden shadow-lg">
                    <div className="flex flex-col px-6 py-8 gap-y-8 bg-gradient-to-r from-blue-800 to-sky-600 text-white">
                        <h2 className="text-3xl font-bold text-center mb-6">Explore Our Partner Stores</h2>
                        <StoreList title="Premium Stores" items={stores} />
                    </div>
                </div>

                <div className="flex flex-col px-4 gap-y-8 sm:px-6 lg:px-8">
                    <ProductList title="Featured Products" items={products} />
                </div>

                {/* Collection Cards with improved styling */}
                <div className="py-12">
                    <h2 className="text-3xl font-bold text-center mb-10">Curated Collections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Card className="overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
                            <div className="relative h-[350px] bg-[url('/summer-collection.jpg')] bg-cover bg-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-8">
                                    <h3 className="text-3xl font-bold text-white mb-3">Summer Collection</h3>
                                    <p className="text-white/90 mb-8 max-w-md text-lg">
                                        Discover our latest summer styles with breathable fabrics perfect for warm weather adventures.
                                    </p>
                                    <Button className="w-fit bg-white text-black hover:bg-white/90 font-medium px-6 py-3 text-lg rounded-full">
                                        Shop Collection
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <Card className="overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
                            <div className="relative h-[350px] bg-[url('/accessories.jpg')] bg-cover bg-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-8">
                                    <h3 className="text-3xl font-bold text-white mb-3">Luxury Accessories</h3>
                                    <p className="text-white/90 mb-8 max-w-md text-lg">
                                        Complete your look with our premium selection of accessories and statement jewelry pieces.
                                    </p>
                                    <Button className="w-fit bg-white text-black hover:bg-white/90 font-medium px-6 py-3 text-lg rounded-full">
                                        Explore Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* New Arrivals section with subtle improvement */}
                <div className="bg-gradient-to-r from-sky-600 to-blue-800 p-6 rounded-2xl shadow-sm">
                    <NewArrivals />
                </div>

                {/* Newsletter with improved styling */}
                {/* <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl shadow-xl">
                    <Newsletter />
                </div> */}
            </div>
        </div>
    )
}
