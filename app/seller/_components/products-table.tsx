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

type ProductColumn = {
    id: string
    name: string
    price: string
    size: string
    category: string
    color: string
    isFeatured: boolean
    isArchived: boolean
    createdAt: string
    stock: number
    imageUrl?: string
}

interface ProductsTableProps {
    products: ProductColumn[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const filteredProducts = products.filter(
        (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getStatusFromStock = (stock: number): string => {
        if (stock <= 0) return "Out of Stock";
        if (stock <= 10) return "Low Stock";
        return "In Stock";
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "In Stock":
                return "default";
            case "Low Stock":
                return "outline";
            case "Out of Stock":
                return "destructive";
            default:
                return "default";
        }
    }

    return (
        <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Products ({products.length}) </h2>
            <p className="text-muted-foreground">Manage your product inventory and listings</p>
            </div>
            <Button onClick={() => {
                    const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
                    window.location.href = `/seller/${storeId}/products/new`;
                }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
            </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search products..."
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
                    <span>Category</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Price Range</span>
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
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
                <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                    <div className="flex items-center">
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                    </TableHead>
                    <TableHead>
                    <div className="flex items-center">
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                    </TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredProducts.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No products found.
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredProducts.map((product) => {
                        const onDelete = async () => {
                            try {
                                setLoading(true);
                                await axios.delete(`/api/${params.storeId}/products/${product.id}`)
                                router.refresh();
                                toast.success("Product deleted successfully.")
                            } catch {
                                toast.error('Error deleting');
                            } finally {
                                setLoading(false);
                                setOpen(false);
                            }
                        }
                    const status = getStatusFromStock(product.stock);
                    return (
                    <>
                        <AlertModal 
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            onConfirm={onDelete}
                            loading={loading}
                        />
                    <TableRow key={product.id}>
                        <TableCell>
                        <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                        />
                        </TableCell>
                        <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.id}</div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>
                            <div className='flex items-center gap-x-2'>
                                {product.color}
                                <div className='w-6 h-6 border rounded-full' style={{ backgroundColor: product.color }} />
                            </div>
                        </TableCell>
                        <TableCell>
                        <Badge
                            variant={getStatusVariant(status) as any}
                        >
                            {status}
                        </Badge>
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
                                router.push(`/seller/${storeId}/products/${product.id}`);
                            }}>
                                Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpen(true)} className="text-destructive">
                                Delete Product
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    </>
                    )})
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
            </div>
            <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled={filteredProducts.length === 0}>
                Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredProducts.length === 0}>
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}