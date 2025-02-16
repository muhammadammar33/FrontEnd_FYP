"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({ className, ...props } : React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [{
        href: `/seller/${params.storeId}`,
        label: 'Overview',
        active: pathname === `/seller/${params.storeId}`
    }, {
        href: `/seller/${params.storeId}/billboards`,
        label: 'Billboards',
        active: pathname === `/seller/${params.storeId}/billboards`
    }, {
        href: `/seller/${params.storeId}/categories`,
        label: 'Categories',
        active: pathname === `/seller/${params.storeId}/categories`
    }, {
        href: `/seller/${params.storeId}/sizes`,
        label: 'Sizes',
        active: pathname === `/seller/${params.storeId}/sizes`
    }, {
        href: `/seller/${params.storeId}/colors`,
        label: 'Colors',
        active: pathname === `/seller/${params.storeId}/colors`
    }, {
        href: `/seller/${params.storeId}/products`,
        label: 'Products',
        active: pathname === `/seller/${params.storeId}/products`
    }, {
        href: `/seller/${params.storeId}/orders`,
        label: 'Orders',
        active: pathname === `/seller/${params.storeId}/orders`
    }, {
        href: `/seller/${params.storeId}/settings`,
        label: 'Settings',
        active: pathname === `/seller/${params.storeId}/settings`
    }];
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route, index) => (
                <Link key={index} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                    {route.label}
                </Link>
            ))} 
        </nav>
    )
}