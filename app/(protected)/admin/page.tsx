import { getTotalGraphRevenue } from "@/actions/get-graph-revenue";
import { getTotalSalesCount } from "@/actions/get-sales-count";
import { getTotalStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalProductsCount } from "@/actions/get-total-products";
import { getSellers, getBuyers } from "@/actions/get-users";
import { Overview } from "@/components/ui/overview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {db} from "@/lib/db"
import { formatter } from "@/lib/utils";
import { CreditCard, Banknote, Package, View } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import PreviewStore from "@/app/seller/_components/preview-store";

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
        <div className="flex-1 p-8 pt-6 space-y-4">
            <div className="flex items-center justify-between">
                <Heading title="Dashboard" description="Overview of your le'Elysian" />
                <div className="flex gap-2">
                    <Link href="/admin/store-categories">
                        <Button>Manage Store Categories</Button>
                    </Link>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    Total Sellers
                </CardTitle>
                <Banknote className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {sellersCount}
                </div>
                </CardContent>
            </Card>
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    Total Buyers
                </CardTitle>
                <Banknote className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {buyersCount}
                </div>
                </CardContent>
            </Card>
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <Banknote className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {formatter.format(totalRevenue)}
                </div>
                </CardContent>
            </Card>
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    Sales
                </CardTitle>
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    +{salesCount}
                </div>
                </CardContent>
            </Card>
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Products in Stock
                    </CardTitle>
                    <Package className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {productCount} Products of {stockCount} types
                </div>
                </CardContent>
            </Card>
            </div>
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Overview</CardTitle>
                    <View className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Overview data={graphRevenue} />
                </CardContent>
            </Card>
        </div>
        </div>
    )
}

export default DashboardPage