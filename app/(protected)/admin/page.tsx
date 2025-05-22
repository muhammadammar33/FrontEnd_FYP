import { getTotalGraphRevenue } from "@/actions/get-graph-revenue";
import { getTotalSalesCount } from "@/actions/get-sales-count";
import { getTotalStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalProductsCount } from "@/actions/get-total-products";
import { getSellers, getBuyers } from "@/actions/get-users";
import { Overview } from "@/components/ui/overview";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {db} from "@/lib/db"
import { formatter } from "@/lib/utils";
import { CreditCard, Banknote, Package, View, Store, UserCircle, Users, TrendingUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const DashboardPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    // const store = await db.stores.findFirst({
    //     where: { Id: storeId }
    // });

    const totalRevenue = await getTotalRevenue();
    const salesCount = await getTotalSalesCount();
    const stockCount = await getTotalStockCount();
    const productCount = await getTotalProductsCount();
    const graphRevenue = await getTotalGraphRevenue();
    const sellersCount = await getSellers();
    const buyersCount = await getBuyers();

    return (
        <div className="flex-col">
            <div className="flex-1 p-6 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Heading title="Admin Dashboard" description="Welcome back! Here's an overview of le'Elysian" />
                    </div>
                    <div className="flex gap-3">
                        {/* <Link href="/admin/settings">
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                        </Link> */}
                        <Link href="/admin/store-categories">
                            <Button size="sm">
                                <Store className="h-4 w-4 mr-2" />
                                Manage Store Categories
                            </Button>
                        </Link>
                    </div>
                </div>
                <Separator />
                
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="sales">Sales</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatsCard 
                                title="Total Revenue"
                                value={formatter.format(totalRevenue)}
                                description="All time platform revenue"
                                icon={<Banknote className="w-4 h-4" />}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                            />
                            <StatsCard 
                                title="Sales Count"
                                value={`${salesCount}`}
                                description="Completed orders"
                                icon={<CreditCard className="w-4 h-4" />}
                                className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                            />
                            <StatsCard 
                                title="Products Available"
                                value={`${productCount}`}
                                description={`${stockCount} unique product types`}
                                icon={<Package className="w-4 h-4" />}
                                className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                            />
                            <StatsCard 
                                title="Total Users"
                                value={`${sellersCount + buyersCount}`}
                                description={`${sellersCount} sellers, ${buyersCount} buyers`}
                                icon={<Users className="w-4 h-4" />}
                                className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                            />
                        </div>
                        
                        <Card className="bg-white shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <div>
                                    <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
                                    <CardDescription>Monthly sales performance</CardDescription>
                                </div>
                                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Overview data={graphRevenue} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="users" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-blue-600" />
                                        Sellers
                                    </CardTitle>
                                    <CardDescription>Total registered sellers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-blue-700">{sellersCount}</div>
                                    {/* <div className="text-sm text-muted-foreground mt-2">
                                        <Link href="/admin/sellers" className="text-blue-600 hover:underline">
                                            View all sellers →
                                        </Link>
                                    </div> */}
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCircle className="h-5 w-5 text-purple-600" />
                                        Buyers
                                    </CardTitle>
                                    <CardDescription>Total registered buyers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-purple-700">{buyersCount}</div>
                                    {/* <div className="text-sm text-muted-foreground mt-2">
                                        <Link href="/admin/buyers" className="text-purple-600 hover:underline">
                                            View all buyers →
                                        </Link>
                                    </div> */}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="sales" className="space-y-6">
                        <Card className="bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>Sales Analytics</CardTitle>
                                <CardDescription>Detailed breakdown of platform sales</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-sm font-medium">Total Revenue</span>
                                        <span className="text-2xl font-bold">{formatter.format(totalRevenue)}</span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-sm font-medium">Total Orders</span>
                                        <span className="text-2xl font-bold">{salesCount}</span>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-end">
                                    <Link href="/admin/sales">
                                        <Button variant="outline" size="sm">View Detailed Reports</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

type StatsCardProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
    trend?: number;
    className?: string;
}

const StatsCard = ({ title, value, icon, description, trend, className }: StatsCardProps) => {
    return (
        <Card className={cn("shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div className="p-1 rounded-md bg-white/60 shadow-sm">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                    {trend && (
                        <div className={cn(
                            "text-xs font-medium flex items-center",
                            trend > 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default DashboardPage