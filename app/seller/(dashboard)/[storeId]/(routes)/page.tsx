import { getStoreGraphRevenue } from "@/actions/get-graph-revenue";
import { getStoreSalesCount } from "@/actions/get-sales-count";
import { getStoreStockCount } from "@/actions/get-stock-count";
import { getStoreRevenue } from "@/actions/get-total-revenue";
import { getStoreProductsCount } from "@/actions/get-total-products";
import { Overview } from "@/components/ui/overview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {db} from "@/lib/db"
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package, View } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import PreviewStore from "@/app/seller/_components/preview-store";

const DashboardPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    // const store = await db.stores.findFirst({
    //     where: { Id: storeId }
    // });

    const totalRevenue = await getStoreRevenue(storeId);
    const salesCount = await getStoreSalesCount(storeId);
    const stockCount = await getStoreStockCount(storeId);
    const productCount = await getStoreProductsCount(storeId);
    const graphRevenue = await getStoreGraphRevenue(storeId);

    return (
        <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
            <div className="flex items-center justify-between">
                <Heading title="Dashboard" description="Overview of your store" />
                <PreviewStore storeId={(await params).storeId} />
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {formatter.format(totalRevenue)}
                </div>
                </CardContent>
            </Card>
            <Card>
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
            <Card>
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
            <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Overview data={graphRevenue} />
            </CardContent>
            </Card>
        </div>
        </div>
    )
}

export default DashboardPage