"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type BillboardColumn = {
    id: string
    Label: string
    CreatedAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: 'Label',
        header: 'Label',
    },
    {
        accessorKey: 'CreatedAt',
        header: 'Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
        header: 'Actions',
    }
]