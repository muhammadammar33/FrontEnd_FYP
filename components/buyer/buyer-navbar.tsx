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
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/buyer/cart-provider"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react";
import { Video } from "lucide-react"
import { ListItem } from "@/components/ui/list-item"

export default function BuyerNavbar() {
    const [showSearchInput, setShowSearchInput] = useState(false)
    const { cart } = useCart()

    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                <Link href="/buyer" className="text-sm font-medium transition-colors hover:text-primary">
                    Home
                </Link>
                <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                    All Products
                </Link>
                <Link
                    href="/products?category=clothing"
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    Clothing
                </Link>
                <Link
                    href="/products?category=accessories"
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    Accessories
                </Link>
                <Link
                    href="/products?category=footwear"
                    className="text-sm font-medium transition-colors hover:text-primary"
                >
                    Footwear
                </Link>
                <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                    About
                </Link>
                <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                    Contact
                </Link>
                </nav>
            </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
            <Link href="/buyer" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">le&#39;Elysian</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <Link href="/buyer" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                            <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href="/buyer/products"
                            >
                                <div className="mb-2 mt-4 text-lg font-medium">All Products</div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                Browse our complete collection of products
                                </p>
                            </a>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <Link href="/buyer/products?category=clothing" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                )}
                            >
                                <div className="text-sm font-medium leading-none">Clothing</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                T-shirts, hoodies, jeans, and more
                                </p>
                            </NavigationMenuLink>
                            </Link>
                        </li>
                        <li>
                            <Link href="/buyer/products?category=accessories" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                )}
                            >
                                <div className="text-sm font-medium leading-none">Accessories</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Watches, jewelry, bags, and more
                                </p>
                            </NavigationMenuLink>
                            </Link>
                        </li>
                        <li>
                            <Link href="/buyer/products?category=footwear" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                )}
                            >
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
                    <NavigationMenuItem>
                    <Link href="buyer/about" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                    <Link href="buyer/contact" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    {/* // Add this to your existing NavigationMenu */}
                        <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Discover
                            </div>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                <Link
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/buyer/recommendations"
                                >
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                    Smart Recommendations
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                    Get personalized product suggestions based on your style
                                    </p>
                                </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/buyer/recommendations?type=text" title="Text Search">
                                Find products by describing what you're looking for
                            </ListItem>
                            <ListItem href="/buyer/recommendations?type=image" title="Image Search">
                                Upload an image to find similar products
                            </ListItem>
                            <ListItem href="/buyer/recommendations/trending" title="Trending">
                                Discover what's popular right now
                            </ListItem>
                            </ul>
                        </NavigationMenuContent>
                        </NavigationMenuItem>
                </NavigationMenuList>
                </NavigationMenu>
            </nav>
            </div>

            <div className="ml-auto flex items-center gap-2">
            <div className={cn("hidden sm:block", showSearchInput ? "w-60" : "w-0 opacity-0")}>
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className={cn("w-full pl-8 transition-all duration-300", showSearchInput ? "opacity-100" : "opacity-0")}
                    onBlur={() => setShowSearchInput(false)}
                />
                </div>
            </div>

            <Button variant="ghost" size="icon" onClick={() => setShowSearchInput(!showSearchInput)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>

            <Button variant="ghost" size="icon" asChild>
                <Link href="buyer/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/buyer/account/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/buyer/account/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/buyer/account/wishlist">Wishlist</Link>
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

            <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/buyer/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {cartItemCount}
                    </Badge>
                )}
                <span className="sr-only">Cart</span>
                </Link>
            </Button>
            </div>
        </div>
        </header>
    )
}
