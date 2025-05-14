"use client";

import { Billboard as BillboardType } from '@/types';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import 'swiper/css';

interface BillboardProps {
    data: BillboardType | BillboardType[];
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    const billboards = Array.isArray(data) ? data : [data];
    const [currentBillboard, setCurrentBillboard] = useState(0);
    
    useEffect(() => {
        if (billboards.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentBillboard((prev) => (prev + 1) % billboards.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [billboards.length]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl">
            <div className="relative aspect-square md:aspect-[2.4/1] overflow-hidden rounded-xl">
                <div 
                    className="flex transition-transform duration-700 ease-in-out h-full w-full"
                    style={{ 
                        transform: `translateX(-${currentBillboard * 100}%)`,
                        width: `${billboards.length * 100}%`
                    }}
                >
                    {billboards.map((billboard, index) => (
                        <div 
                            key={billboard.id}
                            className="relative w-full h-full flex-shrink-0"
                        >
                            <Image
                                src={billboard.imageUrl}
                                alt={billboard.label}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-center">
                                <h2 className="text-3xl font-bold text-white sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
                                    {billboard.label}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Navigation dots - only show if multiple billboards */}
            {billboards.length > 1 && (
                <div className="flex justify-center space-x-3 mt-4">
                    {billboards.map((billboard, index) => (
                        <button
                            key={billboard.id}
                            onClick={() => setCurrentBillboard(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                currentBillboard === index ? "bg-black" : "bg-gray-300"
                            }`}
                            aria-label={`Go to billboard ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Billboard;