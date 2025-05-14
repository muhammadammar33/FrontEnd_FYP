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

// const demoOrders = [
//   {
//     id: "ORD-7652",
//     customer: "John Smith",
//     email: "john.smith@example.com",
//     date: "2023-04-12",
//     total: 129.95,
//     status: "Delivered",
//     items: 3,
//   },
//   {
//     id: "ORD-7653",
//     customer: "Sarah Johnson",
//     email: "sarah.j@example.com",
//     date: "2023-04-12",
//     total: 49.99,
//     status: "Processing",
//     items: 1,
//   },
//   {
//     id: "ORD-7654",
//     customer: "Michael Brown",
//     email: "michael.b@example.com",
//     date: "2023-04-11",
//     total: 89.97,
//     status: "Shipped",
//     items: 2,
//   },
//   {
//     id: "ORD-7655",
//     customer: "Emily Davis",
//     email: "emily.d@example.com",
//     date: "2023-04-11",
//     total: 149.98,
//     status: "Processing",
//     items: 4,
//   },
//   {
//     id: "ORD-7656",
//     customer: "Robert Wilson",
//     email: "robert.w@example.com",
//     date: "2023-04-10",
//     total: 29.99,
//     status: "Delivered",
//     items: 1,
//   },
//   {
//     id: "ORD-7657",
//     customer: "Jennifer Taylor",
//     email: "jennifer.t@example.com",
//     date: "2023-04-10",
//     total: 199.95,
//     status: "Cancelled",
//     items: 2,
//   },
//   {
//     id: "ORD-7658",
//     customer: "David Miller",
//     email: "david.m@example.com",
//     date: "2023-04-09",
//     total: 79.98,
//     status: "Delivered",
//     items: 2,
//   },
// ]

export default function OrdersTable({ orders }: OrdersTableProps) {
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
                                <div>{order.phone}</div>
                                <div className="text-xs text-muted-foreground">{order.address}</div>
                                </TableCell>
                                <TableCell>{order.totalPrice}</TableCell>
                                <TableCell>
                                <Badge variant={getStatusVariant(order.isPaid) as any}>
                                    {order.isPaid ? "Paid" : "UnPaid"}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                <Button variant="link" size="sm" onClick={() => {}}>
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
