// import getCategory from "@/actions/get-category";
// import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
// import getSizes from "@/actions/get-sizes";
import Billboard from "../../../components/billboard";
import Container from "@/components/ui/container";
import Filter from "./components/filter";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import MobileFilters from "./components/mobile-filters";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";

export const revalidate = 0;

type Params = Promise<{ categoryId: string }>
type SearchParams = Promise<{ colorId: string, sizeId: string }>

const CategoryPage = async ({ params, searchParams }: { params: Params, searchParams: SearchParams }) => {
    const { categoryId } = await params;
    const { colorId, sizeId } = await searchParams;
    // const products = await getProducts({ categoryId: categoryId, colorId: colorId, sizeId: sizeId })
    // const sizes = await getSizes();
    // const colors = await getColors();
    const sizes = (await db.sizes.findMany()).map(size => ({
        id: size.Id,
        name: size.Name,
        value: size.Value,
    }));

    const colors = (await db.colors.findMany()).map(color => ({
        id: color.Id,
        name: color.Name,
        value: color.Value,
    }));

    const category = await db.categories.findFirst({
        where: {
            Id: categoryId,
        }
    });

    const billboardData = await db.billboards.findFirst({
        orderBy: {
            CreatedAt: "desc",
        },
    });

    const Products = await db.products.findMany({
        where: {
            CategoryId: categoryId,
        },
        include: {
            Image: true,
        },
        orderBy: {
            CreatedAt: "desc",
        },
    });

    const suggestProducts = await Promise.all(Products.map(async product => {
        const Category = await db.categories.findFirst({
            where: {
                Id: product.CategoryId,
            },
        });
        const Size = await db.sizes.findFirst({
            where: {
                Id: sizeId,
            }
        });
        const Color = await db.colors.findFirst({
            where: {
                Id: colorId,
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

    // const category = await getCategory(categoryId)
    console.log(category);
    return ( 
        <div className="bg-white">
            <Container>
                {category && billboardData && (
                    <Billboard
                        data={{
                            id: billboardData.Id,
                            label: billboardData.Label,
                            imageUrl: billboardData.ImageUrl,
                        }}
                    />
                )}
                <div className="px-4 pb-24 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                        {/*Add Mobile Filters*/}
                        <MobileFilters sizes={sizes} colors={colors} />
                        {/*Add Computer Filters*/}
                        <div className="hidden lg:block">
                            <Filter
                                valueKey="sizeId"
                                name="Sizes"
                                data={sizes}
                            />
                            <Filter
                                valueKey="colorId"
                                name="Colors"
                                data={colors}
                            />
                        </div>
                        <div className="mt-6 lg:col-span-4 lg:mt-0">
                            {suggestProducts?.length === 0 && <NoResults /> }
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {suggestProducts?.map(item => (
                                    <ProductCard key={item.id} data={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default CategoryPage;