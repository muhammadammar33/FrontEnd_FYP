import {db} from "@/lib/db";

export const getSellers = async () => {
    const sellersCount = await db.user.count({
        where: {
            role: "SELLER",
        }
    });

    return sellersCount;
}

export const getBuyers = async () => {
    const buyersCount = await db.user.count({
        where: {
            role: "BUYER",       
        }
    });

    return buyersCount;
}

export const getStoreBuyers = async (storeId: string) => {
    // Count unique buyers who have placed orders with this store
    const uniqueBuyers = await db.order.findMany({
        where: {
            StoreId: storeId,
        },
        select: {
            userId: true,
        },
        distinct: ['userId'],
    });

    // Get count of unique buyers
    const buyersCount = uniqueBuyers.length;

    return buyersCount;
}