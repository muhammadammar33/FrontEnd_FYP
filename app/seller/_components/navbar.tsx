// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import { UserButton } from "@/components/auth/user-button";

// export const Navbar = () => {
//     const pathname = usePathname();

//     return (
//         <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
//         <div className="flex gap-x-2">
//             <Button 
//             asChild
//             variant={pathname === "/server" ? "default" : "outline"}
//             >
//             <Link href="/server">
//                 Server
//             </Link>
//             </Button>
//             <Button 
//             asChild
//             variant={pathname === "/client" ? "default" : "outline"}
//             >
//             <Link href="/client">
//                 Client
//             </Link>
//             </Button>
//             <Button 
//             asChild
//             variant={pathname === "/admin" ? "default" : "outline"}
//             >
//             <Link href="/admin">
//                 Admin
//             </Link>
//             </Button>
//             <Button 
//             asChild
//             variant={pathname === "/settings" ? "default" : "outline"}
//             >
//             <Link href="/settings">
//                 Settings
//             </Link>
//             </Button>
//         </div>
//         <UserButton />
//         </nav>
//     );
// };

import React from 'react'
import { currentUser } from "@/lib/auth";
import StoreSwitcher from './store-switcher';
import { redirect } from 'next/navigation'
import { db } from '@/lib/db';
import { ThemeToggle } from './theme-toggle';
import { UserButton } from '@/components/auth/user-button';
import { MainNav } from './main-nav';

const Navbar = async () => {
    const user = await currentUser();
    const userId = user?.id;

    if(!userId) {
        redirect("/auth/Login")
    }

    const stores = await db?.stores.findMany({
        where: {
        UserId: userId,
        }
    })

    return (
        <div className='border-b'>
            <div className='flex items-center h-16 px-4'>
                <StoreSwitcher items={stores} />
                <MainNav className='mx-6' />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </div>
    )
}

export default Navbar