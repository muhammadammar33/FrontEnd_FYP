"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { signOut } from "next-auth/react";

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-sky-800">
                    <FaUser className="text-white" />
                </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end">
                {user?.name && (
                    <DropdownMenuLabel className="font-semibold">
                        {user.name}
                    </DropdownMenuLabel>
                )}
            <span
                onClick={() => signOut({ callbackUrl: "/auth/Login" })}
                className="flex items-center cursor-pointer"
                >
                <ExitIcon className="h-4 w-4 mr-2" />
                Logout
            </span>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};