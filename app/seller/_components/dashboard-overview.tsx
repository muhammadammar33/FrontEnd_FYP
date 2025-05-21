"use client"

import { ArrowRightIcon, ArrowUpIcon, CreditCard, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Overview } from "@/components/ui/overview";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DashboardOverviewProps {
    storeId: string;
}

export default function DashboardOverview( { storeId }: DashboardOverviewProps ) {
    const [revenue, setRevenue] = useState<number | null>(null);
    const [salesCount, setSalesCount] = useState<number | null>(null);
    const [stockCount, setStockCount] = useState<number | null>(null);
    const [productCount, setProductCount] = useState<number | null>(null);
    const [graphRevenue, setGraphRevenue] = useState<any[] | null>(null);
    const [buyerCount, setBuyerCount] = useState<any[] | null>(null);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [recentSales, setRecentSales] = useState<any[]>([]);
    const [loadingRecentSales, setLoadingRecentSales] = useState(false);
    const [inventoryStatus, setInventoryStatus] = useState<any[]>([]);
    const [loadingInventory, setLoadingInventory] = useState(false);
    const [viewAll, setViewAll] = useState(false); // State to track "View All" mode

    const fetchInventoryStatus = async () => {
        setLoadingInventory(true);
        try {
        const response = await fetch(`/api/${storeId}/dashboard/inventory`);
        const data = await response.json();
        setInventoryStatus(data.inventoryStatus || []);
        } catch (error) {
        console.error("Error fetching inventory status:", error);
        } finally {
        setLoadingInventory(false);
        }
    };

    useEffect(() => {
        fetchInventoryStatus();
    }, [storeId]);

    const fetchRecentSales = async (fetchAll = false) => {
        // console.log(`fetchRecentSales invoked with storeId: ${storeId}`); // Debugging log
        setLoadingRecentSales(true);
        try {
        const response = await fetch(`/api/${storeId}/dashboard/recentsales${fetchAll ? "?fetchAll=true" : ""}`);
        const data = await response.json();
        setRecentSales(data.recentSales || []);
        } catch (error) {
        console.error("Error fetching recent sales:", error);
        } finally {
        setLoadingRecentSales(false);
        }
    };

    useEffect(() => {
        fetchRecentSales();
    }, [storeId]);

    const fetchSalesData = async (period: string) => {
        setLoading(true);
        try {
        const response = await fetch(`/api/${storeId}/dashboard/sales?period=${period}`);
        const data = await response.json();
        setSalesData(data.salesData || []);
        setTotalSales(data.totalSales || 0);
        } catch (error) {
        console.error("Error fetching sales data:", error);
        } finally {
        setLoading(false);
        }
    };
        useEffect(() => {
        fetchSalesData("weekly"); // Default to weekly sales on initial load
    }, [storeId]);


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

    // Fetch buyer count
  useEffect(() => {
    fetch(`/api/${storeId}/dashboard/buyer-count`)
      .then((res) => res.json())
      .then((data) => {
        setBuyerCount(data.buyerCount);
      })
      .catch((error) => console.error("Error fetching buyer count:", error));
  }, [storeId]);

  // Function to download the report as a PDF    
        const downloadPDF = () => {
        const doc = new jsPDF();

        doc.text("Sales Report", 14, 16);

        autoTable(doc, {
            startY: 20,
            head: [["Order ID", "Order Date", "Product Name"]],
            body: salesData.map((sale) => [
                sale.Id,
                new Date(sale.CreatedAt).toLocaleDateString(),
                sale.OrderItem?.[0]?.Products?.Name || "N/A",
            ]),
        });

        doc.save("sales-report.pdf");
    };
// Function to handle view all
    const handleViewAllClick = () => {
        setViewAll(true); // Set "View All" mode
        fetchRecentSales(true); // Fetch all sales
    };

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
            {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+20.1%</span>
                <span>from last month</span>
            </div> */}
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
            {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+12.2%</span>
                <span>from last month</span>
            </div> */}
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
            {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+8 new</span>
                <span>from last month</span>
            </div> */}
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {buyerCount !== null ? (
              buyerCount
            ) : (
              <div className="flex items-center space-x-2">
                <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
              </div>
            )}
          </div>              

            {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+32</span>
                <span>from last month</span>
            </div> */}
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
            <Tabs defaultValue="weekly" onValueChange={(value) => fetchSalesData(value)}>
                <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={downloadPDF}>
                    Download Report
                    </Button>
                </div>
                </div>
                <TabsContent value="daily" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                  {loading ? (
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading daily sales...</p>
                    </div>
                ) : (
                    <div>
                            <p className="text-lg font-bold mb-4">Total Sales: ${totalSales.toFixed(2)}</p>
                            <div className="overflow-auto">
                            <table id="sales-table" className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Product Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salesData.map((sale) => {
                                    const saleDate = new Date(sale.CreatedAt); // Parse the createdAt field
                                    return (
                                    <tr key={sale.Id}>
                                        <td className="border border-gray-300 px-4 py-2">{sale.Id}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {isNaN(saleDate.getTime()) ? "Invalid Date" : saleDate.toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {sale.OrderItem?.[0]?.Products?.Name || "N/A"}
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            </div>
                        </div>
                  )}
                    </div>
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                    {loading ? (
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading weekly sales...</p>
                    </div>
                    ) : (
                    <div>
                            <p className="text-lg font-bold mb-4">Total Sales: ${totalSales.toFixed(2)}</p>
                            <div className="overflow-auto">
                            <table id="sales-table" className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Product Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salesData.map((sale) => {
                                    const saleDate = new Date(sale.CreatedAt); // Parse the createdAt field
                                    return (
                                    <tr key={sale.Id}>
                                        <td className="border border-gray-300 px-4 py-2">{sale.Id}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {isNaN(saleDate.getTime()) ? "Invalid Date" : saleDate.toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {sale.OrderItem?.[0]?.Products?.Name || "N/A"}
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}
                    </div>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6">
                {loading ? (
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading monthly sales...</p>
                    </div>
                    ) : (
                        <div>
                            <p className="text-lg font-bold mb-4">Total Sales: ${totalSales.toFixed(2)}</p>
                            <div className="overflow-auto">
                            <table id="sales-table" className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Product Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salesData.map((sale) => {
                                    const saleDate = new Date(sale.CreatedAt); // Parse the createdAt field
                                    return (
                                    <tr key={sale.Id}>
                                        <td className="border border-gray-300 px-4 py-2">{sale.Id}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {isNaN(saleDate.getTime()) ? "Invalid Date" : saleDate.toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {sale.OrderItem?.[0]?.Products?.Name || "N/A"}
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}
                    </div>
                </TabsContent>

                <TabsContent value="yearly" className="space-y-4">
                    <div className="h-[300px] w-full rounded-lg border bg-muted/20 p-6 overflow-auto">
                        {loading ? (
                        <div className="flex h-full flex-col items-center justify-center">
                            <p className="text-sm text-muted-foreground">Loading yearly sales...</p>
                        </div>
                        ) : (
                        <div>
                            <p className="text-lg font-bold mb-4">Total Sales: ${totalSales.toFixed(2)}</p>
                            <div className="overflow-auto">
                            <table id="sales-table" className="w-full border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order ID</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Order Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-black">Product Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salesData.map((sale) => {
                                    const saleDate = new Date(sale.CreatedAt); // Parse the createdAt field
                                    return (
                                    <tr key={sale.Id}>
                                        <td className="border border-gray-300 px-4 py-2">{sale.Id}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {isNaN(saleDate.getTime()) ? "Invalid Date" : saleDate.toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                        {sale.OrderItem?.[0]?.Products?.Name || "N/A"}
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>

        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                {viewAll
                    ? `You have ${recentSales.length} total sales`
                    : `You made ${recentSales.length} sales recently`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                {loadingRecentSales ? (
                    <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading sales...</p>
                    </div>
                ) : recentSales.length > 0 ? (
                    recentSales.map((sale) => (
                    <div key={sale.Id} className="flex items-center">
                        <div className="mr-4 rounded-full bg-muted p-2">
                        <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {sale.user?.name || "Unknown Customer"}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                            {new Date(sale.CreatedAt).toLocaleDateString()}
                        </p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No sales available</p>
                )}
                </div>
            </CardContent>
            <CardFooter>
                {!viewAll && ( // Show the button only if not in "View All" mode
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleViewAllClick}
                >
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    View All
                </Button>
                )}
            </CardFooter>
            </Card>
            
        {/* Inventory Card */}
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Monitor your inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {loadingInventory ? (
                <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading inventory...</p>
                </div>
                ) : inventoryStatus.length > 0 ? (
                inventoryStatus.map((item, index) => (
                    <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">{item.categoryName}</div>
                        <div className="text-muted-foreground">
                        {item.stock > 0 && productCount !== null
                            ? `${Math.min((item.stock / productCount) * 100).toFixed(0)}% in stock`
                            : "Out of stock"}
                        </div>
                    </div>
                    <Progress
                        value={
                                item.stock > 0 && productCount !== null
                                    ? Math.min((item.stock / productCount) * 100)
                                    : 0
                            }
                        className={
                        item.stock > 50
                            ? "bg-green-100 [&>div]:bg-green-600"
                            : item.stock > 20
                            ? "bg-amber-100 [&>div]:bg-amber-600"
                            : "bg-red-100 [&>div]:bg-red-600"
                        }
                    />
                    </div>
                ))
                ) : (
                <p className="text-sm text-muted-foreground">No inventory data available</p>
                )}
            </div>
            {/* Display the product count */}
        <div className="mt-4 text-sm text-muted-foreground">
            Total Products: <span className="font-bold">{productCount !== null ? productCount : "Loading..."}</span>
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
