"use client";

import { useRouter } from "next/navigation";
import { Stores } from "@/types";
import axios from "axios";
import Image from "next/image"
import { useCurrentUser } from "@/hooks/use-current-user";

interface ProductCardProps {
    data: Stores;
}

const StoreCard: React.FC<ProductCardProps> = ({ data }) => {
    const router = useRouter();
    const user = useCurrentUser();

    const handleClick = () => {
        router.push(`/store/${data.id}`);
    };

    const handleApprove = async (storeId: string) => {
        console.log("Approving store with ID:", storeId); // Debugging
        try {
            const response = await axios.patch(`/api/${storeId}/approve`);

            if (response.status === 200) {
            alert("Store approved successfully!");
            // Reload the page to reflect the changes
            window.location.reload();
            } else {
            alert("Failed to approve store.");
            }
        } catch (error) {
            console.error("Error approving store:", error);
            alert("An error occurred while approving the store.");
        }
    };

    const handleUnarchive = async (storeId: string) => {
        console.log("Approving store with ID:", storeId); // Debugging
        try {
            const response = await axios.patch(`/api/${storeId}/approve`);

            if (response.status === 200) {
            alert("Store unarchived successfully!");
            // Reload the page to reflect the changes
            window.location.reload();
            } else {
            alert("Failed to unarchive store.");
            }
        } catch (error) {
            console.error("Error approving store:", error);
            alert("An error occurred while unarchiving the store.");
        }
    };
    
    const handleArchive = async (storeId: string) => {
        console.log("Approving store with ID:", storeId); // Debugging
        try {
            const response = await axios.patch(`/api/${storeId}/archive`);

            if (response.status === 200) {
            alert("Store archived successfully!");
            // Reload the page to reflect the changes
            window.location.reload();
            } else {
            alert("Failed to archive store.");
            }
        } catch (error) {
            console.error("Error approving store:", error);
            alert("An error occurred while archiving the store.");
        }
    };

    return (
        <div onClick={handleClick} className="p-3 space-y-4 bg-gradient-to-r from-black/70 to-transparent border rounded-xl cursor-pointer">
        {/* Images and Actions */}
        <div className="relative bg-gray-100 aspect-square rounded-xl">
            <Image
            fill
            src="/images/store.png"
            alt="Images"
            className="object-cover rounded-md aspect-square"
            />
        </div>

        {/* Description */}
        <div>
            <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{data.name}</p>
            {user?.role === "ADMIN" && (
                <p className="text-sm text-gray-500">{data.status}</p>
            )}
            </div>
            <p className="text-sm text-gray-500">{data.description}</p>
        </div>

        {/* Approve Button */}
        {user.role === "ADMIN" && data.status === "PENDING" && (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent onClick from firing
                    handleApprove(data.id);
                }}
                className="px-4 py-2 text-gray-500 rounded-md border border-gray-800 hover:bg-gray-800 hover:text-white"
                >
                Approve
            </button>
        )}
        {user.role === "ADMIN" && data.status === "ARCHIVED" && (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent onClick from firing
                    handleUnarchive(data.id);
                }}
                className="px-4 py-2 text-gray-500 rounded-md border border-gray-800 hover:bg-gray-800 hover:text-white"
                >
                UnArchive
            </button>
        )}
        {user.role === "ADMIN" && data.status === "APPROVED" && (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent onClick from firing
                    handleArchive(data.id);
                }}
                className="px-4 py-2 text-gray-500 rounded-md border border-gray-800 hover:bg-gray-800 hover:text-white"
                >
                Archive
            </button>
        )}
        </div>
    );
};

export default StoreCard;