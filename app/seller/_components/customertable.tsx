"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

interface PurchasedProduct {
    name: string;
    price: number;
}

interface CustomerColumn {
    id: string;
    name: string | null;
    email: string | null;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    lastPurchase: Date;
    purchasedProducts: PurchasedProduct[];
}

interface CustomersTableProps {
    customers: CustomerColumn[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

    const filteredCustomers = customers.filter((customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Last Purchase</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.name || "N/A"}</TableCell>
                                <TableCell>{customer.email || "N/A"}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {customer.address}
                                </TableCell>
                                <TableCell>{customer.totalOrders}</TableCell>
                                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                                <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                            </TableRow>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}