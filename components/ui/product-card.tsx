"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Expand, ShoppingCart } from "lucide-react"
import { MouseEventHandler } from "react"

import IconButton from "@/components/ui/icon-button"
import usePreviewModal from "@/hooks/use-preview-modal"
import useCart from "@/hooks/use-cart"
import { Product } from "@/types"

interface ProductCardProps {
    data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const previewModal = usePreviewModal()
    const cart = useCart()
    
    // For additional logic if needed
    const router = useRouter()

    // Stop click from propagating to <Link> so it doesn't navigate
    const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation()
        previewModal.onOpen(data)
    }

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation()
        cart.addItem(data)
    }

    const truncateCharacters = (text: string, maxChars: number): string => {
        // If the text is shorter than the limit, return the full text
        if (text.length <= maxChars) {
            return text;
        }
    
        // Otherwise, truncate the text and add an ellipsis
        return text.slice(0, maxChars) + '...';
    };

    // Function to truncate words
    const truncateWords = (text: string, maxWords: number): string => {
        const words = text.split(' ');
        if (words.length <= maxWords) {
            return text;
        }
        return words.slice(0, maxWords).join(' ') + '...';
    };

    return (
        <>
        <Link
        href={`/store/${data.storeId}/product/${data.id}`}
        // You can remove this if you want a normal cursor:
        className="group cursor-pointer"
        >
        <div className="p-3 space-y-4 bg-gradient-to-r from-white/70 to-sky-300 border rounded-xl">
            {/* Images and Actions */}
            <div className="relative bg-gray-100 aspect-square rounded-xl">
            <Image
                fill
                src={data.image?.[0]?.url}
                alt="Images"
                className="object-cover rounded-md aspect-square"
            />
            <div className="absolute w-full px-6 transition opacity-0 group-hover:opacity-100 bottom-5">
                <div className="flex justify-center gap-x-6">
                <IconButton
                    // onClick={(e) => {
                    //     e.stopPropagation();
                    //     onPreview;
                    // }}
                    onClick={onPreview}
                    icon={<Expand size={20} className="text-gray-600 z-50" />}
                />
                <IconButton
                onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart;
                    }}
                    icon={<ShoppingCart size={20} className="text-gray-600 z-50" />}
                />
                </div>
            </div>
            </div>

            {/* Description */}
            <div className="h-28 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <p className="text-lg text-black font-semibold truncate">{data.name}</p>
                    <p className="text-sm text-gray-500">{data.category?.name}</p>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {truncateCharacters(data.description, 100)}
                </p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t">
                <p className="font-semibold text-black text-lg">{data.price}</p>
                <p className="text-sm text-gray-600">Stock: {data.stock}</p>
            </div>
        </div>
        </Link>
        </>
    )
}

export default ProductCard
