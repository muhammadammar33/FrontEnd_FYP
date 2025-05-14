import Container from "@/components/ui/container";
import Billboard from "../components/billboard";
import { db } from "@/lib/db";
import ProductList from "../components/product-list";
import { formatter } from '@/lib/utils'

export const revalidate = 0;

interface StorePageProps {
    params: { storeId: string };
}

interface Query {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean;
}

const HomePage = async ({ params }: StorePageProps) => {

    
    const { storeId } = params;

    const dbBillboards = await db.billboards.findMany({
        where: {
            StoreId: storeId,
        },
        orderBy: {
            CreatedAt: "desc",
        },
    });

    const billboards = dbBillboards.map(billboard => ({
        id: billboard.Id,
        label: billboard.Label,
        imageUrl: billboard.ImageUrl,
        createdAt: billboard.CreatedAt,
        updatedAt: billboard.UpdatedAt,
        storeId: billboard.StoreId
    }));
    
    const dbProducts = await db.products.findMany({
        where: {
            StoreId: storeId,
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
    console.log(products);

    return (
        <Container>
            <div className="pb-10 space-y-10">
                
                {billboards.map(billboard => (
                    <Billboard key={billboard.id} data={billboard} />
                ))}

                <div className="flex flex-col px-4 gap-y-8 sm:px-6 lg:px-8">
                    <ProductList title="Featured Products" items={products} />
                </div>
            </div>
        </Container>
    )
}

export default HomePage;