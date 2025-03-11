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