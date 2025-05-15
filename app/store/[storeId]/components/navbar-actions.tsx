"use client"
import { Button } from '@/components/ui/button';
import useCart from '@/hooks/use-cart';
import axios from 'axios';
import { ShoppingBag, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface NavbarActionsProps {
    storeId: string;
}

const NavbarActions = ({ storeId }: NavbarActionsProps) => {

    const cart = useCart();
    const router = useRouter();
    const { data: session } = useSession();
    const handleChatWithSeller = async (userId: string) => {
        try {
            if (!session?.user.id) {
                toast.error("You must be logged in to chat");
                return;
            }

            const response = await fetch(`/api/shops/${storeId}`);
            const sellerData = await response.json();
            console.log("Seller ID:", sellerData.UserId);

            if (userId === sellerData.UserId) {
                toast.error("You cannot create a conversation with yourself");
                return;
            }

            const userIds = [userId, sellerData.UserId];
            console.log("User IDs:", userIds);

            const conversationResponse = await axios.post(`/api/conversations`, { userIds });
            console.log("Response:", conversationResponse);

            if (conversationResponse.data.success) {
                toast.success(conversationResponse.data.message);
                // Optionally navigate to the conversation
                router.push(`/buyer/chat`);
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
        <div className="flex items-center ml-auto gap-x-4">
            <Button
                className='flex items-center px-4 py-2 bg-black rounded-full'
                onClick={() => handleChatWithSeller(session?.user.id as string)}
            >
                <MessageSquare size={20} color='white' />
            </Button>
            <Link
                href={`/store/${storeId}/cart`}
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