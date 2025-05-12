"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsView() {
    return (
        <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">View detailed insights about your store performance</p>
            </div>
            <div className="flex items-center gap-2">
            <Select defaultValue="30days">
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
            </div>
        </div>

        <Tabs defaultValue="sales">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">$12,546.89</div>
                    <p className="text-xs text-emerald-500">+12.3% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Average Order Value</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">$78.42</div>
                    <p className="text-xs text-emerald-500">+5.1% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">3.2%</div>
                    <p className="text-xs text-red-500">-0.4% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
                <CardDescription>Daily revenue for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[350px] w-full rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Sales chart will appear here</p>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Total Visitors</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">24,521</div>
                    <p className="text-xs text-emerald-500">+18.2% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Unique Visitors</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">18,432</div>
                    <p className="text-xs text-emerald-500">+14.5% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Bounce Rate</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">42.8%</div>
                    <p className="text-xs text-emerald-500">-3.1% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[350px] w-full rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Traffic sources chart will appear here</p>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with the highest sales volume</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[350px] w-full rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Top products chart will appear here</p>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Sales and views by product category</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[350px] w-full rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Product performance chart will appear here</p>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>New Customers</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">432</div>
                    <p className="text-xs text-emerald-500">+8.7% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Returning Customers</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">65.3%</div>
                    <p className="text-xs text-emerald-500">+2.1% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Customer Lifetime Value</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">$245.80</div>
                    <p className="text-xs text-emerald-500">+4.3% from previous period</p>
                    <div className="mt-4 h-[120px] w-full rounded-lg bg-muted/20"></div>
                </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Age, location, and device breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[350px] w-full rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Demographics chart will appear here</p>
                </div>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}
