"use client"

import { ArrowRightIcon, ArrowUpIcon, CreditCard, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Overview } from "@/components/ui/overview";

interface DashboardOverviewProps {
    storeId: string;
}

export default function DashboardOverview( { storeId }: DashboardOverviewProps ) {
    const [revenue, setRevenue] = useState<number | null>(null);
    const [salesCount, setSalesCount] = useState<number | null>(null);
    const [stockCount, setStockCount] = useState<number | null>(null);
    const [productCount, setProductCount] = useState<number | null>(null);
    const [graphRevenue, setGraphRevenue] = useState<any[] | null>(null);

    useEffect(() => {
        fetch(`/api/${storeId}/dashboard/revenue`)
        .then((res) => res.json())
        .then((data) => {
            setRevenue(data.totalRevenue);
        })
        .catch(error => console.error("Error fetching revenue:", error));
    }, [storeId]);

    useEffect(() => {
        fetch(`/api/${storeId}/dashboard/sales-count`)
        .then((res) => res.json())
        .then((data) => {
            setSalesCount(data.salesCount);
        })
        .catch(error => console.error("Error fetching sales count:", error));
    }, [storeId]);

    useEffect(() => {
        fetch(`/api/${storeId}/dashboard/stock-count`)
        .then((res) => res.json())
        .then((data) => {
            setStockCount(data.stockCount);
        })
        .catch(error => console.error("Error fetching stock count:", error));
    }, [storeId]);

    useEffect(() => {
        fetch(`/api/${storeId}/dashboard/product-count`)
        .then((res) => res.json())
        .then((data) => {
            setProductCount(data.productCount);
        })
        .catch(error => console.error("Error fetching product count:", error));
    }, [storeId]);

    useEffect(() => {
        fetch(`/api/${storeId}/dashboard/graph-revenue`)
        .then((res) => res.json())
        .then((data) => {
            setGraphRevenue(data.graphRevenue);
        })
        .catch(error => console.error("Error fetching graph revenue:", error));
    }, [storeId]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold transition-all">
                {revenue !== null ? (
                    formatter.format(revenue)
                ) : (
                    <div className="flex items-center space-x-2">
                    <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+20.1%</span>
                <span>from last month</span>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold transition-all">
                {salesCount !== null ? (
                    +salesCount
                ) : (
                    <div className="flex items-center space-x-2">
                    <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+12.2%</span>
                <span>from last month</span>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold transition-all">
                {productCount !== null ? (
                    productCount
                ) : (
                    <div className="flex items-center space-x-2">
                    <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+8 new</span>
                <span>from last month</span>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+32</span>
                <span>from last month</span>
            </div>
            </CardContent>
        </Card>
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Overview data={graphRevenue || []} />
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>View your sales performance across different time periods</CardDescription>
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="weekly">
                <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                    Download Report
                    </Button>
                </div>
                </div>
                <TabsContent value="daily" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Daily sales chart will appear here</p>
                    </div>
                </div>
                </TabsContent>
                <TabsContent value="weekly" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Weekly sales chart will appear here</p>
                    </div>
                </div>
                </TabsContent>
                <TabsContent value="monthly" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Monthly sales chart will appear here</p>
                    </div>
                </div>
                </TabsContent>
                <TabsContent value="yearly" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Yearly sales chart will appear here</p>
                    </div>
                </div>
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                    <div className="mr-4 rounded-full bg-muted p-2">
                    <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Customer {i}</p>
                    <p className="text-xs text-muted-foreground">{i % 2 === 0 ? "Credit Card" : "PayPal"}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-sm font-medium">+${(i * 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
            <CardFooter>
            <Button variant="outline" className="w-full">
                <ArrowRightIcon className="mr-2 h-4 w-4" />
                View All
            </Button>
            </CardFooter>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Monitor your inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">T-Shirts</div>
                    <div className="text-muted-foreground">65% in stock</div>
                </div>
                <Progress value={65} />
                </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Hoodies</div>
                    <div className="text-muted-foreground">32% in stock</div>
                </div>
                <Progress value={32} className="bg-amber-100 [&>div]:bg-amber-600" />
                </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Sneakers</div>
                    <div className="text-muted-foreground">89% in stock</div>
                </div>
                <Progress value={89} />
                </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Accessories</div>
                    <div className="text-muted-foreground">14% in stock</div>
                </div>
                <Progress value={14} className="bg-red-100 [&>div]:bg-red-600" />
                </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Hats</div>
                    <div className="text-muted-foreground">50% in stock</div>
                </div>
                <Progress value={50} />
                </div>
            </div>
            </CardContent>
            <CardFooter>
            <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
            </Button>
            </CardFooter>
        </Card>
        </div>
    )
}
