import {db} from "@/lib/db";

export const getStockCount = async (storeId: string) => {
    const salesCount = await db.products.count({
        where: {
            StoreId: storeId,
            IsArchived: true,
        }
    });

    return salesCount;
}