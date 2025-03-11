import {db} from "@/lib/db";

export const getStoreSalesCount = async (storeId: string) => {
    const salesCount = await db.order.count({
        where: {
            StoreId: storeId,
            IsPaid: true,
        }
    });

    return salesCount;
}

export const getTotalSalesCount = async () => {
    const salesCount = await db.order.count({
        where: {
            IsPaid: true,
        }
    });

    return salesCount;
}