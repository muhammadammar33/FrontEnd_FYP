"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Heart, Menu, Search, ShoppingBag, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/buyer/cart-provider"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react";
import { Video } from "lucide-react"
import { ListItem } from "@/components/ui/list-item"
import Image from 'next/image';
import Elysian from '@/public/images/Ely.gif';

export default function BuyerNavbar() {
    const [showSearchInput, setShowSearchInput] = useState(false)
    const { cart } = useCart()

    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-sky-600 backdrop-blur-sm shadow-sm">
            <div className="container flex h-16 items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <div className="flex items-center mb-8">
                            <Image className="w-12 h-12 rounded-full mr-3" src={Elysian} alt="Logo" />
                            <h2 className="text-xl font-bold">le&#39;Elysian</h2>
                        </div>
                        <nav className="flex flex-col gap-4">
                            <Link href="/buyer" className="flex items-center p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100">
                                Home
                            </Link>
                            <Link href="/products" className="flex items-center p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100">
                                All Products
                            </Link>
                            <Link href="/products?category=clothing" className="flex items-center p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100">
                                Clothing
                            </Link>
                            <Link href="/products?category=accessories" className="flex items-center p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100">
                                Accessories
                            </Link>
                            <Link href="/products?category=footwear" className="flex items-center p-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100">
                                Footwear
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2">
                    <Link href="/buyer" className="mr-6 flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <Image className="w-10 h-10 rounded-full object-cover" src={Elysian} alt="Logo" />
                        <span className="hidden sm:inline-block font-bold text-lg">le&#39;Elysian</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href="/buyer" legacyBehavior passHref>
                                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-medium")}>Home</NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="font-medium">Shop</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-sky-300 to-blue-900 p-6 no-underline outline-none focus:shadow-md hover:bg-blue-100 transition-colors"
                                                    href="/buyer/products">
                                                        <div className="mb-2 mt-4 text-lg font-medium">All Products</div>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Browse our complete collection of products
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <Link href="/buyer/products?category=clothing" legacyBehavior passHref>
                                                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                        <div className="text-sm font-medium leading-none">Clothing</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            T-shirts, hoodies, jeans, and more
                                                        </p>
                                                    </NavigationMenuLink>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/buyer/products?category=accessories" legacyBehavior passHref>
                                                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                        <div className="text-sm font-medium leading-none">Accessories</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            Watches, jewelry, bags, and more
                                                        </p>
                                                    </NavigationMenuLink>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/buyer/products?category=footwear" legacyBehavior passHref>
                                                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                        <div className="text-sm font-medium leading-none">Footwear</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            Sneakers, boots, sandals, and more
                                                        </p>
                                                    </NavigationMenuLink>
                                                </Link>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {/* Search bar */}
                    <div className={cn("flex items-center gap-2", showSearchInput ? "w-full md:w-64" : "w-auto")}>
                        {showSearchInput && (
                            <div className="relative w-full transition-all">
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full h-9 pl-8 rounded-full"
                                    autoFocus
                                    onBlur={() => setShowSearchInput(false)}
                                />
                                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                        {!showSearchInput && (
                            <Button variant="ghost" size="icon" onClick={() => setShowSearchInput(true)} className="hover:bg-sky-300 rounded-full">
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Search</span>
                            </Button>
                        )}
                    </div>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-sky-300 rounded-full">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Account</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/buyer/account/profile" className="flex items-center cursor-pointer">
                                    <User className="h-4 w-4 mr-2" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/buyer/account/orders" className="flex items-center cursor-pointer">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Orders
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span
                                    onClick={() => signOut({ callbackUrl: "/auth/Login" })}
                                    className="flex items-center cursor-pointer"
                                >
                                    <ExitIcon className="h-4 w-4 mr-2" />
                                    Logout
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
