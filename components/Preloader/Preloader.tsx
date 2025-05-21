/* eslint-disable react/no-unescaped-entities */
// components/Preloader.tsx
import React from 'react';
import Image from 'next/image';
import BackImg from '../../public/images/mall.jpg';
import { LoginButton } from '../auth/login-button';
import { Button } from '../ui/button';
import Elysian from '@/public/images/Ely.gif';

interface PreloaderProps {
    loading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ loading }) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 to-blue-900 transition-opacity duration-3000 ${
                loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <Image className="absolute inset-0 w-full h-full object-cover" src={BackImg} alt="BackgroundImage" />
                <div className="absolute inset-0 flex flex-col gap-7 items-center justify-center z-10">
                    <Image className="w-80 rounded-full inset-0 object-cover" src={Elysian} alt="Logo" />
                    <LoginButton  asChild>
                        <Button className="w-full py-2 text-gray-800 bg-sky-300 rounded-md hover:bg-gray-800 hover:text-sky-300" variant="secondary" size="lg">
                            Enter Elysian
                        </Button>
                    </LoginButton>
                </div>
            </div>
            <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-e-full w-1/2 h-full bg-gray-700 origin-left animate-open-left flex items-center justify-end p-5 z-50">
                    <h1 className="text-9xl font-serif text-sky-300 font-bold text-right">le'ELY</h1>
                </div>
                <div className="absolute inset-0 rounded-s-full left-1/2 w-1/2 h-full bg-gray-700 origin-right animate-open-right flex items-center justify-start p-5 z-50">
                    <h1 className="text-9xl font-serif text-sky-300 font-bold text-left">SIAN</h1>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
