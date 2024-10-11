/* eslint-disable react/no-unescaped-entities */
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    label: string;
    labeled: string;
}

export const Header = ({ label, labeled }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className={cn("text-1xl font-serif text-gray-300 font-semibold text-center", font)}>
                {label}
            </h1>
            <h1 className={cn("text-3xl font-serif text-sky-300 font-semibold text-center", font)}>
                le'Elysian
            </h1>
            <p className="text-sm text-gray-400 text-center">
                {labeled}
            </p>
        </div>
    );
}