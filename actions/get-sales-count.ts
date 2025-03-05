import {db} from "@/lib/db";

export const getSalesCount = async (storeId: string) => {
    const salesCount = await db.order.count({
        where: {
            StoreId: storeId,
            IsPaid: true,
        }
    });

    return salesCount;
}