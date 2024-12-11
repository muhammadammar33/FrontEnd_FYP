/* eslint-disable react/no-unescaped-entities */
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
// import Image from 'next/image';
// import Elysian from '@/public/images/Elysian.png';

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    label?: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            {/* <Image className="w-20 rounded-full inset-0 object-cover" src={Elysian} alt="Logo" /> */}
            <h1 className={cn("text-3xl font-serif text-sky-300 font-semibold text-center", font)}>
                le'Elysian
            </h1>
            <p className="text-sm text-gray-400 text-center">
                {label}
            </p>
        </div>
    );
}