"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
    label?: string;
    href?: string;
};

export const BackButton = ({ label, href }: BackButtonProps) => {
    return (
        <Button
            className="font-normal text-gray-400 w-full"
            variant="link"
            size="sm"
            asChild
            onClick={() => {}}
        >
            <Link href={href || "#"}>
                {label}
            </Link>
        </Button>
    );
};