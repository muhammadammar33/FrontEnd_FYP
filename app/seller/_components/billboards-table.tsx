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
import Image from "next/image"

type BillboardColumn = {
    id: string
    Label: string
    imageUrl?: string
    CreatedAt: string
}

interface BillboardsTableProps {
    billboards: BillboardColumn[]
}

export default function BillboardsTable({ billboards }: BillboardsTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const router = useRouter()
    const params = useParams()

    const filteredBillboards = billboards.filter(
        (billboard) =>
        billboard.Label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        billboard.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const onDelete = async (id: string) => {
        try {
        setLoading(true)
        await axios.delete(`/api/${params.storeId}/billboards/${id}`)
        router.refresh()
        toast.success("Billboard deleted successfully.")
        } catch {
        toast.error("Error deleting billboard. Make sure all categories using this billboard are removed first.")
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
            <h2 className="text-2xl font-bold tracking-tight">Billboards ({billboards.length})</h2>
            <p className="text-muted-foreground">Manage your store&#39;s promotional banners</p>
            </div>
            <Button onClick={() => router.push(`/seller/${params.storeId}/billboards/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Billboard
            </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search billboards..."
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
                <SelectItem value="label-asc">Label: A-Z</SelectItem>
                <SelectItem value="label-desc">Label: Z-A</SelectItem>
                <SelectItem value="categories-desc">Most Categories</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Image</TableHead>
                    <TableHead>Label</TableHead>
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
                {filteredBillboards.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No billboards found.
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredBillboards.map((billboard) => (
                    <TableRow key={billboard.id}>
                        <TableCell>
                        <div className="relative h-16 w-32 overflow-hidden rounded-md border">
                            <Image
                            src={billboard.imageUrl || "/placeholder.svg?height=64&width=128"}
                            alt={billboard.Label}
                            fill
                            className="object-cover"
                            />
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="font-medium">{billboard.Label}</div>
                        <div className="text-xs text-muted-foreground">{billboard.id}</div>
                        </TableCell>
                        <TableCell>{billboard.CreatedAt}</TableCell>
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
                                router.push(`/seller/${storeId}/billboards/${billboard.id}`)
                                }}
                            >
                                Edit Billboard
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId
                                router.push(`/seller/${storeId}/categories?billboard=${billboard.id}`)
                                }}
                            >
                                View Categories
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                setDeletingId(billboard.id)
                                setOpen(true)
                                }}
                                className="text-destructive"
                            >
                                Delete Billboard
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
            Showing <strong>{filteredBillboards.length}</strong> of <strong>{billboards.length}</strong> billboards
            </div>
            <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled={filteredBillboards.length === 0}>
                Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredBillboards.length === 0}>
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}
