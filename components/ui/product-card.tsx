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

    return (
        <>
        <Link
        href={`/store/${data.storeId}/product/${data.id}`}
        // You can remove this if you want a normal cursor:
        className="group cursor-pointer"
        >
        <div className="p-3 space-y-4 bg-white border rounded-xl">
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
                    onClick={onPreview}
                    icon={<Expand size={20} className="text-gray-600 z-50" />}
                />
                <IconButton
                    onClick={onAddToCart}
                    icon={<ShoppingCart size={20} className="text-gray-600 z-50" />}
                />
                </div>
            </div>
            </div>

            {/* Description */}
            <div>
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{data.name}</p>
                <p className="text-sm text-gray-500">{data.category?.name}</p>
            </div>
            <p className="text-sm text-gray-500">{data.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
            {data.price}
            <p>Available Stock: {data.stock}</p>
            </div>
        </div>
        </Link>
        </>
    )
}

export default ProductCard
