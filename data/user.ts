import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const getUserbyEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({ where: { email } });
        return user;
    } catch {
        return null;
    }
};

export const getUserbyRole = async (role: UserRole) => {
    try {
        const user = await db.user.findFirst({ where: { role } });
        return user;
    } catch {
        return null;
    }
};

export const getUserbyPhone = async (phone: string) => {
    try {
        const user = await db.user.findUnique({ where: { phone } });
        return user;
    } catch {
        return null;
    }
};

export const getUserbyId = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        return user;
    } catch {
        return null;
    }
};