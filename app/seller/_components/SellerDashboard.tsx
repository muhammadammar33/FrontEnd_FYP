"use client"

import { useState, useEffect } from "react"
import { BarChart3, Box, Home, LayoutDashboard, Book, Palette, Package, Settings, ShoppingCart, ChartColumnStacked, Users } from "lucide-react"
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardOverview from "../_components/dashboard-overview"
import ProductsTable from "../_components/products-table"
import OrdersTable from "../_components/orders-table"
import CategoriesTable from "../_components/categories-table"
import ColorsTable from "../_components/colors-table"
import BillboardsTable from "../_components/billboards-table"
import AnalyticsView from "../_components/analytics-view"
import SettingsView from "../_components/settings-view"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation"
import { currentUser } from "@/lib/auth";

type ProductColumn = {
    id: string
    name: string
    price: string
    size: string
    category: string
    color: string
    isFeatured: boolean
    isArchived: boolean
    createdAt: string
    stock: number
    imageUrl?: string
}

type OrderColumn = {
    id: string
    phone: string
    address: string
    isPaid: boolean
    totalPrice: string
    products: string
    createdAt: string
}

type CategoryColumn = {
    id: string
    name: string
    createdAt: string
}

type ColorColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

type BillboardColumn = {
    id: string
    Label: string
    imageUrl?: string
    CreatedAt: string
}

interface SellerDashboardProps {
    storeId: string;
    products: ProductColumn[];
    orders: OrderColumn[];
    categories: CategoryColumn[];
    colors: ColorColumn[];
    billboards: BillboardColumn[]
}

export default function SellerDashboard({ storeId, products, orders, categories, colors, billboards }: SellerDashboardProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const searchParams = useSearchParams()
    const tabParam = searchParams.get('tab')
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await currentUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        
        fetchUser();
    }, []);

    return (
        <SidebarProvider >
        <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar>
            <SidebarHeader className="border-b border-border p-4">
                <div className="flex items-center gap-2">
                <Box className="h-6 w-6" />
                <span className="text-lg font-semibold">Seller Hub</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "products"} onClick={() => setActiveTab("products")}>
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                    <Badge className="ml-auto">{products.length}</Badge>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Orders</span>
                    <Badge className="ml-auto">{orders.length}</Badge>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "categories"} onClick={() => setActiveTab("categories")}>
                    <ChartColumnStacked className="h-4 w-4" />
                    <span>Categories</span>
                    <Badge className="ml-auto">{categories.length}</Badge>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "colors"} onClick={() => setActiveTab("colors")}>
                    <Palette className="h-4 w-4" />
                    <span>Colors</span>
                    <Badge className="ml-auto">{colors.length}</Badge>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "billboards"} onClick={() => setActiveTab("billboards")}>
                    <Book className="h-4 w-4" />
                    <span>Billboards</span>
                    <Badge className="ml-auto">{billboards.length}</Badge>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "customers"} onClick={() => setActiveTab("customers")}>
                    <Users className="h-4 w-4" />
                    <span>Customers</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-border p-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Premium Seller</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
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
            </SidebarFooter>
            </Sidebar>
            <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex flex-1 items-center justify-between">
                <h1 className="text-xl font-semibold">
                    {activeTab === "overview" && "Dashboard Overview"}
                    {activeTab === "products" && "Product Management"}
                    {activeTab === "orders" && "Order Management"}
                    {activeTab === "categories" && "Categories Management"}
                    {activeTab === "colors" && "Colors Management"}
                    {activeTab === "billboards" && "Billboards Management"}
                    {activeTab === "analytics" && "Analytics & Reports"}
                    {activeTab === "customers" && "Customer Management"}
                    {activeTab === "settings" && "Account Settings"}
                </h1>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.location.href = `/store/${storeId}`}>
                    <Home className="mr-2 h-4 w-4" />
                    Visit Store
                    </Button>
                    <Button onClick={() => window.location.href = `/seller/${storeId}/products/new`}>
                    <Package className="mr-2 h-4 w-4" />
                    Add New Product
                    </Button>
                </div>
                </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
                {activeTab === "overview" && <DashboardOverview storeId={storeId} />}
                {activeTab === "products" && <ProductsTable products={products} />}
                {activeTab === "orders" && <OrdersTable orders={orders} />}
                {activeTab === "categories" && <CategoriesTable categories={categories} />}
                {activeTab === "colors" && <ColorsTable colors={colors} />}
                {activeTab === "billboards" && <BillboardsTable billboards={billboards} />}
                {activeTab === "analytics" && <AnalyticsView />}
                {activeTab === "customers" && (
                <div className="grid gap-4">
                    <Card>
                    <CardHeader>
                        <CardTitle>Customer Management</CardTitle>
                        <CardDescription>View and manage your customer base</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Customer management content will appear here.</p>
                    </CardContent>
                    </Card>
                </div>
                )}
                {activeTab === "settings" && <SettingsView storeId={storeId} />}
            </main>
            </div>
        </div>
        </SidebarProvider>
    )
}
