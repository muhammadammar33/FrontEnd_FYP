"use client";

import { Product } from "@/types";
import {Button} from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { MouseEventHandler } from "react"
import useCart from "@/hooks/use-cart"

interface InfoProps {
    data: Product;
}
const Info: React.FC<InfoProps> = ({ data }) => {

    const cart = useCart()

    const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log(data)
        event.stopPropagation()
        cart.addItem(data)
    }

    return ( 
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <div className="flex items-end justify-between mt-3">
                <p className="text-sm text-gray-500">{data.description}</p>
                <p className="text-2xl text-gray-900">
                    {data?.price}
                </p>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-6">
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Size:</h3>
                        <div>
                            {data?.size?.value}
                        </div>
                </div>
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Color:</h3>
                    <div className="w-6 h-6 border border-gray-600 rounded-full" style={{ backgroundColor: data?.color?.value }}/>
                </div>
            </div>
                <div className="flex items-center mt-10 gap-x-4">
                    <Button onClick={onAddToCart} className="flex items-center gap-x-2">
                        Add To Cart
                        <ShoppingCart />
                    </Button>
                </div>
        </div>
    );
}

export default Info;