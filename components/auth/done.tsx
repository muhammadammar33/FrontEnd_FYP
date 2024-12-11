"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DoneProps {
    label?: string;
    href?: string;
};

export const Done = ({ label, href }: DoneProps) => {
    return (
        <Button
            type="submit"
            className="w-full py-2 text-gray-800 bg-sky-300 rounded-md hover:bg-gray-800 hover:text-sky-300"
            onClick={() => {}}
        >
            <Link href={href || "#"}>
                {label}
            </Link>
        </Button>
    );
};