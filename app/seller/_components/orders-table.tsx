"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useParams } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"

export type OrderColumn = {
    id: string
    userId: string
    phone: string
    address: string
    isPaid: boolean
    totalPrice: string
    products: string
    createdAt: string
}

interface OrdersTableProps {
    orders: OrderColumn[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    const {data:session} = useSession();
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();
    const params = useParams();

    const filteredOrders = orders.filter(
        (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusVariant = (isPaid: boolean) => {
        switch (isPaid) {
            case true:
                return "default";
            case false:
                return "destructive";
            default:
                return "default";
        }
    }

    const handleChatWithBuyer = async (userId: string) => {
        try {
            if (!session?.user.id) {
                toast.error("You must be logged in to chat");
                return;
            }

            const currentUserId = session.user.id as string;
            
            if (userId === currentUserId) {
                toast.error("You cannot create a conversation with yourself");
                return;
            }

            const userIds = [userId, currentUserId];
            console.log("User IDs:", userIds);
            
            const response = await axios.post(`/api/conversations`, { userIds });
            console.log("Response:", response);
            
            if (response.data.success) {
                toast.success(response.data.message);
                // Optionally navigate to the conversation
                // router.push(`/conversations/${response.data.data.id}`);
            }
        } catch (error) {
            console.error("Error creating conversation:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(`Error: ${error.response.data.message || "Failed to create conversation"}`);
            } else {
                toast.error("Error creating conversation");
            }
        }
    }

    return (
        <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Orders ({orders.length})</h2>
            <p className="text-muted-foreground">Manage and process customer orders</p>
            </div>
            <Button>
            <Plus className="mr-2 h-4 w-4" />
                Add Order
            </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div className="flex gap-2">
            <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <span>Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Date Range</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Total Amount</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <span>Clear Filters</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="newest">
                <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="total-asc">Total: Low to High</SelectItem>
                <SelectItem value="total-desc">Total: High to Low</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>
                    <div className="flex items-center">
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                    </TableHead>
                    <TableHead>
                    <div className="flex items-center">
                        Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Chat</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredOrders.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No orders found.
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredOrders.map((order) => {
                        const onDelete = async () => {
                            try {
                                setLoading(true);
                                await axios.delete(`/api/${params.storeId}/orders/${order.id}`)
                                router.refresh();
                                toast.success("Order deleted successfully.")
                            } catch {
                                toast.error('Error deleting order');
                            } finally {
                                setLoading(false);
                                setOpen(false);
                                setDeletingId(null);
                            }
                        }
                        return (
                        <>
                            <AlertModal 
                                isOpen={open && deletingId === order.id}
                                onClose={() => {
                                    setOpen(false);
                                    setDeletingId(null);
                                }}
                                onConfirm={onDelete}
                                loading={loading}
                            />
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell className="font-medium">{order.userId}</TableCell>
                                <TableCell>
                                <div>{order.createdAt}</div>
                                <div className="text-xs text-muted-foreground">{order.address}</div>
                                </TableCell>
                                <TableCell>{order.totalPrice}</TableCell>
                                <TableCell>
                                <Badge variant={getStatusVariant(order.isPaid) as any}>
                                    {order.isPaid ? "Paid" : "UnPaid"}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                <Button variant="link" size="sm" onClick={() => {handleChatWithBuyer(order.userId)}}>
                                    Chat with Buyer
                                </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                        const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
                                        router.push(`/seller/${storeId}/orders/${order.id}`);
                                    }}>
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                    <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                        setDeletingId(order.id);
                                        setOpen(true);
                                    }} className="text-destructive">
                                        Cancel Order
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </>
                        );
                    })
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
            </div>
            <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled={filteredOrders.length === 0}>
                Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredOrders.length === 0}>
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}
