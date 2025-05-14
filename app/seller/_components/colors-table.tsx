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

type ColorColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

interface ColorsTableProps {
    colors: ColorColumn[]
}

export default function ColorsTable({ colors }: ColorsTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const router = useRouter()
    const params = useParams()

    const filteredColors = colors.filter(
        (color) =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.value.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const onDelete = async (id: string) => {
        try {
        setLoading(true)
        await axios.delete(`/api/${params.storeId}/colors/${id}`)
        router.refresh()
        toast.success("Color deleted successfully.")
        } catch {
        toast.error("Error deleting color. Make sure all products using this color are removed first.")
        } finally {
        setLoading(false)
        setOpen(false)
        setDeletingId(null)
        }
    }

    return (
        <div className="space-y-4">
        <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={() => deletingId && onDelete(deletingId)}
            loading={loading}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h2 className="text-2xl font-bold tracking-tight">Colors ({colors.length})</h2>
            <p className="text-muted-foreground">Manage your product color options</p>
            </div>
            <Button onClick={() => router.push(`/seller/${params.storeId}/colors/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Color
            </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search colors..."
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
                    <span>Date Created</span>
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
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
                <SelectItem value="products-desc">Most Products</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Color</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Hex Value</TableHead>
                    <TableHead>
                    <div className="flex items-center">
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredColors.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No colors found.
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredColors.map((color) => (
                    <TableRow key={color.id}>
                        <TableCell>
                        <div
                            className="h-10 w-10 rounded-full border"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                        </TableCell>
                        <TableCell>
                        <div className="font-medium">{color.name}</div>
                        <div className="text-xs text-muted-foreground">{color.id}</div>
                        </TableCell>
                        <TableCell>
                        <code className="rounded bg-muted px-2 py-1">{color.value}</code>
                        </TableCell>
                        <TableCell>{color.createdAt}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId
                                router.push(`/seller/${storeId}/colors/${color.id}`)
                                }}
                            >
                                Edit Color
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId
                                router.push(`/seller/${storeId}?tab=products`)
                                }}
                            >
                                View Products
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                setDeletingId(color.id)
                                setOpen(true)
                                }}
                                className="text-destructive"
                            >
                                Delete Color
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredColors.length}</strong> of <strong>{colors.length}</strong> colors
            </div>
            <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled={filteredColors.length === 0}>
                Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredColors.length === 0}>
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}
