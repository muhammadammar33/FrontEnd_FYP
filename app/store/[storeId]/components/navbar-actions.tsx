"use client"
import { Button } from '@/components/ui/button';
import useCart from '@/hooks/use-cart';
import { ShoppingBag, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavbarActionsProps {
    storeId: string;
}

const NavbarActions = ({ storeId }: NavbarActionsProps) => {

    const cart = useCart();
    const router = useRouter();

    return (
        <div className="flex items-center ml-auto gap-x-4">
            <Button 
                className='flex items-center px-4 py-2 bg-black rounded-full'
                onClick={() => router.push(`/buyer/chat`)}
            >
                <MessageSquare size={20} color='white' />
            </Button>
            <Link
                href = {`/store/${storeId}/cart`}
                // You can remove this if you want a normal cursor:
                className="group cursor-pointer"
            >
                <Button className='flex items-center px-4 py-2 bg-black rounded-full'>
                    <ShoppingBag size={20} color='white' />
                    <span className='ml-2 text-sm font-medium text-white'>
                        {cart?.items?.length}
                    </span>
                </Button>
            </Link>
        </div>
    )
}

export default NavbarActions;