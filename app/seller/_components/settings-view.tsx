"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SettingsView() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
        setIsLoading(false)
        }, 1000)
    }

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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" defaultValue="Jane" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" defaultValue="Doe" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    defaultValue="Passionate e-commerce seller specializing in handmade crafts and sustainable products."
                    />
                </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
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
                <div className="space-y-2">
                    <Label htmlFor="store-name">Store name</Label>
                    <Input id="store-name" defaultValue="Jane's Crafts & Creations" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="store-url">Store URL</Label>
                    <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">https://marketplace.com/</span>
                    <Input id="store-url" defaultValue="janes-crafts" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="store-description">Store description</Label>
                    <Textarea
                    id="store-description"
                    placeholder="Describe your store"
                    defaultValue="Handmade crafts and sustainable products made with love and care for the environment."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="store-category">Primary category</Label>
                    <Select defaultValue="handmade">
                    <SelectTrigger id="store-category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="handmade">Handmade Crafts</SelectItem>
                        <SelectItem value="clothing">Clothing & Accessories</SelectItem>
                        <SelectItem value="home">Home & Living</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="art">Art & Collectibles</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
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
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
                </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}
