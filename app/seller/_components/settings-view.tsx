"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCurrentUser } from "@/hooks/use-current-user";
import { sellerSettings } from "@/actions/settings";
import { toast } from 'react-hot-toast';
import axios from "axios";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { ImageIcon, Trash } from "lucide-react";

interface Store {
    Id: string;
    Name: string;
    Description: string;
    StoreCategoryId: string | null;
    ImageUrl: string;
    UserId: string;
    CreatedAt: string;
    UpdatedAt: string;
    Status: string;
    StoreCategory?: {
        Id: string;
        Name: string;
    };
}

interface StoreCategory {
    Id: string;
    Name: string;
    Description: string | null;
}

interface SettingsProps {
    storeId: string;
}

export default function SettingsView({ storeId }: SettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [store, setStore] = useState<Store | null>(null);
    const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const user = useCurrentUser();
    const nameRef = useRef<HTMLInputElement>(null);
    const storeNameRef = useRef<HTMLInputElement>(null);
    const storeDescriptionRef = useRef<HTMLTextAreaElement>(null);

    // Fetch store data when component mounts
    useEffect(() => {
        if (storeId) {
            fetchStore();
            fetchStoreCategories();
        }
    }, [storeId]);

    // Set initial values after store data is loaded
    useEffect(() => {
        if (store) {
            setSelectedCategory(store.StoreCategoryId || "");
            setImageUrl(store.ImageUrl || "");
        }
    }, [store]);

    const fetchStore = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`/api/shops/${storeId}`);
            if (response.data) {
                setStore(response.data);
                console.log("Store data fetched:", response.data);
            } else {
                setError("No store data found.");
                toast.error("No store data found.");
            }
        } catch (err) {
            setError("Failed to fetch store data.");
            toast.error("Failed to fetch store data.");
            console.error("Error fetching store:", err);
        }
        setIsLoading(false);
    };

    const fetchStoreCategories = async () => {
        try {
            const response = await axios.get('/api/admin/store-categories');
            if (response.data) {
                setStoreCategories(response.data);
            }
        } catch (err) {
            console.error("Error fetching store categories:", err);
        }
    };

    const handleProfileSave = async () => {
        if (!user) return;
        
        try {
            setIsLoading(true);
            
            const name = nameRef.current?.value;
            
            if (!name || name === user.name) {
                toast.error("Please enter a new name");
                setIsLoading(false);
                return;
            }
            
            const response = await sellerSettings({ name });
            
            if (response.error) {
                toast.error(response.error);
                return;
            }
            
            toast.success(response.success || "Your profile has been updated");
            
        } catch (error) {
            toast.error("Something went wrong, please try again later");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStoreSave = async () => {
        if (!store) return;
        
        try {
            setIsLoading(true);
            
            const storeName = storeNameRef.current?.value;
            const storeDescription = storeDescriptionRef.current?.value;
            
            if (!storeName || !storeDescription) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }
            
            // Update store data
            const response = await axios.patch(`/api/shops/${storeId}`, {
                Name: storeName,
                Description: storeDescription,
                StoreCategoryId: selectedCategory || undefined,
                ImageUrl: imageUrl
            });
            
            if (response.data) {
                setStore(response.data);
                toast.success("Store information updated successfully");
            }
            
        } catch (error) {
            toast.error("Failed to update store information");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadComplete = (result: any) => {
        setImageUrl(result?.info?.secure_url);
        toast.success("Image uploaded successfully");
    };

    const handleRemoveImage = () => {
        setImageUrl("");
    };

    return (
        <div className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
                <Card>
                    <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                            id="name" 
                            ref={nameRef}
                            defaultValue={user?.name || ""} 
                            placeholder="Your name" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            defaultValue={user?.email || ""} 
                            placeholder="Your email address"
                            disabled 
                        />
                        {user?.email && user.emailVerified === null && (
                            <p className="text-sm text-destructive">Your email is not verified</p>
                        )}
                    </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                    <Button onClick={handleProfileSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                        Cancel
                    </Button>
                    <Button>Update Password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="store" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {error && <p className="text-sm text-destructive">{error}</p>}
                {isLoading && <p className="text-sm">Loading store data...</p>}
                <div className="space-y-2">
                    <Label htmlFor="store-name">Store name</Label>
                    <Input 
                        id="store-name" 
                        ref={storeNameRef}
                        defaultValue={store?.Name || ""} 
                        placeholder="Store name" 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="store-description">Store description</Label>
                    <Textarea
                        id="store-description"
                        ref={storeDescriptionRef}
                        placeholder="Describe your store"
                        defaultValue={store?.Description || ""}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="store-category">Primary category</Label>
                    <Select 
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                    <SelectTrigger id="store-category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {storeCategories.map((category) => (
                            <SelectItem key={category.Id} value={category.Id}>
                                {category.Name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                        {store?.StoreCategory ? `Current: ${store.StoreCategory.Name}` : 'No category selected'}
                    </p>
                </div>
                <div className="space-y-2">
                    <Label>Store image</Label>
                    <div className="flex items-center gap-4 mt-2">
                        {imageUrl ? (
                            <div className="relative w-40 aspect-square">
                                <Image 
                                    src={imageUrl}
                                    alt="Store image" 
                                    fill
                                    className="object-cover rounded-md"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full hover:bg-red-600 transition"
                                    type="button"
                                    title="Remove Image"
                                >
                                    <Trash className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-40 aspect-square flex items-center justify-center bg-gray-100 rounded-md">
                                <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                        )}
                        <div>
                            <CldUploadButton
                                options={{ maxFiles: 1 }}
                                onUpload={handleUploadComplete}
                                uploadPreset="ni1jajod"
                            >
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={isLoading}
                                >
                                    {imageUrl ? "Change Image" : "Upload Image"}
                                </Button>
                            </CldUploadButton>
                            <p className="text-xs text-muted-foreground mt-2">
                                Recommended: 800x800 pixels, square format
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="store-status">Store Status</Label>
                    <Input 
                        id="store-status" 
                        value={store?.Status || ""}
                        disabled
                    />
                </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <Button onClick={handleStoreSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Configure your store settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label htmlFor="vacation-mode">Vacation mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable your store</p>
                    </div>
                    <Switch id="vacation-mode" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label htmlFor="featured-products">Featured products</Label>
                    <p className="text-sm text-muted-foreground">Show featured products on your store homepage</p>
                    </div>
                    <Switch id="featured-products" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label htmlFor="customer-reviews">Customer reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to leave reviews on your products</p>
                    </div>
                    <Switch id="customer-reviews" defaultChecked />
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your billing details and subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium">Premium Seller Plan</p>
                        <p className="text-sm text-muted-foreground">$29.99/month</p>
                        <p className="mt-2 text-sm">Next billing date: May 15, 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                        Change Plan
                    </Button>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium">Payment Method</p>
                        <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                        <p className="mt-2 text-sm">Expires 12/2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                        Update
                    </Button>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your recent billing history</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                        <p className="font-medium">Premium Seller Plan</p>
                        <p className="text-sm text-muted-foreground">{new Date(2023, 3 - i, 15).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                        <p className="font-medium">$29.99</p>
                        <p className="text-sm text-emerald-500">Paid</p>
                        </div>
                    </div>
                    ))}
                </div>
                </CardContent>
                <CardFooter>
                <Button variant="outline" className="w-full">
                    View All Transactions
                </Button>
                </CardFooter>
            </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label htmlFor="new-order">New order</Label>
                        <p className="text-sm text-muted-foreground">Receive an email when you get a new order</p>
                        </div>
                        <Switch id="new-order" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label htmlFor="order-shipped">Order shipped</Label>
                        <p className="text-sm text-muted-foreground">Receive an email when an order is shipped</p>
                        </div>
                        <Switch id="order-shipped" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label htmlFor="customer-message">Customer message</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive an email when a customer sends you a message
                        </p>
                        </div>
                        <Switch id="customer-message" defaultChecked />
                    </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>
                    <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label htmlFor="push-new-order">New order</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive a push notification when you get a new order
                        </p>
                        </div>
                        <Switch id="push-new-order" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label htmlFor="push-order-shipped">Order shipped</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive a push notification when an order is shipped
                        </p>
                        </div>
                        <Switch id="push-order-shipped" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label htmlFor="push-customer-message">Customer message</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive a push notification when a customer sends you a message
                        </p>
                        </div>
                        <Switch id="push-customer-message" defaultChecked />
                    </div>
                    </div>
                </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
                </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}
