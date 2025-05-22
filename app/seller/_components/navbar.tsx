import React from 'react';
import { currentUser } from "@/lib/auth";
import StoreSwitcher from './store-switcher';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Image from 'next/image';
import Elysian from '@/public/images/Ely.gif';
import Link from "next/link"

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
            <Link href="/seller" className="mr-6 flex items-center space-x-2 transition-opacity hover:opacity-80">
                <Image className="w-10 h-10 rounded-full object-cover" src={Elysian} alt="Logo" />
                <span className="hidden sm:inline-block font-bold text-lg">le&#39;Elysian</span>
            </Link>
            <StoreSwitcher items={stores} />
        </div>
        </div>
    );
};

export default Navbar;
