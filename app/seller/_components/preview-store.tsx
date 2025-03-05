// app/store/[storeId]/SomeClientButton.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { View } from "lucide-react";
import {useRouter} from "next/navigation";

interface PreviewStoreProps {
    storeId: string;
}

export default function PreviewStore({ storeId }: PreviewStoreProps) {

    const router = useRouter();

    const handleClick = () => {
        window.location.href = `/store/${storeId}`;
        router.refresh();
    };
    return (
        // <Link href={`/store/${storeId}`}>
        <Button onClick={handleClick}>
            <View className="w-4 h-4 mr-2" />
            Preview Store
        </Button>
        // </Link>
    );
}
