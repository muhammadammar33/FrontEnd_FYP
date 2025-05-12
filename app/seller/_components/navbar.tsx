import React from 'react';
import { currentUser } from "@/lib/auth";
import StoreSwitcher from './store-switcher';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const Navbar = async () => {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        redirect("/auth/Login");
    }

    const stores = await db?.stores.findMany({
        where: {
        UserId: userId,
        }
    });

    return (
        <div className="sticky top-0 z-20 w-full bg-background border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
            <StoreSwitcher items={stores} />
        </div>
        </div>
    );
};

export default Navbar;
