"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';

export type ProductColumn = {
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

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => {
            return (
            <div className="flex items-center gap-x-2">
                <div
                    className="w-16 h-16 border rounded-full"
                    style={{
                        backgroundImage: `url(${row.original.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'isArchived',
        header: 'Archived',
    },
    {
        accessorKey: 'isFeatured',
        header: 'Featured',
    },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => (
            <div className='flex items-center gap-x-2'>
                {row.original.color}
                <div className='w-6 h-6 border rounded-full' style={{ backgroundColor: row.original.color }} />
            </div>
        )
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]