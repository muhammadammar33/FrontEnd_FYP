import { db } from "@/lib/db";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({ params }: { params: Promise<{ productId: string, storeId: string }> }) => {
    const { storeId, productId } = await params;

    const product = productId === "new" 
        ? null 
        : await db.products.findUnique({ 
            where: {
                Id: productId
            },
            include: {
                Image: true
            }
        });

    const productWithImages = product ? { ...product, Images: product.Image } : null;

    const categories = await db.categories.findMany({
        where: {
            StoreId: storeId
        },
    })

    const sizes = await db.sizes.findMany({
        where: {
            StoreId: storeId
        },
    })

    const colors = await db.colors.findMany({
        where: {
            StoreId: storeId
        },
    })

    return (
        <div className="flex-col m-6">
                <ProductForm
                    initialData={productWithImages}
                    // initialData={product}
                    Colors={colors}
                    Sizes={sizes}
                    Categories={categories}
                />
        </div>
    )
}

export default ProductPage;