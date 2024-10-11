/* eslint-disable react/no-unescaped-entities */
// components/Preloader.tsx
import React from 'react';
import Image from 'next/image';
import Logo from '../../public/images/mall.jpg';

interface PreloaderProps {
    loading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ loading }) => {
    return (
        <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 to-blue-900 transition-opacity duration-100 ${
            loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <Image className="max-w-full max-h-full" src={Logo} alt="Logo" />
            </div>
        <div className="relative w-full h-full">
            <div className="absolute inset-0 w-1/2 h-full bg-gray-700 origin-left animate-open-left flex items-center justify-end p-5">
                <h1 className="text-9xl font-serif text-sky-300 font-bold text-right">le'ELY</h1>
            </div>
            <div className="absolute inset-0 left-1/2 w-1/2 h-full bg-gray-700 origin-right animate-open-right flex items-center justify-start p-5">
                {/* <div style={{ backgroundImage: 'url("/public/images/Logo.png")', backgroundPosition: 'right center' }} /> */}
                <h1 className="text-9xl font-serif text-sky-300 font-bold text-left">SIAN</h1>
            </div>
        </div>
        </div>
    );
};

export default Preloader;
