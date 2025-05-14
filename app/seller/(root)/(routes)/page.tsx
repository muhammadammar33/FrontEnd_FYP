'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Store, Box, TrendingUp, DollarSign, Users } from "lucide-react";
import axios from "axios";
import { useCurrentUser } from "@/hooks/use-current-user";

interface StoreSummary {
    count: number;
}

const SellersPage = () => {
    const [hasStores, setHasStores] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const user = useCurrentUser();
    
    useEffect(() => {
        const checkStores = async () => {
            if (!user?.id) return;
            
            try {
                setIsLoading(true);
                // Check if user has any stores
                const response = await axios.get("/api/shops/user");
                setHasStores(response.data.length > 0);
            } catch (error) {
                console.error("Failed to check stores:", error);
                setHasStores(false);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkStores();
    }, [user?.id]);

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="space-y-4 flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Welcome to Your Seller Dashboard
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your stores, track sales, and grow your business all in one place.
                        </p>
                        
                        {isLoading ? (
                            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-md"></div>
                        ) : !hasStores ? (
                            <Button 
                                size="lg" 
                                onClick={() => router.push("/seller/stores")}
                                className="mt-4 gap-2"
                            >
                                Create Your First Store <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <div className="flex gap-3 mt-4">
                                <Button 
                                    size="lg" 
                                    onClick={() => router.push("/seller/stores")}
                                >
                                    Manage Stores
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="outline"
                                    onClick={() => router.push("/seller/products")}
                                >
                                    View Products
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-shrink-0">
                        <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                            <Store className="h-24 w-24 text-primary" />
                        </div>
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Stores
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {isLoading ? "..." : hasStores ? "1+" : "0"}
                                </div>
                                <Store className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    0
                                </div>
                                <Box className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    $0
                                </div>
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Customers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    0
                                </div>
                                <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Getting Started */}
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>Follow these steps to set up your seller account</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                1
                            </div>
                            <div>
                                <h3 className="font-medium">Create your store</h3>
                                <p className="text-muted-foreground text-sm">
                                    Set up your first store with a name, description and category.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                2
                            </div>
                            <div>
                                <h3 className="font-medium">Add products</h3>
                                <p className="text-muted-foreground text-sm">
                                    Upload your products with high-quality images and detailed descriptions.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                3
                            </div>
                            <div>
                                <h3 className="font-medium">Set up payment methods</h3>
                                <p className="text-muted-foreground text-sm">
                                    Connect your bank account to receive payments from customers.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open("https://docs.elysian.com/seller", "_blank")}
                        >
                            View Seller Documentation
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SellersPage;