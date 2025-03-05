import Gallery from "@/components/Gallery";
import Info from "@/components/ui/info";
import ProductList from "../../../components/product-list";
import Container from "@/components/ui/container";
import { db } from "@/lib/db";
import { formatter } from '@/lib/utils'

type Params = Promise<{ productId: string }>

const ProductPage = async ({ params }: { params: Params }) => {
    const { productId } = await params;
    const product = await db.products.findFirst({
        where: {
            Id: productId,
        },
        include: {
            Image: true,
        },
        orderBy: {
            CreatedAt: "desc",
        },
    });

    const Category = await db.categories.findFirst({
        where: {
            Id: product?.CategoryId,
        },
        include: {
            Billboards: true,
        }
    });
    const Size = await db.sizes.findFirst({
        where: {
            Id: product?.SizeId,
        }
    });
    const Color = await db.colors.findFirst({
        where: {
            Id: product?.ColorId,
        }
    });

    const Product = product ? {
        id: product.Id,
        name: product.Name,
        category: Category ? {
            id: Category.Id,
            name: Category.Name,
            billboard: {
                id: Category.Billboards.Id,
                label: Category.Billboards.Label,
                imageUrl: Category.Billboards.ImageUrl,
                updatedAt: Category.Billboards.UpdatedAt,
                storeId: Category.Billboards.StoreId,
                createdAt: Category.Billboards.CreatedAt,
            },
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
    } : null;

    const SuggestProducts = await db.products.findMany({
        where: {
            CategoryId: Product?.category?.id,
        },
        include: {
            Image: true,
        },
        orderBy: {
            CreatedAt: "desc",
        },
    });

    const suggestProducts = await Promise.all(SuggestProducts.map(async product => {
        const Category = await db.categories.findFirst({
            where: {
                Id: product.CategoryId,
            },
            include: {
                Billboards: true,
            }
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
                billboard: {
                    id: Category.Billboards.Id,
                    label: Category.Billboards.Label,
                    imageUrl: Category.Billboards.ImageUrl,
                    updatedAt: Category.Billboards.UpdatedAt,
                    storeId: Category.Billboards.StoreId,
                    createdAt: Category.Billboards.CreatedAt,
                },
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
    // const product = await getProduct(productId);
    // const suggestProducts = await getProducts({ categoryId: Product?.CategoryId })
    return ( 
        <div className="bg-white">
            <Container>
                <div className="px-4 py-10 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        {/* Gallery */}
                        <Gallery images={Product?.image.map(img => ({ id: img.id, url: img.url })) || []} />
                        <div className="px-4 mt-0 sm:mt-16 sm:px-0 lg:mt-0">
                            {/* Info */}
                            {Product && <Info data={Product} />}
                        </div>
                    </div>
                    <hr className="my-10"/>
                    <ProductList title="Related Items" items={suggestProducts} />
                </div>
            </Container>
        </div>
    );
}

export default ProductPage;