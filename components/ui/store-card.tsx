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

    const truncateCharacters = (text: string, maxChars: number): string => {
        // If the text is shorter than the limit, return the full text
        if (text.length <= maxChars) {
            return text;
        }
    
        // Otherwise, truncate the text and add an ellipsis
        return text.slice(0, maxChars) + '...';
    };

    return (
        <div onClick={handleClick} className="p-3 space-y-3 bg-gradient-to-r from-white/70 to-sky-300 border rounded-xl cursor-pointer h-[400px] flex flex-col">
            {/* Images and Actions */}
            <div className="relative bg-gray-100 aspect-square rounded-xl">
                <Image
                fill
                src={data.imageUrl}
                alt="Images"
                className="object-cover rounded-md aspect-square"
                />
            </div>

            {/* Description */}
            <div className="flex-grow overflow-hidden">
                <div className="flex items-center justify-between">
                <p className="text-lg text-black font-semibold truncate">{data.name}</p>
                {user?.role === "ADMIN" && (
                    <p className="text-sm text-gray-600 ml-2 whitespace-nowrap">{data.status}</p>
                )}
                </div>
                <div className="h-12 overflow-hidden">
                    <p className="text-sm text-gray-600">{truncateCharacters(data.description, 60)}</p>
                </div>
            </div>

            {/* Approve Button */}
            <div className="mt-auto">
                {user.role === "ADMIN" && data.status === "PENDING" && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the parent onClick from firing
                            handleApprove(data.id);
                        }}
                        className="w-full px-4 py-1.5 text-gray-500 rounded-md border border-gray-800 hover:bg-gray-800 hover:text-white text-sm"
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
                        className="w-full px-4 py-1.5 text-gray-500 rounded-md border border-gray-800 hover:bg-gray-800 hover:text-white text-sm"
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
                        className="w-full px-4 py-1.5 text-gray-500 rounded-md border border-gray-800 hover:bg-gray-800 hover:text-white text-sm"
                        >
                        Archive
                    </button>
                )}
            </div>
        </div>
    );
};

export default StoreCard;