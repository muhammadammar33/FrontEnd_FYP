import {db} from "@/lib/db";

export const getStoreStockCount = async (storeId: string) => {
    const salesCount = await db.products.count({
        where: {
            StoreId: storeId,
            IsArchived: true,
        }
    });

    return salesCount;
}

export const getTotalStockCount = async () => {
    const salesCount = await db.products.count({
        where: {
            IsArchived: true,
        }
    });

    return salesCount;
}