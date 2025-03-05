import { db } from "@/lib/db";

export const getProductsCount = async (storeId: string) => {
    const products = await db.products.findMany({
        where: {
            StoreId: storeId,
            Stock: {
                gt: 0
            },
        },
        select: {
            Stock: true, // Only fetch the Stock field
        }
    });

    // Sum up the stock of all products
    const totalStock = products.reduce((sum, product) => sum + product.Stock, 0);

    return totalStock;
};
